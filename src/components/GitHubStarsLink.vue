<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { Github, Star } from 'lucide-vue-next'

const props = defineProps<{
  overlay?: boolean
}>()

const repoUrl = 'https://github.com/felinics/Memoh'
const repoApiUrl = 'https://api.github.com/repos/felinics/Memoh'
const cacheKey = 'memoh-github-stars'
const cacheTtlMs = 10 * 60 * 1000

const stars = ref<number | undefined>()

const iconBtnClass = computed(() =>
  props.overlay
    ? 'text-white/85 hover:text-white icon-ghost--overlay'
    : 'text-muted-foreground hover:text-foreground',
)

const formattedStars = computed(() => {
  if (stars.value === undefined) return undefined

  return new Intl.NumberFormat('en', {
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(stars.value)
})

type RepoResponse = {
  stargazers_count?: number
}

const readCachedStars = () => {
  const raw = window.sessionStorage.getItem(cacheKey)
  if (!raw) return undefined

  try {
    const cached = JSON.parse(raw) as { value?: number; expiresAt?: number }
    if (typeof cached.value !== 'number' || typeof cached.expiresAt !== 'number') return undefined
    if (cached.expiresAt <= Date.now()) return undefined
    return cached.value
  } catch {
    return undefined
  }
}

const writeCachedStars = (value: number) => {
  window.sessionStorage.setItem(cacheKey, JSON.stringify({
    value,
    expiresAt: Date.now() + cacheTtlMs,
  }))
}

const fetchStars = async () => {
  const cached = readCachedStars()
  if (cached !== undefined) {
    stars.value = cached
    return
  }

  try {
    const response = await fetch(repoApiUrl, {
      headers: {
        Accept: 'application/vnd.github+json',
      },
    })
    if (!response.ok) return

    const data = await response.json() as RepoResponse
    if (typeof data.stargazers_count !== 'number') return

    stars.value = data.stargazers_count
    writeCachedStars(data.stargazers_count)
  } catch {
    stars.value = undefined
  }
}

onMounted(() => {
  void fetchStars()
})
</script>

<template>
  <a
    :href="repoUrl"
    target="_blank"
    rel="noopener noreferrer"
    aria-label="GitHub"
    class="github-stars-link icon-ghost inline-flex h-9 min-h-[36px] items-center justify-center gap-1.5 rounded-md bg-transparent px-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-none"
    :class="iconBtnClass"
  >
    <Github class="w-4 h-4 shrink-0" />
    <span v-if="formattedStars" class="inline-flex items-center gap-1 text-xs font-medium tabular-nums leading-none">
      {{ formattedStars }}
      <Star class="w-3 h-3 shrink-0" />
    </span>
  </a>
</template>

<style scoped>
.github-stars-link {
  position: relative;
  isolation: isolate;
  min-width: 36px;
}

.icon-ghost::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: transparent;
  transition:
    scale 0.255s linear(0, .3505, .7432, .9336, .9951, 1.0062, 1.0045, 1.0019, 1.0005, 1),
    background-color 0.12s ease-out;
}

.icon-ghost:hover::before {
  background-color: var(--btn-ghost-hover);
}

.icon-ghost--overlay:hover::before {
  background-color: oklch(1 0 0 / 0.12);
}

.icon-ghost:active::before {
  scale: 0.974;
}
</style>
