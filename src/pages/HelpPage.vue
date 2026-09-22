<script setup lang="ts">
import { computed, ref } from 'vue'
import { RouterLink } from 'vue-router'
import { useSeoMeta } from '@unhead/vue'
import { useI18n } from 'vue-i18n'
import { ArrowRight, LifeBuoy, Search, X } from 'lucide-vue-next'
import { getHelpCollections, getHelpUi, searchHelpArticles } from '../lib/help'
import { helpIcons } from '../components/help/helpIcons'
import HelpContactCard from '../components/help/HelpContactCard.vue'

const { locale } = useI18n()
const ui = computed(() => getHelpUi(locale.value))
const collections = computed(() => getHelpCollections(locale.value))

const query = ref('')
const trimmedQuery = computed(() => query.value.trim())
const isSearching = computed(() => trimmedQuery.value.length > 0)
const results = computed(() => searchHelpArticles(trimmedQuery.value, locale.value))

useSeoMeta({
  title: () => ui.value('seoTitle'),
  description: () => ui.value('seoDescription'),
  ogTitle: () => ui.value('seoTitle'),
  ogDescription: () => ui.value('seoDescription'),
  ogUrl: 'https://memoh.ai/help',
})
</script>

<template>
  <main class="help-static w-full max-w-[1080px] min-h-[calc(100vh-3.5rem)] mx-auto px-4 md:px-8 pt-[112px] md:pt-[148px] pb-[120px] relative z-10">
    <header class="mx-auto flex max-w-[640px] flex-col items-center gap-5 text-center">
      <div class="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium text-muted-foreground">
        <LifeBuoy class="w-3.5 h-3.5" />
        {{ ui('badge') }}
      </div>
      <h1 class="text-4xl md:text-5xl font-semibold tracking-tight text-foreground leading-[1.1]">
        {{ ui('title') }}
      </h1>
      <p class="text-base md:text-lg text-muted-foreground leading-relaxed">
        {{ ui('subtitle') }}
      </p>

      <div class="relative mt-2 w-full">
        <Search class="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          v-model="query"
          type="search"
          :placeholder="ui('searchPlaceholder')"
          :aria-label="ui('searchPlaceholder')"
          class="h-12 w-full rounded-xl border border-border bg-background pl-11 pr-11 text-sm md:text-base text-foreground placeholder:text-muted-foreground shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        />
        <button
          v-if="isSearching"
          type="button"
          :aria-label="ui('clearSearch')"
          class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-muted-foreground hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          @click="query = ''"
        >
          <X class="h-4 w-4" />
        </button>
      </div>
    </header>

    <!-- Search results: link into the collection page with the answer expanded -->
    <section v-if="isSearching" class="mx-auto mt-10 flex max-w-[760px] flex-col gap-4">
      <p class="text-sm text-muted-foreground">
        {{ ui('searchResults', { n: results.length, q: trimmedQuery }) }}
      </p>

      <div v-if="results.length" class="rounded-xl border border-border bg-background divide-y divide-border overflow-hidden">
        <RouterLink
          v-for="result in results"
          :key="`${result.collectionId}/${result.id}`"
          :to="`/help/${result.collectionId}#${result.id}`"
          class="flex items-center gap-4 px-5 py-4 hover:bg-muted/50 focus-visible:outline-none focus-visible:bg-muted/50"
        >
          <div class="flex min-w-0 flex-1 flex-col gap-1">
            <span class="text-xs text-muted-foreground">{{ result.collectionTitle }}</span>
            <h2 class="text-sm md:text-base font-medium text-foreground leading-snug">{{ result.question }}</h2>
            <p class="truncate text-sm text-muted-foreground">{{ result.snippet }}</p>
          </div>
          <ArrowRight class="h-4 w-4 shrink-0 text-muted-foreground" />
        </RouterLink>
      </div>

      <div v-else class="flex flex-col items-center gap-2 rounded-xl border border-border bg-background px-6 py-14 text-center">
        <h2 class="text-base font-medium text-foreground">{{ ui('searchEmptyTitle') }}</h2>
        <p class="text-sm text-muted-foreground">{{ ui('searchEmptyDesc') }}</p>
      </div>
    </section>

    <!-- Collections grid -->
    <section v-else class="mt-14 flex flex-col gap-6">
      <h2 class="sr-only">{{ ui('collectionsTitle') }}</h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="collection in collections"
          :key="collection.id"
          :to="`/help/${collection.id}`"
          class="flex flex-col gap-4 rounded-xl border border-border bg-background p-6 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div class="flex h-10 w-10 items-center justify-center rounded-lg border border-border bg-muted text-foreground">
            <component :is="helpIcons[collection.icon]" class="h-5 w-5" />
          </div>
          <div class="flex flex-col gap-1.5">
            <h3 class="text-base font-semibold tracking-tight text-foreground leading-snug">{{ collection.title }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ collection.description }}</p>
          </div>
          <span class="mt-auto text-xs text-muted-foreground">{{ ui('articleCount', { n: collection.articleCount }) }}</span>
        </RouterLink>
      </div>
    </section>

    <div class="mx-auto mt-14 max-w-[760px]">
      <HelpContactCard />
    </div>
  </main>
</template>

<style scoped>
/* The help center is deliberately animation-free — override the global
   `* { transition: colors 300ms }` from style.css for everything inside. */
.help-static,
.help-static :deep(*) {
  transition: none !important;
  animation: none !important;
}
</style>
