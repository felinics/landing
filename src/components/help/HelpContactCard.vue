<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { Mail, Send } from 'lucide-vue-next'
import { getHelpUi } from '../../lib/help'

const { locale } = useI18n()
const ui = computed(() => getHelpUi(locale.value))
</script>

<template>
  <section class="rounded-xl border border-border bg-muted/35 p-6 md:p-8 flex flex-col md:flex-row md:items-center gap-6 md:gap-8">
    <div class="flex-1 flex flex-col gap-2">
      <h2 class="text-lg md:text-xl font-semibold tracking-tight text-foreground">{{ ui('contactTitle') }}</h2>
      <p class="text-sm md:text-base text-muted-foreground leading-relaxed">{{ ui('contactDesc') }}</p>
    </div>
    <div class="flex flex-wrap items-center gap-3">
      <a
        href="mailto:support@memoh.net"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-full px-5 text-sm font-medium bg-foreground text-background hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Mail :size="15" />
        {{ ui('contactEmail') }}
      </a>
      <a
        href="https://t.me/memohai"
        target="_blank"
        rel="noopener noreferrer"
        class="inline-flex h-10 items-center justify-center gap-2 rounded-full border border-border bg-background px-5 text-sm font-medium text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <Send :size="15" />
        {{ ui('contactTelegram') }}
      </a>
    </div>
  </section>
</template>
