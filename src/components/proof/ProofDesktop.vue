<script setup lang="ts">
// S1-1 桌面：用 Agent 真实桌面截图——终端 + 浏览器，本身就是深色。
// 中英文各一张：中文版带中文注释，英文版纯英文。
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const { locale } = useI18n()
const src = computed(() => locale.value === 'zh' ? '/hero/desktop-zh.png' : '/hero/desktop-en.png')
</script>

<template>
  <div class="proof-surface relative h-full w-full overflow-hidden rounded-xl border border-white/10 bg-black">
    <img
      :src="src"
      alt=""
      class="h-full w-full object-cover object-top"
      loading="lazy"
    />
    <div class="pointer-events-none absolute inset-0 rounded-xl ring-1 ring-inset ring-white/[0.06]" />
  </div>
</template>
