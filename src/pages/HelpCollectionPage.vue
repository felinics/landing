<script setup lang="ts">
import { computed } from 'vue'
import { RouterLink, useRoute } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowLeft, ChevronRight, FileQuestion } from 'lucide-vue-next'
import { getHelpCollection, getHelpCollections, getHelpUi } from '../lib/help'
import { helpIcons } from '../components/help/helpIcons'
import HelpContactCard from '../components/help/HelpContactCard.vue'

const route = useRoute()
const { locale } = useI18n()

const collectionId = computed(() => {
  const value = route.params.collectionId
  return typeof value === 'string' ? value : ''
})

const ui = computed(() => getHelpUi(locale.value))
const collection = computed(() => getHelpCollection(collectionId.value, locale.value))
const otherCollections = computed(() =>
  getHelpCollections(locale.value).filter((candidate) => candidate.id !== collectionId.value),
)

useSeoMeta({
  title: () =>
    collection.value ? `${collection.value.title} | ${ui.value('seoTitle')}` : ui.value('notFoundTitle'),
  description: () => collection.value?.description ?? ui.value('seoDescription'),
  robots: () => (collection.value ? undefined : 'noindex, follow'),
})
</script>

<template>
  <main class="w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <template v-if="collection">
      <div class="mx-auto flex max-w-[760px] flex-col gap-10">
        <nav class="flex items-center gap-1.5 text-sm text-muted-foreground" :aria-label="ui('breadcrumbRoot')">
          <RouterLink
            to="/help"
            class="transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-sm"
          >
            {{ ui('breadcrumbRoot') }}
          </RouterLink>
          <ChevronRight class="h-3.5 w-3.5 shrink-0" />
          <span class="text-foreground">{{ collection.title }}</span>
        </nav>

        <header class="flex flex-col gap-4">
          <div class="flex h-11 w-11 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <component :is="helpIcons[collection.icon]" class="h-5 w-5" />
          </div>
          <div class="flex flex-col gap-2">
            <h1 class="text-3xl md:text-4xl font-semibold tracking-tight text-foreground leading-tight">
              {{ collection.title }}
            </h1>
            <p class="text-base text-muted-foreground leading-relaxed">{{ collection.description }}</p>
            <p class="text-xs text-muted-foreground">{{ ui('articleCount', { n: collection.articleCount }) }}</p>
          </div>
        </header>

        <section class="rounded-xl border border-border bg-background divide-y divide-border overflow-hidden">
          <RouterLink
            v-for="article in collection.articles"
            :key="article.id"
            :to="`/help/${collection.id}/${article.id}`"
            class="group flex items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50"
          >
            <h2 class="text-sm md:text-base font-medium text-foreground leading-snug">{{ article.question }}</h2>
            <ChevronRight class="h-4 w-4 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
          </RouterLink>
        </section>

        <section class="flex flex-col gap-4">
          <h2 class="text-sm font-medium text-muted-foreground">{{ ui('moreCollections') }}</h2>
          <div class="flex flex-wrap gap-2">
            <RouterLink
              v-for="other in otherCollections"
              :key="other.id"
              :to="`/help/${other.id}`"
              class="inline-flex items-center gap-2 rounded-full border border-border bg-background px-4 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            >
              <component :is="helpIcons[other.icon]" class="h-3.5 w-3.5" />
              {{ other.title }}
            </RouterLink>
          </div>
        </section>

        <HelpContactCard />
      </div>
    </template>

    <section v-else class="mx-auto flex max-w-[640px] flex-col items-center gap-5 py-24 text-center">
      <div class="rounded-xl border border-border bg-muted p-3 text-muted-foreground">
        <FileQuestion class="w-6 h-6" />
      </div>
      <h1 class="text-3xl font-semibold tracking-tight text-foreground">{{ ui('notFoundTitle') }}</h1>
      <p class="text-muted-foreground">{{ ui('notFoundDesc') }}</p>
      <RouterLink
        to="/help"
        class="inline-flex items-center justify-center gap-2 rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-colors hover:bg-foreground/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
      >
        <ArrowLeft :size="16" />
        {{ ui('backToHelp') }}
      </RouterLink>
    </section>
  </main>
</template>
