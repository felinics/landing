<script setup lang="ts">
// S3 渠道：同一个 Ta，在你已经在用的地方各做一件真实的小事——证明「在哪都能找到 Ta」。
// 视角=用户：自己的消息在右，Ta 的回复在左。每个平台原生深色样式 + 不同对话 + 不同轮数：
//  · desktop  2 轮｜telegram 3 轮｜wechat 2 轮｜discord 2 轮——长短不一，但都控制在一屏内不溢出。
//  · desktop  = Memoh 原生聊天（用户右品牌气泡 + 助手左纯文本）
//  · telegram = Telegram 原生（蓝色发出气泡 + 深色来向气泡，头部含在线状态）
//  · wechat   = 微信原生（绿色发出气泡黑字 + 深灰来向气泡）
//  · discord  = 扁平列表（频道 + 彩色用户名 + 正文）
//
// 滚到视口时「逐条播放」，且各平台还原各自的真实手感：
//  · desktop / telegram = Ta 的回复逐字「流式」吐出（带光标）——像真实 chat UI。
//  · wechat / discord   = 不流式，Ta 思考片刻后整条消息直接出现。
//  · 四个平台的起始 / 思考 / 回复节奏各不相同，刻意错开，不会齐刷刷一起动。
// 尊重 prefers-reduced-motion：直接铺满，不播放。
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useI18n } from 'vue-i18n'

type Platform = 'desktop' | 'telegram' | 'wechat' | 'discord'
const props = defineProps<{ platform: Platform }>()
const { t } = useI18n()

const page = computed(() => ({
  desktop: '#0b0b0e',
  telegram: '#0e1621',
  wechat: '#1a1a1a',
  discord: '#313338',
}[props.platform]))

const rounds = { desktop: 2, telegram: 3, wechat: 2, discord: 2 } as const

// 平台各自的节奏（ms）。start 错开入场，think 错开「响应时间」，speed 控制流式快慢。
const timing: Record<Platform, {
  start: number; afterUser: number; think: number; afterAgent: number; stream: boolean; speed?: number
}> = {
  desktop:  { start: 200,  afterUser: 620, think: 420,  afterAgent: 600, stream: true,  speed: 26 },
  telegram: { start: 750,  afterUser: 760, think: 680,  afterAgent: 640, stream: true,  speed: 19 },
  wechat:   { start: 1150, afterUser: 600, think: 920,  afterAgent: 720, stream: false },
  discord:  { start: 480,  afterUser: 820, think: 1280, afterAgent: 760, stream: false },
}
const conf = computed(() => timing[props.platform])

// 完整消息序列（user/agent 交替）。
const seq = computed(() => {
  const out: { side: 'user' | 'agent'; key: string }[] = []
  for (let i = 1; i <= rounds[props.platform]; i++) {
    out.push({ side: 'user', key: `proof.channel.${props.platform}.u${i}` })
    out.push({ side: 'agent', key: `proof.channel.${props.platform}.a${i}` })
  }
  return out
})

// ── 播放状态 ──────────────────────────────────────────────────
interface Bubble { side: 'user' | 'agent'; text: string; key: number }
const rendered = ref<Bubble[]>([])      // 已经/正在显示的气泡
const streamingKey = ref<number | null>(null)  // 正在流式输出的气泡 key（用于光标）

const root = ref<HTMLElement>()
let observer: IntersectionObserver | null = null
const timers: number[] = []
const wait = (fn: () => void, ms: number) => { timers.push(window.setTimeout(fn, ms)) }

function play() {
  const c = conf.value
  const list = seq.value
  let i = 0

  const next = () => {
    if (i >= list.length) return
    const m = list[i]

    if (m.side === 'user') {
      rendered.value.push({ side: 'user', text: t(m.key), key: i })
      i++
      wait(next, c.afterUser)
      return
    }

    // agent：先思考片刻
    wait(() => {
      if (c.stream) {
        const key = i
        rendered.value.push({ side: 'agent', text: '', key })
        const bubble = rendered.value[rendered.value.length - 1]  // 取响应式代理再 mutate
        const chars = Array.from(t(m.key))
        streamingKey.value = key
        let n = 0
        const tick = () => {
          n += 1
          bubble.text = chars.slice(0, n).join('')
          if (n < chars.length) {
            wait(tick, c.speed ?? 24)
          } else {
            streamingKey.value = null
            i++
            wait(next, c.afterAgent)
          }
        }
        wait(tick, c.speed ?? 24)
      } else {
        // 不流式：整条直接出现
        rendered.value.push({ side: 'agent', text: t(m.key), key: i })
        i++
        wait(next, c.afterAgent)
      }
    }, c.think)
  }

  wait(next, c.start)
}

onMounted(() => {
  const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches
  if (reduce || typeof IntersectionObserver === 'undefined') {
    rendered.value = seq.value.map((m, i) => ({ side: m.side, text: t(m.key), key: i }))
    return
  }
  observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (e.isIntersecting) {
        observer?.disconnect()
        play()
      }
    }
  }, { threshold: 0.4 })
  if (root.value) observer.observe(root.value)
})

