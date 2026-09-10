<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useTa } from './composables/useTa'
import { useThemePreference } from './composables/useTheme'
import { useRoute } from 'vue-router'
import { MapPin, Github, Twitter } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import BackgroundCanvas from './components/BackgroundCanvas.vue'
import TopBar from './components/TopBar.vue'
import EasterEgg from './components/EasterEgg.vue'

const { locale, t } = useI18n()
const { th } = useTa()

const route = useRoute()
const { isDark } = useThemePreference()

const isDownloadRoute = computed(() => route.path.startsWith('/download'))
const isBlogsRoute = computed(() => route.path.startsWith('/blogs'))
const isWaitlistRoute = computed(() => route.path.startsWith('/waitlist'))
const isHomeRoute = computed(() => route.path === '/')
const isPlainContentRoute = computed(() => isDownloadRoute.value || isBlogsRoute.value || isWaitlistRoute.value)

// Single owner of the <html> `dark` class. The landing page always *renders*
// dark, but must never overwrite the user's saved preference — so we force the
// class here based on route without writing to storage. Every other route
// follows the persisted choice.
watchEffect(() => {
  const dark = isHomeRoute.value ? true : isDark.value
  document.documentElement.classList.toggle('dark', dark)
})

const isMemohNet = computed(() => {
  if (typeof window === 'undefined') {
    return false
  }
  const hostname = window.location.hostname.replace(/^www\./, '').toLowerCase()
  return hostname === 'memoh.net'
})

const memohNetAddress = 'Cloud Technology Building, No. 50 Liuxin 1st Road, Nanshan District, Shenzhen'
const footerAddress = computed(() => (isMemohNet.value ? memohNetAddress : t('footer.address')))
const docsUrl = computed(() => locale.value === 'zh' ? 'https://docs.memoh.ai/zh' : 'https://docs.memoh.ai')
const miitBeianUrl = 'https://beian.miit.gov.cn/'
const telecomLicenseUrl = 'https://dxzhgl.miit.gov.cn/'

</script>

<template>
  <div class="min-h-screen font-sans overflow-x-hidden" :class="{ 'home-shell': isHomeRoute, 'download-shell': isPlainContentRoute }">
    <BackgroundCanvas v-if="!isHomeRoute && !isPlainContentRoute" />

    <div
      class="relative z-10 w-full"
      :class="{ 'home-scroll': isHomeRoute }"
    >
      <div
        class="w-full flex flex-col items-center"
        :class="{ 'home-gradient home-content': isHomeRoute }"
      >
        <TopBar :overlay="isHomeRoute" :hide-theme-toggle="isHomeRoute" :light-social-icons="isPlainContentRoute && isDark" />

        <RouterView />

        <footer class="w-full max-w-[1080px] py-[60px] relative z-10 after:absolute after:top-0 after:left-4 after:right-4 md:after:left-8 md:after:right-8 after:h-px after:bg-border px-4 md:px-8">
        <div class="flex flex-col md:flex-row md:justify-between gap-10 md:gap-16">
          <!-- Brand block (left) -->
          <div class="flex flex-col gap-4 max-w-[320px]">
            <div class="flex items-center gap-2">
              <img src="/logo.png" alt="Memoh Logo" class="w-6 h-6 object-contain brightness-0 invert" />
              <span class="font-bold text-lg tracking-tight text-foreground">Memoh</span>
            </div>
            <p class="text-sm text-muted-foreground leading-relaxed whitespace-pre-line" v-html="th('footer.tagline')" />
            <div class="flex items-center gap-2">
              <a href="https://github.com/felinics/Memoh" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Github class="w-4 h-4" />
              </a>
              <a href="https://t.me/memohai" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <span aria-hidden="true" class="telegram-icon h-4 w-4"></span>
              </a>
              <!-- 官方 X 账号是 @memoh_ai;x.com/memohai 是别人占用或无此账号(404),别改回去 -->
              <a href="https://x.com/memoh_ai" target="_blank" rel="noopener noreferrer" aria-label="X"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors">
                <Twitter class="w-4 h-4" />
              </a>
            </div>
          </div>

          <!-- Link columns (right) — Legal 列撤下后只剩两列,勿改回 sm:grid-cols-3 -->
          <div class="grid grid-cols-2 gap-8 sm:gap-12">
            <div class="flex flex-col gap-3">
              <span class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/85">{{ t('footer.product') }}</span>
              <router-link to="/download" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{{ t('nav.download') }}</router-link>
              <a href="https://github.com/felinics/supermarket" target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{{ t('nav.supermarket') }}</a>
            </div>
            <div class="flex flex-col gap-3">
              <span class="text-[11px] font-medium uppercase tracking-wider text-muted-foreground/85">{{ t('footer.resources') }}</span>
              <a :href="docsUrl" target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{{ t('nav.docs') }}</a>
              <router-link to="/blogs" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{{ t('nav.blogs') }}</router-link>
              <a href="https://github.com/felinics/Memoh" target="_blank" rel="noopener noreferrer" class="text-sm text-muted-foreground hover:text-foreground transition-colors">{{ t('nav.github') }}</a>
            </div>
            <!-- Legal 列整列撤下:Privacy/Terms 页面不存在,此前两个链接都指向首页占位。
                 页面就绪后恢复此列及 footer.privacy / footer.terms 文案。 -->
          </div>
        </div>

        <!-- Bottom row: legal line -->
        <div class="mt-12 pt-6 border-t border-border/50 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div class="flex flex-col gap-1">
            <span class="text-xs text-muted-foreground">{{ t('footer.copyright') }}</span>
            <div class="flex items-center gap-1 text-muted-foreground/60">
              <MapPin :size="10" />
              <span class="text-[10px]">{{ footerAddress }}</span>
            </div>
          </div>
          <div
            v-if="isMemohNet"
            class="inline-flex items-center gap-1.5 rounded-md border border-border/40 bg-muted/20 px-2 py-1 text-[10px] text-muted-foreground/75 leading-none whitespace-nowrap"
          >
            <a :href="miitBeianUrl" target="_blank" rel="noopener noreferrer" class="hover:text-muted-foreground transition-colors">
              粤ICP备2020082274号
            </a>
            <span aria-hidden="true" class="text-muted-foreground/45">｜</span>
            <a :href="telecomLicenseUrl" target="_blank" rel="noopener noreferrer" class="hover:text-muted-foreground transition-colors">
              增值电信业务经营许可证 B1-20214707
            </a>
          </div>
        </div>
        </footer>
      </div>
      <EasterEgg v-if="isHomeRoute" />
    </div>
  </div>
