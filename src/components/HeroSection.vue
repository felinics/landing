<script setup lang="ts">
import { computed } from 'vue'
import { ArrowRight } from 'lucide-vue-next'
import sunsetBg from '../assets/sunset.webp'
import DesktopDownloadButton from './DesktopDownloadButton.vue'
import HeroShowcase from './HeroShowcase.vue'
import { useTa } from '../composables/useTa'

const { th } = useTa()

// 主标题统一用衬线字体（Source Serif 4 / Noto Serif SC）
const titleFontClass = computed(() => 'font-serif')
</script>

<template>
  <!-- HERO: full-bleed sunset sky + real app screenshot. -->
  <section class="relative w-full">
    <!-- Sky stage: sized close to the image ratio so the whole scene (cat + train) stays visible -->
    <div class="relative w-full h-[86svh] min-h-[640px] max-h-[880px] flex items-start justify-center">
      <img
        :src="sunsetBg"
        alt=""
        aria-hidden="true"
        fetchpriority="high"
        class="hero-sunset absolute inset-0 w-full h-full object-cover object-center"
      />
      <!-- Warm wash pulls down the harsh magenta in the sunset sky -->
      <div class="hero-sunset-wash absolute inset-0 pointer-events-none" aria-hidden="true"></div>
      <!-- Scrims: nav darkening and bottom fade into the page -->
      <div class="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10"></div>
      <div class="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent to-background"></div>

      <!-- Content: headline + subtitle centered -->
      <div class="relative z-30 w-full max-w-[1100px] mx-auto px-4 md:px-8 flex flex-col items-center text-center pt-40 md:pt-52">
        <h1 :class="[titleFontClass, 'text-balance font-medium text-white leading-[1.08] text-5xl md:text-6xl [text-shadow:0_1px_12px_oklch(0_0_0/0.18)] whitespace-pre-line']" v-html="th('hero.title')" />

        <p class="mt-6 max-w-[760px] text-pretty text-base md:text-lg text-white/92 leading-relaxed drop-shadow-sm whitespace-pre-line">
          <span v-html="th('hero.subtitle')" />
        </p>

        <!-- CTAs — page-local treatment adapted from the @memohai/ui button contract -->
        <div class="mt-9 flex flex-col sm:flex-row items-center justify-center gap-3">
          <a
            href="https://app.memoh.net"
            class="hero-btn hero-btn-primary whitespace-nowrap inline-flex h-[52px] items-center justify-center gap-2 rounded-full px-7 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
          >
            {{ $t('hero.ctaPrimary') }}
            <ArrowRight :size="18" />
          </a>
          <DesktopDownloadButton surface="hero" />
        </div>
      </div>
    </div>

    <!-- App showcase — overlaps the sky bottom, continues onto the page background.
         原版 Memoh 前端的纯浏览器交互演示。 -->
    <div class="relative z-20 w-full max-w-[1180px] mx-auto px-4 md:px-6 -mt-[40px] md:-mt-[90px]">
      <div class="relative h-[520px] w-full md:h-auto md:aspect-[16/10] shadow-2xl shadow-black/50">
        <HeroShowcase class="absolute inset-0" :chrome="false" />
      </div>
    </div>
  </section>
</template>

<style scoped>
/* Tame the sunset sky: less magenta punch, slightly warmer/neutral. */
.hero-sunset {
  filter: saturate(0.82) hue-rotate(-8deg) brightness(0.97);
}

.hero-sunset-wash {
  background: linear-gradient(
    to bottom,
    rgb(42 28 18 / 0.14),
    rgb(28 22 18 / 0.08) 45%,
    transparent 72%
  );
  mix-blend-mode: soft-light;
}

/* Adapted from @memohai/ui button contract bench (primary hover sheen + micro-scale).
   Shape kept as a pill instead of the library's rounded-lg. */
.hero-btn {
  position: relative;
  isolation: isolate;
  backface-visibility: hidden;
  transition: scale 0.15s ease-out;
}

/* Keep the warm fill separate so hover feedback does not move the label. */
.hero-btn-primary {
  color: #18181b;
}
.hero-btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: #faf7f2;
  transition:
    scale 0.3s linear(0, .3505, .7432, .9336, .9951, 1.0062, 1.0045, 1.0019, 1.0005, 1),
    background-color 0.15s ease-out;
}
/* Hover darken overlay — sits above the fill but BELOW the text (z-index -1),
   so a light/white button gets a proper darken-on-hover in dark mode. */
.hero-btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: rgba(0, 0, 0, 0.06);
  opacity: 0;
  transition: opacity 0.18s ease-out, background-color 0.18s ease-out;
}
.hero-btn-primary:hover::before {
  scale: 1.005 1.015;
}
.hero-btn-primary:hover::after {
  opacity: 1;
}
.hero-btn-primary:active::after {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.12);
}

</style>
