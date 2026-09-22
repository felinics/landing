<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PlanCard from './pricing/PlanCard.vue'
import './pricing/cloud-pricing.css'
import './pricing/fonts.css'

const { locale } = useI18n()
const zh = computed(() => locale.value === 'zh')
const appOrigin = import.meta.env.VITE_MEMOH_APP_URL || 'https://app.memoh.net'
function getStarted(plan: string) {
  const url = new URL('/plans', appOrigin)
  url.searchParams.set('plan', plan)
  window.location.assign(url.href)
}
// `code` must equal the Cloud storefront listing code (admin → 订阅运营 → 定价页展示),
// not the plan name: Cloud's /plans?plan= matches it exactly and shows "此套餐暂不可用"
// on a miss. Renaming a card in Cloud means updating these values in the same release.
const plans = computed(() => [
  { code: 'go-monthly', name: 'Go', price: 5, credits: 2500, tagline: zh.value ? '从日常对话和轻量任务开始。' : 'For everyday conversations and lighter tasks.', cpu: 8, ram: 16, disk: 40, members: 1 },
  { code: 'pro-monthly', name: 'Pro', price: 60, credits: 30000, tagline: zh.value ? '为日常工作和持续运行的 Agent 准备。' : 'For daily work and always-ready agents.', cpu: 16, ram: 32, disk: 120, members: 3 },
  { code: 'premium-monthly', name: 'Premium', price: 150, credits: 75000, tagline: zh.value ? '为更复杂的任务提供更多算力和空间。' : 'More compute and room for demanding work.', cpu: 32, ram: 64, disk: 300, members: 8 },
].map(plan => ({ ...plan, features: [
  { text: `${plan.cpu} ${zh.value ? '核 CPU Total' : 'CPU cores total'}`, emphasis: true },
  { text: `${plan.ram} GB ${zh.value ? '内存 Total' : 'RAM total'}`, emphasis: true },
  { text: zh.value ? `每月 ${plan.credits} credits 的 Token 额度` : `${plan.credits} credits for tokens / month`, emphasis: true },
  { text: zh.value
    ? `${plan.disk} GB 持久化 Volume 总容量（不含 rootfs）`
    : `${plan.disk} GB persistent volume storage total (excluding rootfs)` },
  { text: zh.value ? `最多 ${plan.members} 人` : `Up to ${plan.members} ${plan.members === 1 ? 'member' : 'members'}` },
  ...(plan.name === 'Go' ? [
    { text: zh.value ? '创建无限多的 Bot' : 'Create unlimited Bots' },
    { text: zh.value ? '使用 DeepSeek、Kimi、GPT、Claude 等模型' : 'Use DeepSeek, Kimi, GPT, Claude, and more' },
  ] : [
    { text: zh.value
      ? `包含 ${plan.name === 'Pro' ? 'Go' : 'Pro'} 套餐的所有权益`
      : `Everything in ${plan.name === 'Pro' ? 'Go' : 'Pro'}` },
  ]),
] })))
</script>

<template>
  <section id="pricing" class="w-full px-4 py-16 md:px-8 md:py-24" aria-labelledby="pricing-title">
    <div class="mx-auto w-full max-w-[1080px]">
      <h2 id="pricing-title" class="mb-10 text-balance text-center font-medium text-[clamp(28px,3.2vw,42px)] leading-[1.2] tracking-[-0.045em] text-foreground">Pricing</h2>
      <div class="cloud-pricing">
        <div class="pricing-grid">
          <PlanCard
            v-for="plan in plans"
            :key="plan.name"
            class="min-w-0"
            :name="plan.name"
            :tagline="plan.tagline"
            :price="`$${plan.price}`"
            :price-suffix="zh ? '/ 月' : '/mo'"
            :features="plan.features"
            :highlighted="plan.name === 'Go'"
            :highlight-label="zh ? '推荐' : 'Recommended'"
            :current-label="zh ? '当前套餐' : 'Current plan'"
            cta-label="Get Started"
            @select="getStarted(plan.code)"
          />
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
.pricing-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  max-width: 960px;
  margin-inline: auto;
}
@media (min-width: 768px) {
  .pricing-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
}
</style>
