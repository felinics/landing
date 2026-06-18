<script setup lang="ts">
import { ref, onMounted, computed, onUnmounted } from 'vue'

// ── 主随机池（7种）──────────────────────────────────────
const MAIN_CLIPS = [
  { id: 'a1', src: '/egg/a1.mp4', weight: 10, group: 1 },
  { id: 'a2', src: '/egg/a2.mp4', weight: 10, group: 1 },
  { id: 'b1', src: '/egg/b1.mp4', weight: 15, group: 2 },
  { id: 'b2', src: '/egg/b2.mp4', weight: 15, group: 2 },
  { id: 'c1', src: '/egg/c1.mp4', weight: 15, group: 1 },
  { id: 'd1', src: '/egg/d1.mp4', weight: 15, group: 2 },
  { id: 'd2', src: '/egg/d2.mp4', weight: 15, group: 2 },
]
const ALL_IDS = new Set(MAIN_CLIPS.map(c => c.id))

// 视频已在 public/egg/ 里「预加速」压制（各自倍速烧进文件），网页按 1.0 播放即可
// 预加速倍速备忘：a1/a2/c1/e1=1.5  b1/b2=2.2  d1/e3=1.8  d2=1.6  e4=1.8
const PLAYBACK_RATE = 1.0

// ── 特殊视频 ───────────────────────────────────────────
const STARTLE_SRC = '/egg/e1.mp4'   // E1: 快速连点炸毛
const BOARD_SRC   = '/egg/e3.mp4'   // E3: 黑板变 Memoh
const GIFT_SRC    = '/egg/e4.mp4'   // E4: 终极彩蛋叼鱼

const debug = computed(() => new URLSearchParams(location.search).has('debug'))

// ── 懒加载：只有滚到彩蛋区域附近才初始化视频 ────────────
const initialized = ref(false)
const sectionRef = ref<HTMLElement | null>(null)
let observer: IntersectionObserver | null = null

// ── state ─────────────────────────────────────────────
const videoRefs   = ref<Record<string, HTMLVideoElement>>({})
const activeClip  = ref<string | null>(null)
const armedClip   = ref<string>('b1')   // 预选的下一个主随机视频，idle 时显示它的第0帧
const lastClip    = ref<string | null>(null)
const lastGroup   = ref<number | null>(null)
const groupStreak = ref(0)
const busy        = ref(false)

// 当前可见层：播放中显示 activeClip，否则显示预选的 armedClip
// 这样点击播放的视频 = idle 时显示的视频，第0帧完全对齐，无跳变
const visibleClip = computed(() => activeClip.value ?? armedClip.value)

// localStorage: 记录已看过的视频 id
const SEEN_KEY = 'memoh_egg_seen'
function getSeen(): Set<string> {
  try { return new Set(JSON.parse(localStorage.getItem(SEEN_KEY) || '[]')) } catch { return new Set() }
}
function addSeen(id: string) {
  const s = getSeen(); s.add(id)
  try { localStorage.setItem(SEEN_KEY, JSON.stringify([...s])) } catch {}
}
function hasSeenAll(): boolean {
  const s = getSeen()
  return [...ALL_IDS].every(id => s.has(id))
}

// 快速连点检测：延迟播放，给连点积累时间
const clickTimes: number[] = []
let pendingPlay: ReturnType<typeof setTimeout> | null = null

function schedulePlay(fn: () => void) {
  if (pendingPlay) clearTimeout(pendingPlay)
  pendingPlay = setTimeout(() => {
    pendingPlay = null
    fn()
  }, 500)
}

// ── 随机策略 ───────────────────────────────────────────
function pickRandom(): typeof MAIN_CLIPS[0] {
  const forcedGroup = groupStreak.value >= 2 ? (lastGroup.value === 1 ? 2 : 1) : null
  const pool = MAIN_CLIPS.filter(c =>
    c.id !== lastClip.value &&
    (forcedGroup === null || c.group === forcedGroup)
  )
  const total = pool.reduce((s, c) => s + c.weight, 0)
  let r = Math.random() * total
  for (const c of pool) { r -= c.weight; if (r <= 0) return c }
  return pool[pool.length - 1]
}

