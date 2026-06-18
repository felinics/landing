<script setup lang="ts">
// S2-3 记忆：忠实复刻产品本地聊天——用户消息右侧品牌气泡，助手回复左侧纯文本（无气泡/无头像）。
// 用「文本 + 记忆工具行」的回合结构把机制演出来：先「搜索记忆」翻出上次的事再回答，
// 再「写入 MEMORY.md」把要点记下——所以下次能从上次的地方接着聊，而不是每次从零交代。
import { ChevronRight } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="proof-surface flex h-full w-full flex-col justify-end gap-3 overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e] p-4">
    <!-- 轮次 1：用户问起上次的事 → Ta 先搜记忆，再答 -->
    <div class="flex justify-end">
      <p class="w-fit max-w-[82%] rounded-2xl bg-chat-user-bubble px-3.5 py-2.5 text-[13px] leading-snug text-chat-user-bubble-fg">
        {{ t('proof.memory.u1') }}
      </p>
    </div>
    <div class="flex items-center gap-1.5 text-[0.84375rem] text-muted-foreground">
      <span class="shrink-0">{{ t('proof.memory.recall') }}</span>
      <span class="min-w-0 truncate text-foreground/80">{{ t('proof.memory.recallTarget') }}</span>
      <ChevronRight class="size-3.5 shrink-0 opacity-50" />
    </div>
    <p class="text-[13px] leading-relaxed text-foreground/90">{{ t('proof.memory.a1') }}</p>

    <!-- 轮次 2：让 Ta 记下要点 → Ta 写进 MEMORY.md，承诺下次接着做 -->
    <div class="flex justify-end">
      <p class="w-fit max-w-[82%] rounded-2xl bg-chat-user-bubble px-3.5 py-2.5 text-[13px] leading-snug text-chat-user-bubble-fg">
        {{ t('proof.memory.u2') }}
      </p>
    </div>
    <div class="flex items-center gap-1.5 text-[0.84375rem] text-muted-foreground">
      <span class="shrink-0">{{ t('proof.memory.write') }}</span>
      <span class="min-w-0 truncate text-foreground/80">MEMORY.md</span>
      <ChevronRight class="size-3.5 shrink-0 opacity-50" />
    </div>
    <p class="text-[13px] leading-relaxed text-foreground/90">{{ t('proof.memory.a2') }}</p>
  </div>
</template>