onUnmounted(() => {
  observer?.disconnect()
  timers.forEach(clearTimeout)
})

const im = {
  telegram: {
    header: '#17212b',
    online: true,
    inBubble: 'bg-[#182533] text-white rounded-2xl rounded-bl-sm',
    outBubble: 'bg-[#2b5278] text-white rounded-2xl rounded-br-sm',
  },
  wechat: {
    header: '#1f1f1f',
    online: false,
    inBubble: 'bg-[#2c2c2e] text-[#ededed] rounded-md',
    outBubble: 'bg-[#95ec69] text-black rounded-md',
  },
} as const

const cfg = computed(() => im[props.platform as 'telegram' | 'wechat'])
</script>

<template>
  <div ref="root" class="proof-surface w-full overflow-hidden md:h-full" :style="{ backgroundColor: page }">
    <!-- Memoh 原生聊天：用户右品牌气泡 + 助手左纯文本（流式） -->
    <div v-if="platform === 'desktop'" class="flex flex-col md:h-full">
      <div class="flex shrink-0 items-center border-b border-white/[0.06] px-4 py-3 md:px-3.5 md:py-2.5">
        <span class="text-[13px] font-[550] tracking-[-0.02em] text-white/70 md:text-[11px]">Felinic</span>
      </div>
      <TransitionGroup name="msg" tag="div" class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2.5 md:p-3">
        <div v-for="m in rendered" :key="m.key" :class="m.side === 'user' ? 'flex justify-end' : ''">
          <p v-if="m.side === 'user'" class="w-fit max-w-[86%] rounded-2xl bg-chat-user-bubble px-3.5 py-2 text-[14px] leading-snug text-chat-user-bubble-fg md:px-3 md:py-1.5 md:text-[11.5px]">{{ m.text }}</p>
          <p v-else class="text-[14px] leading-relaxed text-foreground/90 md:text-[11.5px]">{{ m.text }}</p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Telegram / WeChat 原生气泡（telegram 流式，wechat 直接出现） -->
    <div v-else-if="platform === 'telegram' || platform === 'wechat'" class="flex flex-col md:h-full">
      <div class="flex shrink-0 flex-col justify-center px-4 py-2.5 md:px-3.5 md:py-2" :style="{ backgroundColor: cfg.header }">
        <p class="text-[13px] font-medium leading-tight text-white md:text-[12px]">Felinic</p>
        <p v-if="cfg.online" class="text-[11px] leading-tight text-[#6cb1e1] md:text-[10px]">{{ t('proof.channel.online') }}</p>
      </div>
      <TransitionGroup name="msg" tag="div" class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2 md:p-3">
        <div v-for="m in rendered" :key="m.key" class="flex" :class="m.side === 'user' ? 'justify-end' : ''">
          <p class="max-w-[82%] px-3 py-2 text-[14px] leading-snug md:px-2.5 md:py-1.5 md:text-[11.5px]" :class="m.side === 'user' ? cfg.outBubble : cfg.inBubble">{{ m.text }}<span v-if="m.side === 'agent' && m.key === streamingKey" class="cursor" aria-hidden="true" /></p>
        </div>
      </TransitionGroup>
    </div>

    <!-- Discord 扁平列表：彩色用户名 + 正文（直接出现） -->
    <div v-else class="flex flex-col md:h-full">
      <div class="flex shrink-0 items-center bg-[#2b2d31] px-4 py-3 md:px-3 md:py-2.5">
        <span class="truncate text-[13px] font-semibold text-white/90 md:text-[12px]">{{ t('proof.channel.discord.channel') }}</span>
      </div>
      <TransitionGroup name="msg" tag="div" class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2 md:p-3">
        <div v-for="m in rendered" :key="m.key" class="min-w-0">
          <span class="text-[12px] font-medium leading-tight md:text-[11px]" :class="m.side === 'user' ? 'text-[#949ba4]' : 'text-[#c8a2ff]'">{{ m.side === 'user' ? t('proof.channel.you') : 'Felinic' }}</span>
          <p class="text-[13.5px] leading-snug text-[#dbdee1] md:text-[11px]">{{ m.text }}</p>
        </div>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
/* 逐条入场：纯淡入 + 轻微上滑。不用 FLIP move——流式输出时若让兄弟元素
   持续做 transform 过渡，会和每帧增长的文字互相打架，导致 tg 气泡发抖。 */
.msg-enter-from {
  opacity: 0;
  transform: translateY(8px);
}
.msg-enter-active {
  transition: opacity 0.3s ease, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
}

/* 流式输出光标 */
.cursor {
  display: inline-block;
  width: 2px;
  height: 1em;
  margin-left: 2px;
  vertical-align: -0.14em;
  background: currentColor;
  border-radius: 1px;
  animation: blink 1s steps(2, start) infinite;
}
@keyframes blink {
  0%, 50% { opacity: 1; }
  50.01%, 100% { opacity: 0; }
}

@media (prefers-reduced-motion: reduce) {
  .msg-enter-active, .msg-move { transition: none; }
  .cursor { animation: none; }
}
</style>