// ── 播放 ───────────────────────────────────────────────
function setRef(key: string, el: unknown) {
  if (el) videoRefs.value[key] = el as HTMLVideoElement
}

function startClip(key: string, onEnd?: () => void) {
  const v = videoRefs.value[key]
  if (!v) return
  activeClip.value = key
  v.currentTime = 0
  v.playbackRate = PLAYBACK_RATE
  v.play()
  if (onEnd) v.addEventListener('ended', onEnd, { once: true })
}

function onClipEnded(_key: string) {
  activeClip.value = null
  busy.value = false
  armNext()   // 预选下一个，并把它停在第0帧作为新的 idle 静帧
}

// 预选下一个主视频，停在第0帧；idle 时它就是可见层（消除静帧→播放跳变）
function armNext() {
  const chosen = pickRandom()
  armedClip.value = chosen.id
  const v = videoRefs.value[chosen.id]
  if (v) { v.pause(); v.currentTime = 0 }
}

// E1：点猫热区
function onCatClick() {
  if (busy.value) return

  const now = Date.now()
  clickTimes.push(now)
  while (clickTimes.length > 3) clickTimes.shift()

  // 三连点（1.5s内）→ 立即炸毛
  if (clickTimes.length === 3 && (now - clickTimes[0]) < 1500) {
    if (pendingPlay) { clearTimeout(pendingPlay); pendingPlay = null }
    clickTimes.length = 0
    busy.value = true
    startClip('e1', () => onClipEnded('e1'))
    return
  }

  // 普通点击：延迟 500ms 再播，给连点时间积累
  schedulePlay(() => {
    if (busy.value) return
    clickTimes.length = 0
    // 集齐 7 种 → 终极彩蛋，播完后清空记录重新积累
    if (hasSeenAll()) {
      busy.value = true
      try { localStorage.removeItem(SEEN_KEY) } catch {}
      startClip('e4', () => onClipEnded('e4'))
      return
    }
    // 普通随机：播放已预选好的 armedClip（与 idle 显示的第0帧完全对齐）
    busy.value = true
    const chosen = MAIN_CLIPS.find(c => c.id === armedClip.value) ?? MAIN_CLIPS[0]
    if (chosen.group === lastGroup.value) groupStreak.value++
    else { groupStreak.value = 1; lastGroup.value = chosen.group }
    lastClip.value = chosen.id
    addSeen(chosen.id)
    startClip(chosen.id, () => onClipEnded(chosen.id))
  })
}

// E3：点黑板
function onBoardClick() {
  if (busy.value) return
  busy.value = true
  startClip('e3', () => onClipEnded('e3'))
}

// ── preload ────────────────────────────────────────────
function initVideos() {
  if (initialized.value) return
  initialized.value = true
  // 预选首个主随机视频，加载后停在第0帧作为 idle 静帧
  armNext()
  requestAnimationFrame(() => {
    const v = videoRefs.value[armedClip.value]
    if (v) { v.currentTime = 0 }
  })
  ;[STARTLE_SRC, BOARD_SRC, GIFT_SRC].forEach(src => {
    const tmp = document.createElement('video')
    tmp.src = src; tmp.preload = 'auto'; tmp.muted = true
    tmp.style.cssText = 'display:none;position:fixed;pointer-events:none'
    document.body.appendChild(tmp)
  })
}

onMounted(() => {
  observer = new IntersectionObserver(
    (entries) => {
      if (entries[0].isIntersecting) { initVideos(); observer?.disconnect(); observer = null }
    },
    { rootMargin: '0px 0px 100% 0px' }
  )
  if (sectionRef.value) observer.observe(sectionRef.value)
})

onUnmounted(() => { observer?.disconnect() })
</script>

