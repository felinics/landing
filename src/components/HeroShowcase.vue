<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'

withDefaults(defineProps<{ chrome?: boolean }>(), { chrome: true })
const { locale } = useI18n()
const demoUrl = computed(() => `/memoh-demo/index.html?lang=${locale.value === 'zh' ? 'zh' : 'en'}`)
const ready = ref(false)
watch(demoUrl, () => { ready.value = false })
</script>

<template>
  <div class="hero-demo relative flex size-full flex-col overflow-hidden rounded-xl border border-white/10 shadow-2xl">
    <div class="relative min-h-0 flex-1">
      <div v-if="!ready" class="absolute inset-0 flex items-center justify-center text-sm text-neutral-400">
        {{ locale === 'zh' ? '正在打开 Memoh…' : 'Opening Memoh…' }}
      </div>
      <iframe
        :key="demoUrl"
        :src="demoUrl"
        :title="locale === 'zh' ? 'Memoh 交互演示' : 'Interactive Memoh demo'"
        class="absolute inset-0 size-full border-0"
        loading="lazy"
        @load="ready = true"
      />
    </div>
  </div>
</template>

<style scoped>
.hero-demo { background: #191919; color-scheme: dark; }
</style>
