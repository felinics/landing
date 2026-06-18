<script setup lang="ts">
// S1-3 网络：忠实复刻产品「助手回合」——一条联网工具行 + 抓回的网页截图 + 助手文案。
// 本地聊天里助手无头像、无气泡（纯文本）；工具行是灰色「动词 目标」，搬自 tool-call-inline。
// 截图是真实抓取的 example.com，证明「Ta 真的上网了」。
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="proof-surface flex h-full w-full flex-col justify-center gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e] p-4">
    <!-- 助手正文：先说要做什么，再出工具行（对齐产品「文本块 + 工具行」的回合结构） -->
    <p class="text-[13px] leading-relaxed text-foreground/90">{{ t('proof.network.try') }}</p>

    <!-- 联网工具行：灰色「抓取 example.com」+ 折叠箭头，对齐产品 web_fetch 行 -->
    <div class="flex items-center gap-1.5 text-[0.84375rem] text-muted-foreground">
      <span class="shrink-0">{{ t('proof.network.fetch') }}</span>
      <span class="min-w-0 truncate text-foreground/80">example.com</span>
      <ChevronRight class="size-3.5 shrink-0 opacity-50" />
    </div>

    <!-- 抓回的网页截图（产品里助手把截图作为附件展示） -->
    <div class="overflow-hidden rounded-lg border border-white/10 bg-white/[0.02]">
      <img
        src="/hero/example-com.png"
        alt="example.com"
        class="aspect-[16/10] w-full object-cover object-top"
        loading="lazy"
      />
    </div>

    <!-- 助手文案：上线的小兴奋 -->
    <p class="text-[13px] leading-relaxed text-foreground/85">{{ t('proof.network.say') }}</p>
  </div>
</template>
