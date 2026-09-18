<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import { useHead, useSeoMeta } from '@unhead/vue'
import { ArrowRight, Check, Mail, ShieldCheck } from 'lucide-vue-next'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const { locale, t } = useI18n()
const pageUrl = 'https://memoh.ai/waitlist'
const waitlistApiUrl = 'https://memoh.ai/api/waitlist'

const email = ref('')
const status = ref<SubmitState>('idle')
const errorMessage = ref('')

const isSubmitting = computed(() => status.value === 'submitting')
const canSubmit = computed(() => email.value.trim().length > 0 && !isSubmitting.value)

useSeoMeta({
  title: () => t('waitlist.seo.title'),
  description: () => t('waitlist.seo.description'),
  ogTitle: () => t('waitlist.seo.title'),
  ogDescription: () => t('waitlist.seo.description'),
  ogType: 'website',
  ogUrl: pageUrl,
  ogImage: 'https://memoh.ai/logo.png',
  twitterCard: 'summary_large_image',
  twitterTitle: () => t('waitlist.seo.title'),
  twitterDescription: () => t('waitlist.seo.description'),
  twitterImage: 'https://memoh.ai/logo.png',
})

useHead({
  htmlAttrs: {
    lang: computed(() => locale.value),
  },
  link: [
    { rel: 'canonical', href: pageUrl },
    { rel: 'alternate', hreflang: 'en', href: pageUrl },
    { rel: 'alternate', hreflang: 'zh', href: pageUrl },
    { rel: 'alternate', hreflang: 'ja', href: pageUrl },
    { rel: 'alternate', hreflang: 'x-default', href: pageUrl },
  ],
})

const submitWaitlist = async () => {
  if (!canSubmit.value) return

  status.value = 'submitting'
  errorMessage.value = ''

  try {
    const response = await fetch(waitlistApiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email: email.value }),
    })

    const data = await response.json().catch(() => undefined) as { error?: string } | undefined

    if (!response.ok) {
      throw new Error(data?.error || t('waitlist.form.error'))
    }

    status.value = 'success'
  } catch (error) {
    status.value = 'error'
    errorMessage.value = error instanceof Error ? error.message : t('waitlist.form.error')
  }
}
</script>

<template>
  <main class="w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <section class="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-10 lg:gap-14 items-start">
      <header class="flex max-w-[720px] flex-col gap-6">
        <div class="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
          <Mail class="h-3.5 w-3.5" />
          {{ t('waitlist.kicker') }}
        </div>

        <div class="flex flex-col gap-5">
          <h1 class="text-4xl md:text-6xl font-semibold tracking-tight text-foreground leading-[1.05]">
            {{ t('waitlist.title') }}
          </h1>
          <p class="max-w-[640px] text-base md:text-lg text-muted-foreground leading-relaxed">
            {{ t('waitlist.subtitle') }}
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
          <div
            v-for="item in ['one', 'two', 'three']"
            :key="item"
            class="rounded-xl border border-border bg-background p-4"
          >
            <Check class="mb-4 h-4 w-4 text-foreground" />
            <h2 class="text-sm font-semibold text-foreground">{{ t(`waitlist.notes.${item}.title`) }}</h2>
            <p class="mt-2 text-sm leading-relaxed text-muted-foreground">{{ t(`waitlist.notes.${item}.body`) }}</p>
          </div>
        </div>
      </header>

      <section class="rounded-xl border border-border bg-background p-5 md:p-6">
        <div class="mb-6 flex items-center gap-3">
          <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <ShieldCheck class="h-5 w-5" />
          </div>
          <div>
            <h2 class="text-base font-semibold tracking-tight text-foreground">{{ t('waitlist.form.title') }}</h2>
            <p class="text-sm text-muted-foreground">{{ t('waitlist.form.subtitle') }}</p>
          </div>
        </div>

        <form class="flex flex-col gap-4" @submit.prevent="submitWaitlist">
          <label class="flex flex-col gap-2">
            <span class="text-sm font-medium text-foreground">{{ t('waitlist.form.email') }}</span>
            <input
              v-model="email"
              type="email"
              autocomplete="email"
              required
              :disabled="isSubmitting || status === 'success'"
              :placeholder="t('waitlist.form.placeholder')"
              class="h-12 rounded-xl border border-border bg-background px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/65 focus:border-foreground focus:ring-2 focus:ring-ring/20 disabled:cursor-not-allowed disabled:opacity-60"
            />
          </label>

          <button
            type="submit"
            :disabled="!canSubmit || status === 'success'"
            class="btn-pill btn-pill-primary inline-flex h-12 items-center justify-center gap-2 px-6 text-sm font-medium disabled:pointer-events-none disabled:opacity-55 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          >
            <span>{{ status === 'success' ? t('waitlist.form.joined') : isSubmitting ? t('waitlist.form.submitting') : t('waitlist.form.submit') }}</span>
            <ArrowRight v-if="status !== 'success'" class="h-4 w-4" />
            <Check v-else class="h-4 w-4" />
          </button>

          <p v-if="status === 'success'" class="rounded-xl border border-border bg-muted px-4 py-3 text-sm leading-relaxed text-foreground">
            {{ t('waitlist.form.success') }}
          </p>
          <p v-else-if="status === 'error'" class="rounded-xl border border-destructive/35 bg-destructive/10 px-4 py-3 text-sm leading-relaxed text-foreground">
            {{ errorMessage }}
          </p>

          <p class="text-xs leading-relaxed text-muted-foreground">
            {{ t('waitlist.form.disclaimer') }}
          </p>
        </form>
      </section>
    </section>
  </main>
</template>