</template>

<style scoped>
/* Home page: page background fades from the purple-black used behind the
   dusk-journey cards (top) into the deeper near-black (#09090b) at the tail. */
.home-shell {
  height: 100dvh;
  overflow: hidden;
  background: #09090b;
}

/* Download page: flat near-black (the calm tail of the home gradient), no
   cursor glow — keeps the platform grid the sole focus. Dark-scoped so light
   mode still falls back to the normal page background. Re-point --background to
   the same near-black so the sticky top bar and any bg-background surfaces stay
   unified instead of showing the slightly bluer #0c0c14. */
.dark .download-shell {
  background: #09090b;
  /* Re-point BOTH the raw token and the Tailwind-resolved --color-background:
     `--color-background: var(--background)` is resolved on :root (html), so it
     freezes to #0c0c14 there and overriding --background lower down won't move
     it. bg-background utilities read --color-background, so it must be set too. */
  --background: #09090b;
  --color-background: #09090b;
}

.home-scroll {
  height: 100dvh;
  overflow-x: hidden;
  overflow-y: auto;
  overscroll-behavior-y: auto;
  scrollbar-gutter: stable;
  scrollbar-width: none;
  -ms-overflow-style: none;
  will-change: scroll-position;
  transform: translateZ(0);
}
.home-scroll::-webkit-scrollbar {
  display: none;
}

.home-content {
  min-height: 100%;
}

.home-content :deep(a:focus-visible),
.home-content :deep(button:focus-visible) {
  outline: 2px solid #c4b5fd;
  outline-offset: 4px;
}

@media (prefers-reduced-motion: reduce) {
  .home-content :deep(*),
  .home-content :deep(*::before),
  .home-content :deep(*::after) {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

.home-gradient {
  background: linear-gradient(to bottom, #0c0c14 0%, #0c0c14 48%, #09090b 100%);
}

.telegram-icon {
  background-color: currentColor;
  mask: url('/brands/telegram.svg') center / contain no-repeat;
  -webkit-mask: url('/brands/telegram.svg') center / contain no-repeat;
}

</style>
