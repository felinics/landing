<script setup lang="ts">
// Animated Memoh mascot: the logo redrawn as layered SVG so its parts can move.
// - eyes/mouth/face follow the pointer (parallax depth per layer)
// - random blinks (sometimes a double blink)
// - idle float + antenna wiggle
// - click / tap → happy squint + hop
// Respects prefers-reduced-motion (static logo, still blinks occasionally).
import { onBeforeUnmount, onMounted, ref } from 'vue'

const root = ref<SVGSVGElement | null>(null)
const blinking = ref(false)
const happy = ref(false)

// Smoothed look direction in [-1, 1].
const look = ref({ x: 0, y: 0 })
let target = { x: 0, y: 0 }
let lastPointerAt = 0
let raf = 0
let blinkTimer: ReturnType<typeof setTimeout> | undefined
let wanderTimer: ReturnType<typeof setTimeout> | undefined
let happyTimer: ReturnType<typeof setTimeout> | undefined
let reduceMotion = false

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v))

const onPointerMove = (e: PointerEvent) => {
  const el = root.value
  if (!el) return
  const r = el.getBoundingClientRect()
  const cx = r.left + r.width / 2
  const cy = r.top + r.height * 0.5
  // Normalise by a radius larger than the mascot so it reacts across the page.
  const reach = Math.max(r.width * 2.5, 320)
  target = { x: clamp((e.clientX - cx) / reach, -1, 1), y: clamp((e.clientY - cy) / reach, -1, 1) }
  lastPointerAt = performance.now()
}

const tick = () => {
  const k = 0.12
  look.value = {
    x: look.value.x + (target.x - look.value.x) * k,
    y: look.value.y + (target.y - look.value.y) * k,
  }
  raf = requestAnimationFrame(tick)
}

// When the pointer has been still for a while, glance around on its own.
const wander = () => {
  if (performance.now() - lastPointerAt > 2500) {
    target = Math.random() < 0.35 ? { x: 0, y: 0 } : { x: Math.random() * 1.6 - 0.8, y: Math.random() * 1.0 - 0.5 }
  }
  wanderTimer = setTimeout(wander, 1400 + Math.random() * 2200)
}

const blink = () => {
  blinking.value = true
  setTimeout(() => {
    blinking.value = false
  }, 140)
}

const scheduleBlink = () => {
  blinkTimer = setTimeout(() => {
    blink()
    if (Math.random() < 0.25) setTimeout(blink, 260)
    scheduleBlink()
  }, reduceMotion ? 5000 + Math.random() * 4000 : 2200 + Math.random() * 3200)
}

const onClick = () => {
  happy.value = false
  // Restart the hop animation even on rapid clicks.
  requestAnimationFrame(() => {
    happy.value = true
    clearTimeout(happyTimer)
    happyTimer = setTimeout(() => (happy.value = false), 900)
  })
}

onMounted(() => {
  reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
  scheduleBlink()
  if (reduceMotion) return
  window.addEventListener('pointermove', onPointerMove, { passive: true })
  raf = requestAnimationFrame(tick)
  wander()
})

onBeforeUnmount(() => {
  window.removeEventListener('pointermove', onPointerMove)
  cancelAnimationFrame(raf)
  clearTimeout(blinkTimer)
  clearTimeout(wanderTimer)
  clearTimeout(happyTimer)
})

// Parallax offsets in SVG units (viewBox is 1817 × 1601).
const shift = (depth: number) => `translate(${(look.value.x * depth).toFixed(2)} ${(look.value.y * depth).toFixed(2)})`
</script>

