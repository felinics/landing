<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { ArrowRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useHead, useSeoMeta } from '@unhead/vue'
import HeroSection from '../components/HeroSection.vue'
import ProofDesktop from '../components/proof/ProofDesktop.vue'
import ProofFiles from '../components/proof/ProofFiles.vue'
import ProofNetwork from '../components/proof/ProofNetwork.vue'
import ProofSchedule from '../components/proof/ProofSchedule.vue'
import ProofProactive from '../components/proof/ProofProactive.vue'
import ProofMemory from '../components/proof/ProofMemory.vue'
import ProofChannel from '../components/proof/ProofChannel.vue'
import { useTa } from '../composables/useTa'

const { locale, t } = useI18n()
const { th } = useTa()
const siteUrl = 'https://memoh.ai/'
const socialImage = 'https://memoh.ai/logo.png'
const docsUrl = computed(() => locale.value === 'zh' ? 'https://docs.memoh.ai/zh' : 'https://docs.memoh.ai')

useSeoMeta({
  title: () => t('seo.title'),
  description: () => t('seo.description'),
  ogTitle: () => t('seo.title'),
  ogDescription: () => t('seo.description'),
  ogType: 'website',
  ogUrl: siteUrl,
  ogImage: socialImage,
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('seo.title'),
  twitterDescription: () => t('seo.description'),
  twitterImage: socialImage,
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
  link: [
    { rel: 'canonical', href: siteUrl },
    { rel: 'alternate', hreflang: 'en', href: siteUrl },
    { rel: 'alternate', hreflang: 'zh', href: siteUrl },
    { rel: 'alternate', hreflang: 'x-default', href: siteUrl },
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: computed(() => JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        'name': 'MemohAI',
        'operatingSystem': 'Linux, macOS, Windows',
        'applicationCategory': 'BusinessApplication',
        'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
        'description': t('seo.description'),
        'author': { '@type': 'Organization', 'name': 'MemohAI' },
      })),
    },
  ],
})

const s1Proofs = [
  { key: 'desktop', comp: ProofDesktop },
  { key: 'files', comp: ProofFiles },
  { key: 'network', comp: ProofNetwork },
]

const s2Proofs = [
  { key: 'cron', comp: ProofSchedule },
  { key: 'proactive', comp: ProofProactive },
  { key: 'memory', comp: ProofMemory },
]

const s3Channels = [
  { name: 'Desktop', platform: 'desktop' as const },
  { name: 'Telegram', platform: 'telegram' as const },
  { name: 'WeChat', platform: 'wechat' as const },
  { name: 'Discord', platform: 'discord' as const },
]

const moreLogos = [
  { name: 'WeChat',   src: '/brands/wechat.svg' },
  { name: 'Telegram', src: '/brands/telegram.svg' },
  { name: 'Discord',  src: '/brands/discord.svg' },
  { name: 'QQ',       src: '/brands/qq.svg' },
  { name: 'Slack',    src: '/brands/slack.svg' },
  { name: 'Gmail',    src: '/brands/gmail.svg' },
  { name: 'LINE',     src: '/brands/line.svg' },
  { name: 'WhatsApp', src: '/brands/whatsapp.svg' },
  { name: 'Matrix',   src: '/brands/matrix.svg' },
]
</script>

