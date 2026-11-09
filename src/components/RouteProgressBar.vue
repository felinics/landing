<script setup lang="ts">
import { nextTick, onBeforeUnmount, ref } from 'vue'
import { isNavigationFailure, NavigationFailureType, useRouter } from 'vue-router'

// Every page is a lazy chunk, so on a slow network a nav click changes nothing
// on screen until the chunk arrives. Show a thin top bar while a navigation is
// pending. The delay keeps it from flashing on fast (or cached) navigations.
const SHOW_DELAY_MS = 150
const FADE_MS = 300

const router = useRouter()
const visible = ref(false)
const progress = ref(0)
const finishing = ref(false)
const barEl = ref<HTMLElement>()

let navId = 0
let showTimer: ReturnType<typeof setTimeout> | undefined
let hideTimer: ReturnType<typeof setTimeout> | undefined

function start() {
  const id = ++navId
  clearTimeout(showTimer)
  showTimer = setTimeout(() => {
    if (id !== navId) return
    clearTimeout(hideTimer)
    finishing.value = false
    progress.value = 0
    visible.value = true
    // Commit the 0% state (forced reflow), then creep towards 90% via the long
    // transition. rAF would stall in background tabs, so don't rely on paints.
    void nextTick(() => {
      if (id !== navId || finishing.value) return
      void barEl.value?.offsetWidth
      progress.value = 90
    })
  }, SHOW_DELAY_MS)
}

function finish() {
  clearTimeout(showTimer)
  if (!visible.value) return
  finishing.value = true
  progress.value = 100
  clearTimeout(hideTimer)
  hideTimer = setTimeout(() => {
    visible.value = false
    finishing.value = false
    progress.value = 0
  }, FADE_MS)
}

const removeBefore = router.beforeEach((to, from) => {
  // Hash/query-only changes stay on the same, already-loaded page.
  if (to.path !== from.path) start()
})
const removeAfter = router.afterEach((_to, _from, failure) => {
  // A newer navigation superseded this one; let that one finish the bar.
  if (!isNavigationFailure(failure, NavigationFailureType.cancelled)) finish()
})
const removeError = router.onError(() => finish())

onBeforeUnmount(() => {
  removeBefore()
  removeAfter()
  removeError()
  clearTimeout(showTimer)
  clearTimeout(hideTimer)
})
</script>

<template>
  <div
    class="route-progress"
    :class="{ 'is-visible': visible, 'is-finishing': finishing }"
    aria-hidden="true"
  >
    <div ref="barEl" class="route-progress-bar" :style="{ transform: `scaleX(${progress / 100})` }" />
  </div>
</template>

<style scoped>
.route-progress {
  position: fixed;
  inset: 0 0 auto;
  z-index: 100;
  height: 2px;
  pointer-events: none;
  opacity: 0;
  transition: opacity 300ms ease;
}
.route-progress.is-visible {
  opacity: 1;
}
.route-progress.is-visible.is-finishing {
  /* Hold full opacity while the bar runs to 100%, then fade. */
  opacity: 0;
  transition-delay: 150ms;
}
.route-progress-bar {
  height: 100%;
  background: var(--primary);
  box-shadow: 0 0 8px color-mix(in srgb, var(--primary) 70%, transparent);
  transform-origin: left center;
  /* Slow ease-out creep: fast at first, then crawls as it nears 90%. */
  transition: transform 8s cubic-bezier(0.1, 0.6, 0.2, 1);
}
.is-finishing .route-progress-bar {
  transition: transform 150ms ease-out;
}
.route-progress:not(.is-visible) .route-progress-bar {
  transition: none;
}
</style>
