<script setup lang="ts">
// S3 渠道：同一个 Ta，在你已经在用的地方各做一件真实的小事——证明「在哪都能找到 Ta」。
// 视角=用户：自己的消息在右，Ta 的回复在左。每个平台原生深色样式 + 不同对话 + 不同轮数：
//  · desktop  2 轮｜telegram 3 轮｜wechat 2 轮｜discord 2 轮——长短不一，但都控制在一屏内不溢出。
//  · desktop  = Memoh 原生聊天（用户右品牌气泡 + 助手左纯文本）
//  · telegram = Telegram 原生（蓝色发出气泡 + 深色来向气泡，头部含在线状态）
//  · wechat   = 微信原生（绿色发出气泡黑字 + 深灰来向气泡）
//  · discord  = 扁平列表（频道 + 彩色用户名 + 正文）
// 不放头像（mascot 圆裁会被切），只留名字——按「不会加就别加，留名字即可」。
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps<{ platform: 'desktop' | 'telegram' | 'wechat' | 'discord' }>()
const { t } = useI18n()

const page = computed(() => ({
  desktop: '#0b0b0e',
  telegram: '#0e1621',
  wechat: '#1a1a1a',
  discord: '#313338',
}[props.platform]))

const rounds = { desktop: 2, telegram: 3, wechat: 2, discord: 2 } as const

// 展开成消息序列（user/agent 交替），每个平台轮数不同。
const messages = computed(() => {
  const out: { side: 'user' | 'agent'; key: string }[] = []
  for (let i = 1; i <= rounds[props.platform]; i++) {
    out.push({ side: 'user', key: `proof.channel.${props.platform}.u${i}` })
    out.push({ side: 'agent', key: `proof.channel.${props.platform}.a${i}` })
  }
  return out
})

const im = {
  telegram: {
    header: '#17212b',
    online: true,
    inBubble: 'bg-[#182533] text-white rounded-2xl rounded-bl-sm',
    outBubble: 'bg-[#2b5278] text-white rounded-2xl rounded-br-sm',
  },
  wechat: {
    header: '#1f1f1f',
    online: false,
    inBubble: 'bg-[#2c2c2e] text-[#ededed] rounded-md',
    outBubble: 'bg-[#95ec69] text-black rounded-md',
  },
} as const

const cfg = computed(() => im[props.platform as 'telegram' | 'wechat'])
</script>

<template>
  <div class="proof-surface w-full overflow-hidden md:h-full" :style="{ backgroundColor: page }">
    <!-- Memoh 原生聊天：用户右品牌气泡 + 助手左纯文本 -->
    <div v-if="platform === 'desktop'" class="flex flex-col md:h-full">
      <div class="flex shrink-0 items-center border-b border-white/[0.06] px-4 py-3 md:px-3.5 md:py-2.5">
        <span class="text-[13px] font-[550] tracking-[-0.02em] text-white/70 md:text-[11px]">Felinic</span>
      </div>
      <div class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2.5 md:p-3">
        <template v-for="(m, i) in messages" :key="i">
          <div v-if="m.side === 'user'" class="flex justify-end">
            <p class="w-fit max-w-[86%] rounded-2xl bg-chat-user-bubble px-3.5 py-2 text-[14px] leading-snug text-chat-user-bubble-fg md:px-3 md:py-1.5 md:text-[11.5px]">{{ t(m.key) }}</p>
          </div>
          <p v-else class="text-[14px] leading-relaxed text-foreground/90 md:text-[11.5px]">{{ t(m.key) }}</p>
        </template>
      </div>
    </div>

    <!-- Telegram / WeChat 原生气泡 -->
    <div v-else-if="platform === 'telegram' || platform === 'wechat'" class="flex flex-col md:h-full">
      <div class="flex shrink-0 flex-col justify-center px-4 py-2.5 md:px-3.5 md:py-2" :style="{ backgroundColor: cfg.header }">
        <p class="text-[13px] font-medium leading-tight text-white md:text-[12px]">Felinic</p>
        <p v-if="cfg.online" class="text-[11px] leading-tight text-[#6cb1e1] md:text-[10px]">{{ t('proof.channel.online') }}</p>
      </div>
      <div class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2 md:p-3">
        <div v-for="(m, i) in messages" :key="i" class="flex" :class="m.side === 'user' ? 'justify-end' : ''">
          <p class="max-w-[82%] px-3 py-2 text-[14px] leading-snug md:px-2.5 md:py-1.5 md:text-[11.5px]" :class="m.side === 'user' ? cfg.outBubble : cfg.inBubble">{{ t(m.key) }}</p>
        </div>
      </div>
    </div>

    <!-- Discord 扁平列表：彩色用户名 + 正文，不放头像 -->
    <div v-else class="flex flex-col md:h-full">
      <div class="flex shrink-0 items-center bg-[#2b2d31] px-4 py-3 md:px-3 md:py-2.5">
        <span class="truncate text-[13px] font-semibold text-white/90 md:text-[12px]">{{ t('proof.channel.discord.channel') }}</span>
      </div>
      <div class="flex min-h-0 flex-col gap-3 p-4 md:flex-1 md:justify-end md:gap-2 md:p-3">
        <div v-for="(m, i) in messages" :key="i" class="min-w-0">
          <span class="text-[12px] font-medium leading-tight md:text-[11px]" :class="m.side === 'user' ? 'text-[#949ba4]' : 'text-[#c8a2ff]'">{{ m.side === 'user' ? t('proof.channel.you') : 'Felinic' }}</span>
          <p class="text-[13.5px] leading-snug text-[#dbdee1] md:text-[11px]">{{ t(m.key) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
