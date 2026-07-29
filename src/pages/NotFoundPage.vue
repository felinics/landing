<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useHead, useSeoMeta } from '@unhead/vue'
import { ArrowLeft } from 'lucide-vue-next'

const { locale, t } = useI18n()

useSeoMeta({
  title: () => t('notFound.seo.title'),
  description: () => t('notFound.seo.description'),
  // 404 页不应被索引;GitHub Pages 本身对未知路径就返回 404 状态,这里再显式 noindex 兜底
  robots: 'noindex, follow',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
})
</script>

<template>
  <main class="w-full max-w-[1080px] mx-auto px-4 md:px-8 flex flex-col items-center text-center py-32 md:py-44">
    <p class="font-serif font-medium text-7xl md:text-8xl text-foreground/20 select-none" aria-hidden="true">404</p>
    <h1 class="mt-6 font-serif font-medium text-3xl md:text-4xl text-foreground">{{ t('notFound.title') }}</h1>
    <p class="mt-4 text-sm md:text-base text-muted-foreground">{{ t('notFound.desc') }}</p>
    <RouterLink
      to="/"
      class="mt-10 inline-flex h-11 items-center justify-center gap-2 rounded-full px-6 text-sm font-medium bg-foreground text-background transition-transform hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <ArrowLeft :size="16" />
      {{ t('notFound.back') }}
    </RouterLink>
  </main>
</template>
