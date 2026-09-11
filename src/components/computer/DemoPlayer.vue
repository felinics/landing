<script setup lang="ts">
import { computed, onMounted, onBeforeUnmount, ref, watch } from "vue";
import { Pause, Play, RotateCcw } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
const props = withDefaults(
  defineProps<{
    duration: number;
    still: number;
    label: string;
    delay?: number;
    pace?: number;
    rest?: number;
    holdAt?: number;
  }>(),
  { delay: 0, pace: 1, rest: 2, holdAt: Infinity },
);
const emit = defineEmits<{ reset: [] }>();
const { t } = useI18n();
const root = ref<HTMLElement>();
const stage = ref<HTMLElement>();
const scale = ref(0.7);
const canvasWidth = 760;
const canvasHeight = 440;
const elapsed = ref(-props.delay);
const cycle = ref(0);
const paused = ref(false);
const visible = ref(false);
const reduced = ref(false);
const pageVisible = ref(true);
const playing = computed(
  () => visible.value && !paused.value && !reduced.value && pageVisible.value,
);
const time = computed(() =>
  reduced.value
    ? props.still
    : Math.max(0, Math.min(elapsed.value, props.duration - 0.001)),
);
let frame = 0;
let previous = 0;
function tick(now: number) {
  const delta = Math.min(now - previous, 64) / 1000;
  previous = now;
  elapsed.value = Math.min(elapsed.value + delta * props.pace, props.holdAt);
  if (elapsed.value >= props.duration + props.rest) {
    elapsed.value = 0;
    cycle.value++;
    emit("reset");
  }
  frame = requestAnimationFrame(tick);
}
watch(playing, (active) => {
  cancelAnimationFrame(frame);
  if (active) {
    previous = performance.now();
    frame = requestAnimationFrame(tick);
  }
});
const visibilityChanged = () => {
  pageVisible.value = !document.hidden;
};
let observer: IntersectionObserver | undefined;
let media: MediaQueryList | undefined;
let resizeObserver: ResizeObserver | undefined;
const preferenceChanged = () => {
  reduced.value = media?.matches ?? false;
};
function replay() {
  cycle.value++;
  emit("reset");
  elapsed.value = 0;
  paused.value = false;
}
onMounted(() => {
  media = window.matchMedia("(prefers-reduced-motion: reduce)");
  preferenceChanged();
  media.addEventListener("change", preferenceChanged);
  observer = new IntersectionObserver(
    ([entry]) => {
      visible.value = entry?.isIntersecting ?? false;
    },
    { threshold: 0.2 },
  );
  if (root.value) observer.observe(root.value);
  resizeObserver = new ResizeObserver(([entry]) => {
    if (entry)
      scale.value = Math.min(0.7, entry.contentRect.width / canvasWidth);
  });
  if (stage.value) resizeObserver.observe(stage.value);
  visibilityChanged();
  document.addEventListener("visibilitychange", visibilityChanged);
});
onBeforeUnmount(() => {
  cancelAnimationFrame(frame);
  document.removeEventListener("visibilitychange", visibilityChanged);
  observer?.disconnect();
  resizeObserver?.disconnect();
  media?.removeEventListener("change", preferenceChanged);
});
</script>

<template>
  <div
    ref="root"
    class="demo-player"
    :class="{ 'demo-paused': !playing, 'demo-reduced': reduced }"
  >
    <div ref="stage" class="demo-stage" role="img" :aria-label="label">
      <div
        class="demo-viewport"
        :style="{
          width: `${canvasWidth * scale}px`,
          height: `${canvasHeight * scale}px`,
        }"
      >
        <div
          class="demo-scene"
          aria-hidden="true"
          :style="{
            width: `${canvasWidth}px`,
            height: `${canvasHeight}px`,
            transform: `scale(${scale})`,
          }"
        >
          <slot
            :time="time"
            :playing="playing && elapsed >= 0"
            :cycle="cycle"
          />
        </div>
      </div>
    </div>
    <div v-if="!reduced" class="demo-controls">
      <button
        type="button"
        :aria-label="t(paused ? 'computerDemo.play' : 'computerDemo.pause')"
        :title="t(paused ? 'computerDemo.play' : 'computerDemo.pause')"
        @click="paused = !paused"
      >
        <Play v-if="paused" /><Pause v-else />
      </button>
      <button
        type="button"
        :aria-label="t('computerDemo.replay')"
        :title="t('computerDemo.replay')"
        @click="replay"
      >
        <RotateCcw />
      </button>
    </div>
  </div>
</template>
