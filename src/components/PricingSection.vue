<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import PlanCard from './pricing/PlanCard.vue'
import './pricing/cloud-pricing.css'
import './pricing/fonts.css'

const { t } = useI18n()
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
  { code: 'go-monthly', name: 'Go', price: 5, credits: 2500, tagline: t('pricing.go.tagline'), cpu: 8, ram: 16, disk: 40, members: 1 },
  { code: 'pro-monthly', name: 'Pro', price: 60, credits: 30000, tagline: t('pricing.pro.tagline'), cpu: 16, ram: 32, disk: 120, members: 3 },
  { code: 'premium-monthly', name: 'Premium', price: 150, credits: 75000, tagline: t('pricing.premium.tagline'), cpu: 32, ram: 64, disk: 300, members: 8 },
].map(plan => ({ ...plan, features: [
  { text: t('pricing.features.cpu', { n: plan.cpu }), emphasis: true },
  { text: t('pricing.features.ram', { n: plan.ram }), emphasis: true },
  { text: t('pricing.features.credits', { n: plan.credits }), emphasis: true },
  { text: t('pricing.features.disk', { n: plan.disk }) },
  { text: t('pricing.features.members', { n: plan.members }, plan.members) },
  ...(plan.name === 'Go' ? [
    { text: t('pricing.features.unlimitedBots') },
    { text: t('pricing.features.models') },
  ] : [
    { text: t('pricing.features.everythingIn', { plan: plan.name === 'Pro' ? 'Go' : 'Pro' }) },
  ]),
] })))
</script>

<template>
  <section id="pricing" class="w-full px-4 py-16 md:px-8 md:py-24" aria-labelledby="pricing-title">
    <div class="mx-auto w-full max-w-[1080px]">
      <h2 id="pricing-title" class="mb-10 text-balance text-center font-medium text-[clamp(28px,3.2vw,42px)] leading-[1.2] tracking-[-0.045em] text-foreground">{{ t('pricing.title') }}</h2>
      <div class="cloud-pricing">
        <div class="pricing-grid">
          <PlanCard
            v-for="plan in plans"
            :key="plan.name"
            class="min-w-0"
            :name="plan.name"
            :tagline="plan.tagline"
            :price="`$${plan.price}`"
            :price-suffix="t('pricing.perMonth')"
            :features="plan.features"
            :highlighted="plan.name === 'Go'"
            :highlight-label="t('pricing.recommended')"
            :current-label="t('pricing.currentPlan')"
            :cta-label="t('pricing.cta')"
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