<template>
  <!-- ═══ HERO ═══ -->
  <HeroSection />

  <!-- ═══ SCREEN 1 — 一台属于 Ta 的电脑 (图片大卡片 · railway) ═══ -->
  <section class="w-full px-4 md:px-6 pt-[40px] md:pt-[52px] pb-[8px] md:pb-[10px]">
    <div class="w-full relative rounded-3xl overflow-hidden border border-white/10" style="min-height:clamp(520px,72vh,820px)">
      <!-- 底部锚定：图片宽度撑满，高度自然，底部固定，顶部溢出被裁 -->
      <img src="/art-railway.webp" alt="" class="absolute bottom-0 left-0 w-full h-auto" style="min-height:100%;object-fit:cover;object-position:38% 100%" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 via-55% to-transparent" />
      <div class="relative z-10 flex justify-center px-6 md:px-12 pt-10 md:pt-14 pb-0">
        <div class="w-full max-w-[1080px] flex flex-col gap-10 md:gap-12">
          <div class="flex flex-col gap-3 max-w-[600px]">
            <h2 class="font-semibold text-2xl md:text-3xl tracking-tight text-white" v-html="th('s1.title')" />
            <p class="text-base md:text-lg text-white/80 leading-snug whitespace-pre-line" v-html="th('s1.subtitle')" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div v-for="(proof, i) in s1Proofs" :key="proof.key" class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 md:p-5">
              <div class="flex flex-col gap-0.5 px-1">
                <h3 class="font-medium text-base text-white" v-html="th(`s1.c${i+1}.title`)" />
                <p class="text-sm text-white/65 leading-snug whitespace-pre-line" v-html="th(`s1.c${i+1}.desc`)" />
              </div>
              <div class="aspect-[4/5] overflow-hidden">
                <component :is="proof.comp" />
              </div>
            </div>
          </div>

          <!-- 留白让图片下部的列车露出 -->
          <div class="h-[120px] md:h-[170px]" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ SCREEN 2 — 你不在的时候 Ta 也在 (图片大卡片 · station) ═══ -->
  <section class="w-full px-4 md:px-6 py-[8px] md:py-[10px]">
    <div class="w-full relative rounded-3xl overflow-hidden border border-white/10" style="min-height:clamp(520px,72vh,820px)">
      <!-- 底部锚定：灯亭在图片下部，底部固定确保可见 -->
      <img src="/art-station.webp" alt="" class="absolute bottom-0 left-0 w-full h-auto" style="min-height:100%;object-fit:cover;object-position:57% 100%" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 via-55% to-transparent" />
      <div class="relative z-10 flex justify-center px-6 md:px-12 pt-10 md:pt-14 pb-0">
        <div class="w-full max-w-[1080px] flex flex-col gap-10 md:gap-12">
          <div class="flex flex-col gap-3 max-w-[600px]">
            <h2 class="font-semibold text-2xl md:text-3xl tracking-tight text-white" v-html="th('s2.title')" />
            <p class="text-base md:text-lg text-white/80 leading-snug whitespace-pre-line" v-html="th('s2.subtitle')" />
          </div>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
            <div v-for="(proof, i) in s2Proofs" :key="proof.key" class="flex flex-col gap-4 rounded-2xl border border-white/10 bg-black/30 backdrop-blur-sm p-4 md:p-5">
              <div class="flex flex-col gap-0.5 px-1">
                <h3 class="font-medium text-base text-white" v-html="th(`s2.c${i+1}.title`)" />
                <p class="text-sm text-white/65 leading-snug whitespace-pre-line" v-html="th(`s2.c${i+1}.desc`)" />
              </div>
              <div class="aspect-[4/5] overflow-hidden">
                <component :is="proof.comp" />
              </div>
            </div>
          </div>

          <!-- 留白让图片下部的站台露出 -->
          <div class="h-[120px] md:h-[170px]" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ SCREEN 3 — 在哪都能找到 Ta (图片大卡片 · cafe) ═══ -->
  <section class="w-full px-4 md:px-6 py-[8px] md:py-[10px]">
    <div class="w-full relative rounded-3xl overflow-hidden border border-white/10" style="min-height:clamp(520px,72vh,820px)">
      <!-- 底部锚定：小猫在图片底部，底部固定确保可见 -->
      <img src="/art-cafe.webp" alt="" class="absolute bottom-0 left-0 w-full h-auto" style="min-height:100%;object-fit:cover;object-position:62% 100%" />
      <div class="absolute inset-0 bg-gradient-to-b from-black/55 via-black/25 via-55% to-transparent" />
      <div class="relative z-10 flex justify-center px-6 md:px-12 pt-10 md:pt-14 pb-0">
        <div class="w-full max-w-[1080px] flex flex-col gap-10 md:gap-12">
          <div class="flex flex-col gap-3 max-w-[600px]">
            <h2 class="font-semibold text-2xl md:text-3xl tracking-tight text-white" v-html="th('s3.title')" />
            <p class="text-base md:text-lg text-white/80 leading-snug whitespace-pre-line" v-html="th('s3.subtitle')" />
          </div>

          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <div v-for="ch in s3Channels" :key="ch.name" class="flex flex-col gap-0 rounded-xl border border-white/10 bg-black/40 backdrop-blur-sm overflow-hidden">
              <div class="aspect-[3/4] overflow-hidden">
                <ProofChannel :platform="ch.platform" />
              </div>
              <div class="px-3 py-2.5 border-t border-white/10">
                <span class="text-xs font-medium text-white">{{ ch.name }}</span>
              </div>
            </div>
          </div>

          <!-- And more · logo strip -->
          <div class="flex flex-col gap-3 pb-2">
            <p class="text-base text-white font-medium leading-snug">{{ locale === 'zh' ? '以及更多平台' : 'And more' }}</p>
            <div class="flex flex-wrap items-center gap-3">
              <span
                v-for="logo in moreLogos"
                :key="logo.name"
                class="inline-flex h-10 min-w-10 items-center justify-center rounded-xl border border-white/10 bg-black/40 px-2.5 backdrop-blur-sm"
              >
                <img :src="logo.src" :alt="logo.name" class="h-5 w-auto" />
              </span>
            </div>
          </div>

          <!-- 留白让图片下部的小猫露出 -->
          <div class="h-[60px] md:h-[90px]" />
        </div>
      </div>
    </div>
  </section>

  <!-- ═══ BOTTOM CTA ═══ -->
  <section class="w-full flex items-center justify-center min-h-[60vh] pt-[120px] pb-[140px] px-4 md:px-8">
    <div class="w-full max-w-[1080px] flex flex-col items-center text-center gap-8">
      <h2 class="font-semibold text-3xl md:text-4xl tracking-tight text-foreground">
        {{ $t('cta_bottom.title') }}
      </h2>
      <div class="flex flex-col sm:flex-row items-center gap-4">
        <RouterLink
          to="/waitlist"
          class="cta-btn-primary inline-flex items-center justify-center gap-2 h-[48px] px-8 rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {{ $t('cta_bottom.btn') }}
          <ArrowRight :size="16" />
        </RouterLink>
        <a
          :href="docsUrl"
          target="_blank"
          rel="noopener noreferrer"
          class="cta-btn-secondary inline-flex items-center justify-center h-[48px] px-8 rounded-full font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
        >
          {{ $t('cta_bottom.docs') }}
        </a>
      </div>
    </div>
  </section>
