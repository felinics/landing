<script setup lang="ts">
// S2-2 主动找你：以 Telegram 为基准——「主动外联」发生在 IM 上，不是客户端里。
// 有上文：昨晚你让 Ta 盯着某个版本（23:14），第二天早上 9:02 Ta 主动来报告——
// 时间差让「Ta 先找你、且一直在」成立。不加头像（mascot 圆裁会被切），只留名字。
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <div class="proof-surface flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0e1621]">
    <!-- Telegram 会话头：只留名字 + 在线，不放会被裁切的头像 -->
    <div class="flex shrink-0 flex-col justify-center border-b border-white/[0.06] bg-[#17212b] px-3.5 py-2">
      <p class="text-[13px] font-medium leading-tight text-white">Felinic</p>
      <p class="text-[11px] leading-tight text-[#6cb1e1]">{{ t('proof.proactive.online') }}</p>
    </div>

    <!-- 消息贴底；上文在前、主动来消息在后 -->
    <div class="flex min-h-0 flex-1 flex-col justify-end gap-2 p-3">
      <!-- 昨晚：你让 Ta 盯着 -->
      <div class="flex justify-end">
        <div class="max-w-[85%] rounded-2xl rounded-br-sm bg-[#2b5278] px-3 py-1.5">
          <p class="text-[12.5px] leading-snug text-white">{{ t('proof.proactive.ask') }}</p>
          <p class="mt-0.5 text-right text-[10px] leading-none text-white/45">{{ t('proof.proactive.t1') }}</p>
        </div>
      </div>
      <div class="flex">
        <div class="max-w-[85%] rounded-2xl rounded-bl-sm bg-[#182533] px-3 py-1.5">
          <p class="text-[12.5px] leading-snug text-white">{{ t('proof.proactive.ack') }}</p>
          <p class="mt-0.5 text-right text-[10px] leading-none text-white/40">{{ t('proof.proactive.t1') }}</p>
        </div>
      </div>

      <!-- 今早 9:02：Ta 主动来报（你昨晚交代的事） -->
      <div class="flex">
        <div class="max-w-[88%] rounded-2xl rounded-bl-sm bg-[#182533] px-3 py-2">
          <p class="text-[12.5px] leading-snug text-white">{{ t('proof.proactive.say') }}</p>
          <p class="mt-1 text-right text-[10px] leading-none text-white/40">{{ t('proof.proactive.t2') }}</p>
        </div>
      </div>

      <!-- 14:20：Ta 又一条完全没人催的主动提醒 -->
      <div class="flex">
        <div class="max-w-[88%] rounded-2xl rounded-bl-sm bg-[#182533] px-3 py-2">
          <p class="text-[12.5px] leading-snug text-white">{{ t('proof.proactive.say2') }}</p>
          <p class="mt-1 text-right text-[10px] leading-none text-white/40">{{ t('proof.proactive.t3') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
