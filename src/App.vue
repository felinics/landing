<script setup lang="ts">
import { computed, watchEffect } from 'vue'
import { useTa } from './composables/useTa'
import { useThemePreference } from './composables/useTheme'
import { useRoute } from 'vue-router'
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

        <footer class="site-footer">
          <div class="footer-main">
            <!-- Brand block (left) -->
            <div class="footer-brand">
              <div class="footer-wordmark">
                <img src="/logo.png" alt="Memoh Logo" class="h-7 w-7 object-contain" :class="isHomeRoute || isDark ? 'brightness-0 invert' : ''" />
                <span class="font-semibold text-[22px] tracking-tight text-foreground">Memoh</span>
              </div>
              <p class="footer-tagline" v-html="th('footer.tagline')" />
            </div>

            <!-- Link columns (right) — Legal 列撤下后只剩两列,勿改回 sm:grid-cols-3 -->
            <div class="footer-links">
              <div class="footer-link-group">
                <h2 class="footer-link-heading">{{ t('footer.product') }}</h2>
                <router-link to="/download" class="footer-link">{{ t('nav.download') }}</router-link>
                <a href="https://github.com/felinics/supermarket" target="_blank" rel="noopener noreferrer" class="footer-link">{{ t('nav.supermarket') }}</a>
              </div>
              <div class="footer-link-group">
                <h2 class="footer-link-heading">{{ t('footer.resources') }}</h2>
                <a :href="docsUrl" target="_blank" rel="noopener noreferrer" class="footer-link">{{ t('nav.docs') }}</a>
                <router-link to="/blogs" class="footer-link">{{ t('nav.blogs') }}</router-link>
                <a href="https://github.com/felinics/Memoh" target="_blank" rel="noopener noreferrer" class="footer-link">{{ t('nav.github') }}</a>
              </div>
              <!-- Legal 列整列撤下:Privacy/Terms 页面不存在,此前两个链接都指向首页占位。
                   页面就绪后恢复此列及 footer.privacy / footer.terms 文案。 -->
            </div>
          </div>

          <!-- Bottom row: legal line -->
          <div class="footer-bottom">
            <div class="footer-company">
              <span class="footer-copyright">{{ t('footer.copyright') }}</span>
            </div>
            <div
              v-if="isMemohNet"
              class="footer-registration"
            >
              <a :href="miitBeianUrl" target="_blank" rel="noopener noreferrer" class="hover:text-muted-foreground transition-colors">
                粤ICP备2020082274号
              </a>
              <span aria-hidden="true" class="text-muted-foreground/45">｜</span>
              <a :href="telecomLicenseUrl" target="_blank" rel="noopener noreferrer" class="hover:text-muted-foreground transition-colors">
                增值电信业务经营许可证 B1-20214707
              </a>
            </div>
            <div class="footer-socials">
              <a href="https://github.com/felinics/Memoh" target="_blank" rel="noopener noreferrer" aria-label="GitHub"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200">
                <span aria-hidden="true" class="github-icon h-4 w-4"></span>
              </a>
              <a href="https://t.me/memohai" target="_blank" rel="noopener noreferrer" aria-label="Telegram"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200">
                <span aria-hidden="true" class="telegram-icon h-4 w-4"></span>
              </a>
              <!-- 官方 X 账号是 @memoh_ai;x.com/memohai 是别人占用或无此账号(404),别改回去 -->
              <a href="https://x.com/memoh_ai" target="_blank" rel="noopener noreferrer" aria-label="X"
                 class="flex items-center justify-center w-9 h-9 rounded-md text-muted-foreground hover:text-foreground transition-colors duration-200">
                <span aria-hidden="true" class="x-icon h-3.5 w-3.5"></span>
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
.site-footer {
  position: relative;
  z-index: 10;
  width: min(100%, 1080px);
  padding: 0 32px 32px;
  color: var(--foreground);
  font-family: "Geist", "Noto Sans SC", sans-serif;
}
.footer-main {
  display: grid;
  grid-template-columns: minmax(0, 1.4fr) minmax(0, 1fr);
  gap: 80px;
  padding: 48px 0 40px;
  border-top: 1px solid var(--border);
}
.footer-wordmark {
  display: flex;
  align-items: center;
  gap: 10px;
}
.footer-tagline {
  max-width: 31ch;
  margin-top: 16px;
  color: var(--muted-foreground);
  font-family: var(--font-serif);
  font-size: 21px;
  font-weight: 400;
  line-height: 1.5;
  letter-spacing: -0.015em;
  white-space: pre-line;
  text-wrap: pretty;
}
.footer-links {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 32px;
}
.footer-link-group {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.footer-link-heading {
  margin-bottom: 12px;
  font-size: 13px;
  letter-spacing: 0.01em;
  line-height: 28px;
  font-weight: 500;
  color: var(--foreground);
}
.footer-link {
  padding-block: 5px;
  font-size: 14px;
  line-height: 22px;
  color: var(--muted-foreground);
  text-decoration-color: transparent;
  text-underline-offset: 5px;
  transition: color 160ms, text-decoration-color 160ms;
}
.footer-link:hover {
  color: var(--foreground);
  text-decoration: underline;
}
.footer-bottom {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 20px 32px;
  padding-top: 24px;
  border-top: 1px solid color-mix(in srgb, var(--border) 60%, transparent);
}
.footer-company {
  display: flex;
  flex-direction: column;
  gap: 6px;
  min-width: 0;
}
.footer-copyright, .footer-registration {
  font-size: 11px;
  line-height: 1.6;
  color: var(--muted-foreground);
}
.github-icon {
  background-color: currentColor;
  mask: url("/brands/github.svg") center / contain no-repeat;
  -webkit-mask: url("/brands/github.svg") center / contain no-repeat;
}
.x-icon {
  background-color: currentColor;
  mask: url("/brands/x.svg") center / contain no-repeat;
  -webkit-mask: url("/brands/x.svg") center / contain no-repeat;
}
.footer-socials { display: flex; gap: 6px; }
.footer-registration {
  display: flex;
  flex-wrap: wrap;
  gap: 4px 8px;
}
.site-footer :is(a, button):focus-visible {
  outline: 2px solid var(--primary);
  outline-offset: 4px;
  border-radius: 4px;
}
@media (max-width: 639px) {
  .site-footer { padding: 0 24px 28px; }
  .footer-main {
    grid-template-columns: 1fr;
    gap: 32px;
    padding: 36px 0 28px;
  }
  .footer-tagline { margin-top: 12px; font-size: 20px; }
  .footer-link { padding-block: 9px; }
  .footer-bottom { gap: 16px; }
  .footer-socials { margin-left: -9px; }
}


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