<template>
  <div class="memoh-mascot" :class="{ 'is-happy': happy }">
    <svg
      ref="root"
      viewBox="-40 -40 1897 1681"
      role="img"
      aria-label="Memoh"
      class="mascot-svg"
      @click="onClick"
    >
      <g class="mascot-float">
        <g class="mascot-hop">
          <g :transform="`rotate(${(look.x * 4).toFixed(2)} 908 900)`">
            <!-- Back body + right antenna -->
            <g class="antenna-right">
              <path
                fill="#7C4AFF"
                d="M1338 42 C1352 8 1388 -6 1420 6 C1450 18 1462 50 1452 80 L1398 238 L1272 236 Z"
              />
            </g>
            <path
              fill="#7C4AFF"
              d="M1272 220 C1300 228 1350 230 1398 238 C1530 272 1630 330 1720 440 C1850 610 1830 900 1815 1000 C1790 1150 1760 1220 1710 1290 C1650 1390 1600 1440 1550 1475 C1450 1550 1350 1570 1270 1580 C1000 1610 600 1605 300 1560 C120 1530 50 1440 30 1370 L600 900 L1065 362 C1180 330 1258 280 1272 220 Z"
            />

            <!-- Left antenna + light swoosh -->
            <g class="antenna-left">
              <path
                fill="#BB6BFF"
                d="M204 180 C200 145 228 117 262 117 C295 117 321 142 322 176 L334 400 L218 488 Z"
              />
            </g>
            <path
              fill="#BB6BFF"
              d="M218 487 L334 398 C520 290 800 292 880 288 C1050 282 1060 262 1110 215 C1090 282 1020 336 910 338 L700 700 L1262 1058 C1050 1350 700 1500 380 1510 C230 1515 90 1460 30 1370 C10 1310 0 1250 0 1130 C0 950 30 740 140 580 C165 545 190 515 218 487 Z"
            />

            <!-- Face -->
            <g :transform="shift(14)">
              <path
                fill="#FFFFFF"
                d="M1065 362 C1120 362 1180 376 1232 394 C1340 436 1366 560 1352 770 C1342 900 1312 990 1262 1058 C1150 1192 980 1262 700 1300 C520 1322 340 1312 265 1255 C180 1190 184 1020 190 950 C200 790 245 640 295 567 C400 420 620 352 910 338 C960 336 1010 350 1065 362 Z"
              />

              <!-- Eyes -->
              <g :transform="shift(46)">
                <g class="eye" :class="{ 'is-blinking': blinking }">
                  <path
                    fill="#7C4AFF"
                    d="M520 665 C556 665 586 696 580 736 L571 790 C561 840 517 873 471 873 C435 873 405 844 412 808 L420 756 C430 705 472 665 520 665 Z"
                  />
                </g>
                <g class="eye" :class="{ 'is-blinking': blinking }">
                  <path
                    fill="#7C4AFF"
                    d="M1045 624 C1081 624 1111 655 1105 695 L1096 749 C1086 799 1042 832 996 832 C960 832 930 803 937 767 L945 715 C955 664 997 624 1045 624 Z"
                  />
                </g>
              </g>

              <!-- Mouth -->
              <g :transform="shift(30)">
                <path
                  class="mouth"
                  fill="none"
                  stroke="#7C4AFF"
                  stroke-width="62"
                  stroke-linecap="round"
                  d="M660 925 Q800 952 878 868"
                />
              </g>
            </g>
          </g>
        </g>
      </g>
    </svg>
  </div>
</template>

<style scoped>
.memoh-mascot {
  display: inline-block;
  line-height: 0;
}

.mascot-svg {
  width: 100%;
  height: auto;
  overflow: visible;
  cursor: pointer;
  -webkit-tap-highlight-color: transparent;
}

.mascot-float {
  animation: mascot-float 4.2s ease-in-out infinite;
}

.antenna-left,
.antenna-right {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
.antenna-left {
  animation: antenna-wiggle 3.6s ease-in-out infinite;
}
.antenna-right {
  animation: antenna-wiggle 3.6s ease-in-out -1.4s infinite;
}

.eye {
  transform-box: fill-box;
  transform-origin: 50% 55%;
  transition: transform 70ms ease-in;
}
.eye.is-blinking {
  transform: scaleY(0.08);
}

.mouth {
  transition: d 0.25s ease-out;
}

/* Click → happy squint + hop */
.mascot-hop {
  transform-box: fill-box;
  transform-origin: 50% 100%;
}
.is-happy .mascot-hop {
  animation: mascot-hop 0.7s cubic-bezier(0.3, 0.7, 0.4, 1);
}
.is-happy .eye {
  transform: scaleY(0.35) translateY(30px);
  transition-duration: 120ms;
}
.is-happy .mouth {
  d: path('M640 905 Q790 990 900 860');
}

@keyframes mascot-float {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-28px); }
}

@keyframes antenna-wiggle {
  0%, 100% { transform: rotate(0deg); }
  20% { transform: rotate(-5deg); }
  40% { transform: rotate(3deg); }
  55% { transform: rotate(0deg); }
}

@keyframes mascot-hop {
  0% { transform: translateY(0) scale(1, 1); }
  18% { transform: translateY(0) scale(1.06, 0.92); }
  45% { transform: translateY(-90px) scale(0.96, 1.05); }
  75% { transform: translateY(0) scale(1.04, 0.96); }
  100% { transform: translateY(0) scale(1, 1); }
}

@media (prefers-reduced-motion: reduce) {
  .mascot-float,
  .antenna-left,
  .antenna-right,
  .is-happy .mascot-hop {
    animation: none;
  }
}
</style>