</template>

<style scoped>
.cta-btn-primary {
  position: relative;
  color: var(--background);
  isolation: isolate;
}
.cta-btn-primary::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: var(--foreground);
  transition: scale 0.3s linear(0, .3505, .7432, .9336, .9951, 1.0062, 1.0045, 1.0019, 1.0005, 1);
}
.cta-btn-primary::after {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: rgba(0, 0, 0, 0.08);
  opacity: 0;
  transition: opacity 0.18s ease-out;
}
.cta-btn-primary:hover::before {
  scale: 1.005 1.015;
}
.cta-btn-primary:hover::after {
  opacity: 1;
}
.cta-btn-primary:active::after {
  opacity: 1;
  background-color: rgba(0, 0, 0, 0.12);
}

.cta-btn-secondary {
  position: relative;
  color: var(--foreground);
  isolation: isolate;
}
.cta-btn-secondary::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  border: 1px solid oklch(1 0 0 / 0.15);
  background-color: transparent;
  transition: scale 0.3s linear(0, .3505, .7432, .9336, .9951, 1.0062, 1.0045, 1.0019, 1.0005, 1),
              background-color 0.18s ease-out;
}
.cta-btn-secondary:hover::before {
  scale: 1.005 1.015;
  background-color: oklch(1 0 0 / 0.06);
}
.cta-btn-secondary:active::before {
  scale: 0.98;
}
</style>
