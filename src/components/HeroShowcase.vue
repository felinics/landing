<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

// 整块 hero 是真实 App 的无声循环录屏（Desktop 也在这段录屏里）。
// 分层兜底，三种素材状态都成立：
//   1) 只有 poster 截图  → 显示真实静帧（先上一张截图也能像真的）
//   2) poster + 视频     → 静帧打底，视频出第一帧后覆盖
//   3) 都还没有          → 不透明深色加载面，绝不漏黑边或裂图
// 路径走运行时字符串（不走 import），素材缺席时构建照常通过。
//
// chrome：landing 侧补 macOS 红绿灯。录屏需在桌面布局（DesktopShellKey=true）下
// 录“内容”，左上角会让出 76px 空槽（App 自身不画灯）；这里把灯画进那块空槽。
// 若改录已自带原生红绿灯的窗口，把 chrome 设为 false，避免重影。
withDefaults(defineProps<{ chrome?: boolean }>(), { chrome: true })

const { locale } = useI18n()
const assetLocale = computed(() => locale.value === 'zh' ? 'zh' : 'en')
const assetVersion = computed(() => `20260618-${assetLocale.value}`)
const assetName = computed(() => assetLocale.value === 'zh' ? 'app-demo-zh' : 'app-demo')
const poster = computed(() => `/hero/${assetName.value}-poster.webp?v=${assetVersion.value}`)
const webm = computed(() => `/hero/${assetName.value}.webm?v=${assetVersion.value}`)
const mp4 = computed(() => `/hero/${assetName.value}.mp4?v=${assetVersion.value}`)
const videoKey = computed(() => `${assetName.value}-${assetVersion.value}`)

const posterReady = ref(false)
const videoReady = ref(false)
const ready = computed(() => posterReady.value || videoReady.value)

watch(assetName, () => {
  posterReady.value = false
  videoReady.value = false
})
</script>

<template>
  <div class="relative size-full overflow-hidden rounded-xl border border-white/10 bg-[#0d1117] ring-1 ring-black/5">
    <!-- 加载/缺席占位：不透明深色面 -->
    <div
      class="absolute inset-0 flex items-center justify-center bg-[#0d1117] transition-opacity duration-500"
      :class="ready ? 'pointer-events-none opacity-0' : 'opacity-100'"
      aria-hidden="true"
    >
      <div class="hero-shimmer absolute inset-0" />
      <div class="relative size-7 animate-spin rounded-full border-2 border-white/15 border-t-white/55" />
    </div>

    <!-- 真实截图静帧：打底，也作为只截图、未录屏阶段的展示。
         加载成功才淡入，缺席时保持透明，避免裂图图标。 -->
    <img
      :src="poster"
      alt=""
      aria-hidden="true"
      class="absolute inset-0 size-full object-cover transition-opacity duration-500"
      :class="posterReady ? 'opacity-100' : 'opacity-0'"
      @load="posterReady = true"
    />

    <!-- 真实 App 录屏：出第一帧后覆盖静帧 -->
    <video
      :key="videoKey"
      class="absolute inset-0 size-full object-cover"
      autoplay
      muted
      loop
      playsinline
      preload="metadata"
      @loadeddata="videoReady = true"
    >
      <source :src="mp4" type="video/mp4" />
      <source :src="webm" type="video/webm" />
    </video>

    <!-- macOS 红绿灯：画进录屏左上角让出的 76px 空槽（size-3=12px, gap-2=8px,
         left-5=20px → 三点落在 20–72px 内）。纯装饰，不挡交互。 -->
    <div
      v-if="chrome"
      class="pointer-events-none absolute left-5 top-4 z-10 flex items-center gap-2"
      aria-hidden="true"
    >
      <span class="hero-light size-3 rounded-full bg-[#ff5f57]" />
      <span class="hero-light size-3 rounded-full bg-[#febc2e]" />
      <span class="hero-light size-3 rounded-full bg-[#28c840]" />
    </div>
  </div>
</template>

<style scoped>
/* 占位的轻微流光，纯加载态，非伪 UI。 */
.hero-shimmer {
  background: linear-gradient(
    100deg,
    transparent 35%,
    rgba(255, 255, 255, 0.05) 50%,
    transparent 65%
  );
  background-size: 220% 100%;
  animation: hero-shimmer 2.4s ease-in-out infinite;
}

@keyframes hero-shimmer {
  0% { background-position: 180% 0; }
  100% { background-position: -80% 0; }
}

@media (prefers-reduced-motion: reduce) {
  .hero-shimmer { animation: none; }
}

/* 红绿灯：极淡内描边，贴近 macOS 真实灯的边缘质感。 */
.hero-light {
  box-shadow: inset 0 0 0 0.5px rgba(0, 0, 0, 0.18);
}
</style>