<template>
  <section ref="sectionRef" class="egg select-none">
    <!-- 静止底层：用最终压缩视频 b1 的真实第0帧（egg/poster.png），
         必须取自最终文件，否则切到视频会跳帧 -->
    <img
      src="/egg/poster.webp"
      class="egg-video"
      aria-hidden="true"
      alt=""
    />

    <!-- 主随机 clips：懒加载，未初始化不设 src。idle 时显示 armedClip 的第0帧 -->
    <video
      v-for="clip in MAIN_CLIPS"
      :key="clip.id"
      :src="initialized ? clip.src : undefined"
      :preload="initialized ? 'auto' : 'none'"
      :ref="(el) => setRef(clip.id, el)"
      class="egg-video clip-video"
      :class="{ active: visibleClip === clip.id }"
      muted playsinline aria-hidden="true"
      @ended="onClipEnded(clip.id)"
    />

    <!-- E1/E3/E4：src 由 initVideos 里的隐藏元素预热，这里只在 active 时有 src -->
    <video
      :ref="(el) => setRef('e1', el)"
      :src="initialized ? STARTLE_SRC : undefined"
      :preload="initialized ? 'auto' : 'none'"
      class="egg-video clip-video"
      :class="{ active: visibleClip === 'e1' }"
      muted playsinline aria-hidden="true"
    />
    <video
      :ref="(el) => setRef('e3', el)"
      :src="initialized ? BOARD_SRC : undefined"
      :preload="initialized ? 'auto' : 'none'"
      class="egg-video clip-video"
      :class="{ active: visibleClip === 'e3' }"
      muted playsinline aria-hidden="true"
    />
    <video
      :ref="(el) => setRef('e4', el)"
      :src="initialized ? GIFT_SRC : undefined"
      :preload="initialized ? 'auto' : 'none'"
      class="egg-video clip-video"
      :class="{ active: visibleClip === 'e4' }"
      muted playsinline aria-hidden="true"
    />

    <!-- 猫的点击热区 -->
    <div class="hotspot cat-hotspot" :class="{ 'debug-hotspot': debug }" @click="onCatClick" />

    <!-- 黑板点击热区 -->
    <div class="hotspot board-hotspot" :class="{ 'debug-hotspot': debug }" @click="onBoardClick" />
    <div class="hotspot board-hotspot-2" :class="{ 'debug-hotspot': debug }" @click="onBoardClick" />
  </section>
</template>

<style scoped>
.egg {
  position: relative;
  width: 100%;
  height: clamp(420px, 60vh, 660px);
  overflow: hidden;
  background: #1a1410;
  cursor: default;
}

.egg-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center 88%;
  transform: scale(1.08);
  transform-origin: center 88%;
}

@media (max-width: 767px) {
  .egg-video {
    object-position: 64% 88%;
    transform-origin: 64% 88%;
  }
}

.clip-video { opacity: 0; }
.clip-video.active { opacity: 1; }

.hotspot {
  position: absolute;
  z-index: 2;
  cursor: pointer;
}

/* 猫区：右下角，z-index 高于黑板，重叠处优先触发猫 */
.cat-hotspot {
  right: 28%;
  bottom: 2%;
  width: 240px;
  height: 280px;
  z-index: 3;
}

@media (max-width: 767px) {
  .cat-hotspot {
    /* 手机端视频向右偏移后，猫出现在右侧偏中区域 */
    right: 10%;
    bottom: 2%;
    width: 160px;
    height: 220px;
  }
}

/* 黑板区：右侧中下，高度加高往上延伸 */
.board-hotspot {
  right: 18%;
  bottom: 20%;
  width: 120px;
  height: 210px;
  z-index: 2;
}

/* 黑板区延伸：左上方重叠块 */
.board-hotspot-2 {
  right: 22%;
  bottom: 34%;
  width: 120px;
  height: 210px;
  z-index: 2;
}

.debug-hotspot {
  outline: 2px solid rgba(255, 80, 80, 0.8);
  background: rgba(255, 80, 80, 0.15);
}
</style>
