<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PlanCard from './pricing/PlanCard.vue'
import './pricing/cloud-pricing.css'
import './pricing/fonts.css'

const { locale } = useI18n()
const zh = computed(() => locale.value === 'zh')
const plans = computed(() => [
  { name: 'Go', price: '$9', tagline: zh.value ? '从日常对话和轻量任务开始。' : 'For everyday conversations and lighter tasks.', tokens: '2M', cpu: 2, ram: 4, disk: 20, hours: 60, computers: 1 },
  { name: 'Pro', price: '$29', tagline: zh.value ? '为日常工作和持续运行的 Agent 准备。' : 'For daily work and always-ready agents.', tokens: '10M', cpu: 4, ram: 8, disk: 50, hours: 200, computers: 2 },
  { name: 'Premium', price: '$79', tagline: zh.value ? '为更复杂的任务提供更多算力和空间。' : 'More compute and room for demanding work.', tokens: '30M', cpu: 8, ram: 16, disk: 100, hours: 600, computers: 5 },
].map(plan => ({ ...plan, features: [
  { text: `${plan.tokens} Tokens ${zh.value ? '/ 月' : '/ month'}`, emphasis: true },
  { text: `${plan.cpu} vCPU · ${plan.ram} GB RAM` },
  { text: `${plan.disk} GB ${zh.value ? '云电脑存储' : 'cloud computer storage'}` },
  { text: zh.value ? `每月 ${plan.hours} 云电脑运行小时` : `${plan.hours} cloud computer hours / month` },
  { text: zh.value ? `最多 ${plan.computers} 台云电脑` : `Up to ${plan.computers} cloud computer${plan.computers > 1 ? 's' : ''}` },
] })))
function selectPlan() { window.location.assign('https://app.memoh.net/') }
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
            :price="plan.price"
            :price-suffix="zh ? '/ 月' : '/mo'"
            :features="plan.features"
            :highlighted="plan.name === 'Pro'"
            :highlight-label="zh ? '推荐' : 'Recommended'"
            :current-label="zh ? '当前套餐' : 'Current plan'"
            :cta-label="zh ? '立即开始' : 'Get started'"
            @select="selectPlan"
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
