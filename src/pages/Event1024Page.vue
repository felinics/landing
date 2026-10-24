<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead, useSeoMeta } from '@unhead/vue'

type Prize = 'go' | 'pro' | 'none'
interface DrawResult {
  prize: Prize
  code?: string
  at: number
}
interface PoolStatus {
  remaining: { pro: number, go: number }
  soldOut: boolean
  notStarted: boolean
  ended: boolean
}
interface EntryResponse extends PoolStatus {
  result?: DrawResult
}
type Phase = 'loading' | 'email' | 'morse' | 'result' | 'soldout' | 'closed' | 'error'

const { locale, t } = useI18n()
const pageUrl = 'https://memoh.ai/1024'
const xHandle = 'memoh_ai'
// The draw runs on the server so the prize pool (1 Pro + 24 Go) and the odds
// can't be bypassed from the browser. In dev, vite.config.ts mocks this API.
const apiBase = import.meta.env.VITE_EVENT_1024_API
  ?? (import.meta.env.DEV ? '/__mock/1024' : 'https://admin.memoh.net/api/events/1024')
const emailKey = 'memoh-1024-email'
// Press shorter than this is a dot, longer is a dash.
const dashThresholdMs = 220
const TARGET = [
  { letter: 'M', code: '--' },
  { letter: 'E', code: '.' },
  { letter: 'M', code: '--' },
  { letter: 'O', code: '---' },
  { letter: 'H', code: '....' },
]

useSeoMeta({
  title: () => t('p1024.seo.title'),
  description: () => t('p1024.seo.description'),
  ogTitle: () => t('p1024.seo.title'),
  ogDescription: () => t('p1024.seo.description'),
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: 'https://memoh.ai/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('p1024.seo.title'),
  twitterDescription: () => t('p1024.seo.description'),
  twitterImage: 'https://memoh.ai/logo.png',
})

useHead({
  htmlAttrs: { lang: computed(() => locale.value) },
  link: [{ rel: 'canonical', href: pageUrl }],
})

const phase = ref<Phase>('loading')
const email = ref('')
const submitting = ref(false)
const formError = ref('')
const pool = ref<PoolStatus | null>(null)
const buffer = ref('')
const pressing = ref(false)
const pressStart = ref(0)
const pressMs = ref(0)
const shake = ref(false)
const drawing = ref(false)
const result = ref<DrawResult | null>(null)
const log = ref<string[]>([])
const letterIndex = ref(0)

const done = computed(() => letterIndex.value >= TARGET.length)
const won = computed(() => result.value?.prize === 'pro' || result.value?.prize === 'go')
const prizeName = computed(() => result.value?.prize === 'pro' ? 'Pro' : 'Go')
const pressIsDash = computed(() => pressMs.value >= dashThresholdMs)
const resultTime = computed(() => result.value
  ? new Date(result.value.at).toLocaleString(({ zh: 'zh-CN', ja: 'ja-JP' } as Record<string, string>)[locale.value] ?? 'en-US', { hour12: false })
  : '')

class ApiError extends Error {
  status: number
  constructor(status: number, message: string) {
    super(message)
    this.status = status
  }
}

async function api<T>(path: string, body?: unknown): Promise<T> {
  const res = await fetch(`${apiBase}${path}`, body === undefined
    ? undefined
    : { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  const data = await res.json().catch(() => undefined) as (T & { error?: string }) | undefined
  if (!res.ok) throw new ApiError(res.status, data?.error || t('p1024.errors.network'))
  return data as T
}

// Ended / not started wins over sold out: it explains why nobody can play.
const closedPhase = (status: PoolStatus): Phase | null =>
  status.notStarted || status.ended ? 'closed' : status.soldOut ? 'soldout' : null

function showResult(r: DrawResult) {
  result.value = r
  letterIndex.value = TARGET.length
  phase.value = 'result'
}

async function loadStatus() {
  try {
    pool.value = await api<PoolStatus>('/status')
    const saved = localStorage.getItem(emailKey)
    if (saved) {
      email.value = saved
      await submitEmail()
      return
    }
    phase.value = closedPhase(pool.value) ?? 'email'
  } catch {
    phase.value = 'error'
  }
}

async function submitEmail() {
  const value = email.value.trim().toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    formError.value = t('p1024.email.invalid')
    phase.value = 'email'
    return
  }
  submitting.value = true
  formError.value = ''
  try {
    const entry = await api<EntryResponse>('/entry', { email: value })
    pool.value = entry
    email.value = value
    try { localStorage.setItem(emailKey, value) } catch { /* private mode */ }
    // An email that already drew sees its result even after the pool is empty.
    if (entry.result) showResult(entry.result)
    else phase.value = closedPhase(entry) ?? 'morse'
  } catch (e) {
    formError.value = e instanceof Error ? e.message : t('p1024.errors.network')
    phase.value = 'email'
  } finally {
    submitting.value = false
  }
}

function changeEmail() {
  try { localStorage.removeItem(emailKey) } catch { /* private mode */ }
  result.value = null
  letterIndex.value = 0
  buffer.value = ''
  log.value = []
  phase.value = (pool.value && closedPhase(pool.value)) ?? 'email'
}

// --- telegraph beep ---
let audio: AudioContext | null = null
let osc: OscillatorNode | null = null
function beepOn() {
  try {
    audio ??= new AudioContext()
    const gain = audio.createGain()
    gain.gain.value = 0.06
    gain.connect(audio.destination)
    osc = audio.createOscillator()
    osc.type = 'sine'
    osc.frequency.value = 660
    osc.connect(gain)
    osc.start()
  } catch {
    osc = null
  }
}
function beepOff() {
  osc?.stop()
  osc = null
}

let raf = 0
function tick() {
  pressMs.value = performance.now() - pressStart.value
  raf = requestAnimationFrame(tick)
}

function press() {
  if (pressing.value || done.value || phase.value !== 'morse') return
  pressing.value = true
  pressStart.value = performance.now()
  pressMs.value = 0
  beepOn()
  raf = requestAnimationFrame(tick)
}

function release() {
  if (!pressing.value) return
  pressing.value = false
  cancelAnimationFrame(raf)
  beepOff()
  const symbol = performance.now() - pressStart.value >= dashThresholdMs ? '-' : '.'
  pressMs.value = 0
  input(symbol)
}

function input(symbol: string) {
  const expected = TARGET[letterIndex.value].code
  const next = buffer.value + symbol
  if (!expected.startsWith(next)) {
    log.value.unshift(t('p1024.log.miss', { letter: TARGET[letterIndex.value].letter }))
    buffer.value = ''
    shake.value = true
    setTimeout(() => { shake.value = false }, 400)
    return
  }
  buffer.value = next
  if (next === expected) {
    log.value.unshift(t('p1024.log.hit', { letter: TARGET[letterIndex.value].letter }))
    buffer.value = ''
    letterIndex.value++
    if (done.value) draw()
  }
}

async function draw() {
  drawing.value = true
  const started = Date.now()
  try {
    const res = await api<EntryResponse & { result: DrawResult }>('/draw', { email: email.value })
    pool.value = res
    // Keep the "receiving signal" beat even when the API answers instantly.
    await new Promise(r => setTimeout(r, Math.max(0, 1400 - (Date.now() - started))))
    showResult(res.result)
  } catch (e) {
    if (e instanceof ApiError && (e.status === 410 || e.status === 403)) {
      phase.value = e.status === 410 ? 'soldout' : 'closed'
    } else {
      log.value.unshift(`[ERR ] ${e instanceof Error ? e.message : t('p1024.errors.network')}`)
      letterIndex.value = 0
    }
  } finally {
    drawing.value = false
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  e.preventDefault()
  if (!e.repeat) press()
}
function onKeyUp(e: KeyboardEvent) {
  if (e.code !== 'Space') return
  e.preventDefault()
  release()
}

onMounted(() => {
  loadStatus()
  window.addEventListener('keydown', onKeyDown)
  window.addEventListener('keyup', onKeyUp)
  window.addEventListener('blur', release)
})
onBeforeUnmount(() => {
  window.removeEventListener('keydown', onKeyDown)
  window.removeEventListener('keyup', onKeyUp)
  window.removeEventListener('blur', release)
  cancelAnimationFrame(raf)
  beepOff()
  audio?.close()
})

const followUrl = `https://x.com/intent/follow?screen_name=${xHandle}`
const profileUrl = `https://x.com/${xHandle}`
const shareUrl = computed(() => {
  if (!won.value) return ''
  const text = t('p1024.share.text', { plan: prizeName.value })
  const params = new URLSearchParams({ text, url: pageUrl, hashtags: t('p1024.share.hashtags') })
  return `https://x.com/intent/post?${params}`
})
</script>

<template>
  <main class="ev">
    <div class="ev-scan" aria-hidden="true" />

    <section class="ev-inner">
      <header class="ev-head">
        <p class="ev-kicker">&gt; memoh --event 1024</p>
        <h1 class="ev-title" :class="{ 'is-long': locale === 'ja' }">
          <span class="ev-title-num">1024</span>
          <span>{{ t('p1024.title') }}</span>
        </h1>
        <p class="ev-sub">{{ t('p1024.subtitle') }}</p>
        <p class="ev-dates">{{ t('p1024.dates') }}</p>
        <p v-if="pool" class="ev-pool">
          <span>{{ t('p1024.pool.left') }}</span>
          <b class="is-pro">Pro × {{ pool.remaining.pro }}</b>
          <b>Go × {{ pool.remaining.go }}</b>
        </p>
      </header>

      <!-- Morse board -->
      <div class="ev-board" :class="{ 'is-shake': shake }">
        <div
          v-for="(item, i) in TARGET"
          :key="i"
          class="ev-letter"
          :class="{ 'is-done': i < letterIndex, 'is-active': phase === 'morse' && i === letterIndex && !done }"
        >
          <span class="ev-letter-char">{{ item.letter }}</span>
          <span class="ev-letter-code">
            <i
              v-for="(s, j) in item.code"
              :key="j"
              :class="[s === '-' ? 'dash' : 'dot', { lit: i < letterIndex || (i === letterIndex && j < buffer.length) }]"
            />
          </span>
        </div>
      </div>

      <p v-if="phase === 'loading'" class="ev-hint">{{ t('p1024.loading') }}<span class="ev-caret">_</span></p>

      <div v-else-if="phase === 'error'" class="ev-panel">
        <p>{{ t('p1024.errors.status') }}</p>
        <button type="button" class="ev-btn" @click="phase = 'loading'; loadStatus()">{{ t('p1024.errors.retry') }}</button>
      </div>

      <!-- Outside the event window -->
      <div v-else-if="phase === 'closed'" class="ev-panel ev-soldout">
        <p class="ev-soldout-stamp">{{ pool?.notStarted ? 'SOON' : 'CLOSED' }}</p>
        <p class="ev-soldout-title">{{ t(pool?.notStarted ? 'p1024.closed.soonTitle' : 'p1024.closed.endedTitle') }}</p>
        <p>{{ t(pool?.notStarted ? 'p1024.closed.soonBody' : 'p1024.closed.endedBody') }}</p>
        <div class="ev-panel-actions">
          <a :href="followUrl" target="_blank" rel="noopener noreferrer" class="ev-btn">{{ t('p1024.steps.followBtn') }}</a>
          <button v-if="pool?.ended" type="button" class="ev-btn ev-btn-ghost" @click="phase = 'email'">{{ t('p1024.soldout.check') }}</button>
        </div>
      </div>

      <!-- Sold out -->
      <div v-else-if="phase === 'soldout'" class="ev-panel ev-soldout">
        <p class="ev-soldout-stamp">SOLD OUT</p>
        <p class="ev-soldout-title">{{ t('p1024.soldout.title') }}</p>
        <i18n-t keypath="p1024.soldout.body" tag="p" scope="global"><template #handle><a :href="profileUrl" target="_blank" rel="noopener noreferrer" class="ev-handle">@memoh_ai</a></template></i18n-t>
        <div class="ev-panel-actions">
          <a :href="followUrl" target="_blank" rel="noopener noreferrer" class="ev-btn">{{ t('p1024.steps.followBtn') }}</a>
          <button type="button" class="ev-btn ev-btn-ghost" @click="phase = 'email'">{{ t('p1024.soldout.check') }}</button>
        </div>
      </div>

      <!-- Email gate -->
      <form v-else-if="phase === 'email'" class="ev-panel ev-email" @submit.prevent="submitEmail">
        <label for="ev-email">{{ t('p1024.email.label') }}</label>
        <p class="ev-email-help">{{ t('p1024.email.help') }}</p>
        <div class="ev-email-row">
          <input
            id="ev-email"
            v-model="email"
            type="email"
            autocomplete="email"
            required
            :disabled="submitting"
            :placeholder="t('p1024.email.placeholder')"
            @keydown.space.stop
            @keyup.space.stop
          />
          <button type="submit" class="ev-btn" :disabled="submitting">
            {{ submitting ? t('p1024.email.submitting') : t('p1024.email.submit') }}
          </button>
        </div>
        <p v-if="formError" class="ev-email-error">{{ formError }}</p>
      </form>

      <!-- Key -->
      <template v-else-if="phase === 'morse'">
        <button
          type="button"
          class="ev-key"
          :class="{ 'is-down': pressing, 'is-dash': pressing && pressIsDash }"
          :disabled="done"
          :aria-label="t('p1024.key')"
          @pointerdown.prevent="press"
          @pointerup.prevent="release"
          @pointerleave="release"
          @pointercancel="release"
          @keydown.space.prevent
          @keyup.space.prevent
        >
          <span class="ev-key-cap">SPACE</span>
          <span class="ev-key-meter"><span :style="{ width: `${Math.min(pressMs / dashThresholdMs, 1) * 100}%` }" /></span>
        </button>
        <p class="ev-hint">
          <template v-if="drawing">{{ t('p1024.drawing') }}<span class="ev-caret">_</span></template>
          <template v-else>{{ t('p1024.hint') }}</template>
        </p>
        <p class="ev-as">{{ t('p1024.email.as', { email }) }} · <button type="button" @click="changeEmail">{{ t('p1024.email.change') }}</button></p>
        <ul class="ev-log" aria-live="polite">
          <li v-for="(line, i) in log.slice(0, 4)" :key="log.length - i">{{ line }}</li>
        </ul>
      </template>

      <!-- No prize -->
      <div v-else-if="result && !won" class="ev-panel">
        <p class="ev-soldout-title">{{ t('p1024.lose.title') }}</p>
        <p>{{ t('p1024.lose.body') }}</p>
        <p class="ev-as">{{ t('p1024.email.as', { email }) }} · {{ resultTime }}</p>
        <div class="ev-panel-actions">
          <a :href="followUrl" target="_blank" rel="noopener noreferrer" class="ev-btn">{{ t('p1024.steps.followBtn') }}</a>
        </div>
      </div>

      <!-- Result -->
      <div v-else-if="result" class="ev-result">
        <div class="ev-ticket" :class="`is-${result.prize}`">
          <div class="ev-ticket-top">
            <img src="/logo.png" alt="" class="ev-ticket-logo" />
            <span>MEMOH · 1024</span>
          </div>
          <p class="ev-ticket-label">{{ t('p1024.result.won') }}</p>
          <p class="ev-ticket-prize">Memoh {{ prizeName }}</p>
          <p class="ev-ticket-plan">{{ t(`p1024.result.${result.prize}`) }}</p>
          <dl class="ev-ticket-meta">
            <div><dt>{{ t('p1024.result.email') }}</dt><dd>{{ email }}</dd></div>
            <div><dt>{{ t('p1024.result.code') }}</dt><dd>{{ result.code }}</dd></div>
            <div><dt>{{ t('p1024.result.time') }}</dt><dd>{{ resultTime }}</dd></div>
          </dl>
          <p class="ev-ticket-morse">-- . -- --- ....</p>
        </div>
        <a :href="shareUrl" target="_blank" rel="noopener noreferrer" class="ev-btn ev-share">
          <span aria-hidden="true" class="ev-x-icon" />
          {{ t('p1024.share.btn') }}
        </a>
        <ol class="ev-steps">
          <li>
            <span class="ev-step-n">01</span>
            <div>
              <p>{{ t('p1024.steps.screenshot') }}</p>
            </div>
          </li>
          <li>
            <span class="ev-step-n">02</span>
            <div>
              <i18n-t keypath="p1024.steps.follow" tag="p" scope="global"><template #handle><a :href="profileUrl" target="_blank" rel="noopener noreferrer" class="ev-handle">@memoh_ai</a></template></i18n-t>
              <a :href="followUrl" target="_blank" rel="noopener noreferrer" class="ev-btn">{{ t('p1024.steps.followBtn') }}</a>
            </div>
          </li>
          <li>
            <span class="ev-step-n">03</span>
            <div>
              <p>{{ t('p1024.steps.send') }}</p>
              <a :href="profileUrl" target="_blank" rel="noopener noreferrer" class="ev-btn ev-btn-ghost">{{ t('p1024.steps.sendBtn') }}</a>
            </div>
          </li>
        </ol>
      </div>

      <section class="ev-rules">
        <h2>{{ t('p1024.rules.title') }}</h2>
        <ul>
          <li>{{ t('p1024.rules.time') }}</li>
          <li>{{ t('p1024.rules.one') }}</li>
          <li>{{ t('p1024.rules.two') }}</li>
          <i18n-t keypath="p1024.rules.three" tag="li" scope="global"><template #handle><a :href="profileUrl" target="_blank" rel="noopener noreferrer" class="ev-handle">@memoh_ai</a></template></i18n-t>
          <li>{{ t('p1024.rules.four') }}</li>
          <li>{{ t('p1024.rules.five') }}</li>
        </ul>
      </section>
    </section>
  </main>
</template>

<style scoped>
.ev {
  --ev-green: #7cffb2;
  --ev-amber: #ffc94d;
  --ev-violet: #c4b5fd;
  --ev-dim: rgba(124, 255, 178, 0.45);
  position: relative;
  width: 100%;
  min-height: calc(100vh - 3.5rem);
  padding: 120px 20px 96px;
  color: var(--ev-green);
  font-family: var(--font-mono);
  overflow: hidden;
}
.ev-scan {
  position: absolute;
  inset: 0;
  pointer-events: none;
  background:
    radial-gradient(ellipse at 50% 20%, rgba(124, 255, 178, 0.08), transparent 60%),
    repeating-linear-gradient(to bottom, rgba(255, 255, 255, 0.025) 0 1px, transparent 1px 3px);
}
.ev-inner {
  position: relative;
  max-width: 760px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 40px;
}
.ev-head { text-align: center; }
.ev-kicker { color: var(--ev-dim); font-size: 13px; letter-spacing: 0.04em; }
.ev-title {
  margin-top: 14px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: baseline;
  gap: 4px 16px;
  font-family: var(--font-sans);
  font-size: clamp(30px, 6vw, 52px);
  font-weight: 700;
  line-height: 1.1;
  color: #f4f4f5;
}
.ev-title.is-long { font-size: clamp(26px, 4.6vw, 44px); }
.ev-title-num {
  font-family: var(--font-mono);
  color: var(--ev-amber);
  text-shadow: 0 0 24px rgba(255, 201, 77, 0.45);
}
.ev-sub {
  margin-top: 16px;
  color: #a1a1aa;
  font-family: var(--font-sans);
  font-size: 16px;
  line-height: 1.7;
  white-space: pre-line;
}

.ev-board { display: flex; gap: 14px; flex-wrap: wrap; justify-content: center; }
.ev-board.is-shake { animation: ev-shake 0.36s; }
.ev-letter {
  width: 104px;
  padding: 16px 8px 14px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  border: 1px solid rgba(124, 255, 178, 0.18);
  border-radius: 10px;
  background: rgba(124, 255, 178, 0.03);
  transition: border-color 160ms, background 160ms, box-shadow 160ms;
}
.ev-letter.is-active { border-color: var(--ev-green); box-shadow: 0 0 0 3px rgba(124, 255, 178, 0.12); }
.ev-letter.is-done { border-color: rgba(255, 201, 77, 0.6); background: rgba(255, 201, 77, 0.06); }
.ev-letter-char { font-size: 30px; font-weight: 600; color: #e4e4e7; }
.ev-letter.is-done .ev-letter-char { color: var(--ev-amber); }
.ev-letter-code { display: flex; gap: 5px; align-items: center; height: 10px; }
.ev-letter-code i { display: block; height: 8px; border-radius: 4px; background: rgba(124, 255, 178, 0.2); transition: background 120ms, box-shadow 120ms; }
.ev-letter-code i.dot { width: 8px; }
.ev-letter-code i.dash { width: 22px; }
.ev-letter-code i.lit { background: var(--ev-green); box-shadow: 0 0 8px var(--ev-green); }
.ev-letter.is-done .ev-letter-code i.lit { background: var(--ev-amber); box-shadow: 0 0 8px var(--ev-amber); }

.ev-key {
  width: min(100%, 440px);
  height: 92px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  border: 1px solid rgba(124, 255, 178, 0.4);
  border-bottom-width: 6px;
  border-radius: 14px;
  background: #0f1512;
  color: var(--ev-green);
  cursor: pointer;
  touch-action: none;
  user-select: none;
  -webkit-user-select: none;
  transition: transform 60ms, border-bottom-width 60ms, background 120ms;
}
.ev-key.is-down { transform: translateY(4px); border-bottom-width: 2px; background: #13201a; }
.ev-key.is-dash { border-color: var(--ev-amber); color: var(--ev-amber); }
.ev-key:disabled { opacity: 0.5; cursor: default; }
.ev-key-cap { font-size: 15px; letter-spacing: 0.4em; }
.ev-key-meter { width: 60%; height: 3px; border-radius: 2px; background: rgba(124, 255, 178, 0.12); overflow: hidden; }
.ev-key-meter span { display: block; height: 100%; background: currentColor; }
.ev-hint { margin-top: -20px; color: var(--ev-dim); font-size: 13px; text-align: center; }
.ev-caret { animation: ev-blink 0.8s steps(1) infinite; }
.ev-log { margin-top: -24px; min-height: 80px; font-size: 12px; color: var(--ev-dim); text-align: center; line-height: 20px; }
.ev-log li:first-child { color: var(--ev-green); }

.ev-result { width: 100%; display: grid; grid-template-columns: minmax(0, 340px) minmax(0, 1fr); gap: 32px; align-items: start; }
.ev-ticket {
  position: relative;
  padding: 22px 22px 18px;
  border-radius: 16px;
  background: linear-gradient(160deg, #1a1630, #0c0c14 70%);
  border: 1px solid rgba(196, 181, 253, 0.35);
  color: #e4e4e7;
  animation: ev-pop 0.5s cubic-bezier(0.2, 1.4, 0.4, 1);
}
.ev-ticket.is-pro { background: linear-gradient(160deg, #3a2a08, #0c0c14 70%); border-color: rgba(255, 201, 77, 0.6); box-shadow: 0 0 48px rgba(255, 201, 77, 0.18); }
.ev-ticket-top { display: flex; align-items: center; gap: 8px; font-size: 12px; letter-spacing: 0.12em; color: #a1a1aa; }
.ev-ticket-logo { width: 18px; height: 18px; filter: brightness(0) invert(1); }
.ev-ticket-label { margin-top: 26px; font-family: var(--font-sans); font-size: 14px; color: #a1a1aa; }
.ev-ticket-prize { margin-top: 4px; font-family: var(--font-sans); font-size: 40px; font-weight: 700; line-height: 1.1; color: var(--ev-violet); }
.ev-ticket.is-pro .ev-ticket-prize { color: var(--ev-amber); }
.ev-ticket-plan { margin-top: 6px; font-family: var(--font-sans); font-size: 13px; color: #a1a1aa; }
.ev-ticket-meta { margin-top: 22px; padding-top: 14px; border-top: 1px dashed rgba(255, 255, 255, 0.18); display: grid; gap: 6px; font-size: 12px; }
.ev-ticket-meta div { display: flex; justify-content: space-between; gap: 12px; }
.ev-ticket-meta dt { color: #71717a; }
.ev-ticket-meta dd { color: #e4e4e7; }
.ev-ticket-morse { margin-top: 16px; font-size: 13px; letter-spacing: 0.3em; color: rgba(255, 255, 255, 0.28); text-align: center; }

.ev-steps { grid-column: 2; grid-row: 1 / span 2; display: flex; flex-direction: column; gap: 18px; font-family: var(--font-sans); }
.ev-steps li { display: flex; gap: 14px; }
.ev-steps p { color: #d4d4d8; font-size: 15px; line-height: 1.6; }
.ev-step-n { font-family: var(--font-mono); color: var(--ev-amber); font-size: 14px; padding-top: 2px; }
.ev-btn {
  margin-top: 10px;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  height: 36px;
  padding: 0 16px;
  border-radius: 999px;
  background: #f4f4f5;
  color: #09090b;
  font-size: 13px;
  font-weight: 600;
  transition: opacity 160ms;
}
.ev-btn:hover { opacity: 0.85; }
.ev-share { grid-column: 1; justify-self: stretch; justify-content: center; gap: 8px; height: 42px; margin-top: -16px; }
.ev-x-icon {
  width: 13px;
  height: 13px;
  background-color: currentColor;
  mask: url('/brands/x.svg') center / contain no-repeat;
  -webkit-mask: url('/brands/x.svg') center / contain no-repeat;
}
.ev-btn-ghost { background: transparent; color: #f4f4f5; border: 1px solid rgba(255, 255, 255, 0.3); }

.ev-dates { margin-top: 14px; font-size: 13px; color: var(--ev-amber); letter-spacing: 0.02em; }
.ev-pool { margin-top: 12px; display: inline-flex; gap: 10px; align-items: center; padding: 6px 14px; border: 1px solid rgba(124, 255, 178, 0.2); border-radius: 999px; font-size: 13px; color: var(--ev-dim); }
.ev-pool b { color: var(--ev-violet); font-weight: 600; }
.ev-pool b.is-pro { color: var(--ev-amber); }
.ev-panel {
  width: min(100%, 520px);
  padding: 24px;
  border: 1px solid rgba(124, 255, 178, 0.22);
  border-radius: 14px;
  background: rgba(15, 21, 18, 0.85);
  font-family: var(--font-sans);
  color: #d4d4d8;
  font-size: 15px;
  line-height: 1.7;
  text-align: center;
}
.ev-panel-actions { margin-top: 8px; display: flex; gap: 10px; justify-content: center; flex-wrap: wrap; }
.ev-soldout-stamp { display: inline-block; padding: 2px 12px; border: 2px solid #f87171; border-radius: 6px; color: #f87171; font-family: var(--font-mono); font-size: 13px; letter-spacing: 0.3em; transform: rotate(-4deg); }
.ev-soldout-title { margin-top: 10px; font-size: 22px; font-weight: 700; color: #f4f4f5; }
.ev-email { text-align: left; }
.ev-email label { font-size: 16px; font-weight: 600; color: #f4f4f5; }
.ev-email-help { margin-top: 4px; font-size: 13px; color: #a1a1aa; }
.ev-email-row { margin-top: 14px; display: flex; gap: 10px; }
.ev-email-row input {
  flex: 1;
  min-width: 0;
  height: 42px;
  padding: 0 14px;
  border: 1px solid rgba(124, 255, 178, 0.3);
  border-radius: 999px;
  background: #09090b;
  color: #f4f4f5;
  font-family: var(--font-mono);
  font-size: 14px;
  outline: none;
}
.ev-email-row input:focus { border-color: var(--ev-green); box-shadow: 0 0 0 3px rgba(124, 255, 178, 0.15); }
.ev-email-row .ev-btn { margin-top: 0; height: 42px; flex-shrink: 0; }
.ev-btn:disabled { opacity: 0.6; cursor: default; }
.ev-email-error { margin-top: 10px; font-size: 13px; color: #f87171; }
.ev-as { margin-top: -28px; font-size: 12px; color: #71717a; text-align: center; }
.ev-panel .ev-as { margin-top: 10px; }
.ev-as button { color: var(--ev-dim); text-decoration: underline; text-underline-offset: 3px; }
.ev-handle { color: var(--ev-green); text-decoration: underline; text-underline-offset: 3px; }
.ev-handle:hover { color: #f4f4f5; }
.ev-rules { width: 100%; padding-top: 24px; border-top: 1px solid rgba(124, 255, 178, 0.14); font-family: var(--font-sans); }
.ev-rules h2 { font-family: var(--font-mono); font-size: 13px; color: var(--ev-dim); }
.ev-rules ul { margin-top: 12px; display: grid; gap: 6px; color: #71717a; font-size: 13px; line-height: 1.6; list-style: disc; padding-left: 18px; }

@keyframes ev-shake {
  20%, 60% { transform: translateX(-8px); }
  40%, 80% { transform: translateX(8px); }
}
@keyframes ev-blink { 50% { opacity: 0; } }
@keyframes ev-pop {
  from { transform: scale(0.85) rotate(-2deg); opacity: 0; }
  to { transform: none; opacity: 1; }
}
@media (max-width: 680px) {
  .ev { padding-top: 96px; }
  .ev-board { gap: 8px; }
  .ev-letter { width: 58px; padding: 12px 4px; }
  .ev-letter-char { font-size: 22px; }
  .ev-letter-code { gap: 3px; }
  .ev-letter-code i.dot { width: 6px; }
  .ev-letter-code i.dash { width: 12px; }
  .ev-result { grid-template-columns: 1fr; }
  .ev-steps { grid-column: 1; grid-row: auto; }
}
@media (prefers-reduced-motion: reduce) {
  .ev-board.is-shake, .ev-ticket, .ev-caret { animation: none; }
}
</style>
