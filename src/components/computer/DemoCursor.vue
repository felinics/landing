<script setup lang="ts">
import { nextTick, onBeforeUnmount, onMounted, ref, watch } from "vue";
const props = withDefaults(
  defineProps<{
    x: number;
    y: number;
    click?: boolean;
    target?: string;
    playing?: boolean;
  }>(),
  { playing: true },
);
const emit = defineEmits<{ arrive: [target: string] }>();
const root = ref<HTMLElement>();
const moving = ref(false);
let movement: Animation | undefined;
let initialized = false;
let targetRevision = 0;

async function locateTarget() {
  const revision = ++targetRevision;
  await nextTick();
  if (revision !== targetRevision) return;
  const cursor = root.value;
  const scene = cursor?.parentElement;
  if (!cursor || !scene) return;
  const target = props.target ? scene.querySelector(props.target) : null;
  // A loading step may temporarily remove its target. Keep the pointer at rest.
  if (!target && initialized) return;
  const frame = scene.getBoundingClientRect();
  if (!frame.width || !frame.height) return;
  let bounds = target?.getBoundingClientRect();
  if (target?.matches("a, [data-cursor-text]")) {
    const range = document.createRange();
    range.selectNodeContents(target);
    const textBounds = range.getBoundingClientRect();
    if (textBounds.width && textBounds.height) bounds = textBounds;
  }
  const end = bounds
    ? {
        x:
          ((bounds.left + bounds.width * 0.6 - frame.left) / frame.width) *
          scene.offsetWidth,
        y:
          ((bounds.top + bounds.height * 0.6 - frame.top) / frame.height) *
          scene.offsetHeight,
      }
    : {
        x: (props.x / 100) * scene.offsetWidth,
        y: (props.y / 100) * scene.offsetHeight,
      };
  if (!initialized) {
    cursor.style.transform = `translate3d(${(props.x / 100) * scene.offsetWidth}px, ${(props.y / 100) * scene.offsetHeight}px, 0)`;
    initialized = true;
  }
  const current = new DOMMatrixReadOnly(getComputedStyle(cursor).transform);
  const start = { x: current.m41, y: current.m42 };
  const dx = end.x - start.x;
  const dy = end.y - start.y;
  const distance = Math.hypot(dx, dy);
  if (distance < 1) {
    if (props.target && target) emit("arrive", props.target);
    return;
  }
  // Retarget from the currently painted position, including a partially completed move.
  cursor.style.transform = `translate3d(${start.x}px, ${start.y}px, 0)`;
  movement?.cancel();
  const bend = Math.min(34, distance * 0.13);
  const control = {
    x: (start.x + end.x) / 2 - (dy / distance) * bend,
    y: (start.y + end.y) / 2 + (dx / distance) * bend,
  };
  const frames = Array.from({ length: 25 }, (_, index) => {
    const t = index / 24;
    const s = 1 - t;
    const x = s * s * start.x + 2 * s * t * control.x + t * t * end.x;
    const y = s * s * start.y + 2 * s * t * control.y + t * t * end.y;
    return { transform: `translate3d(${x}px, ${y}px, 0)`, offset: t };
  });
  const animation = cursor.animate(frames, {
    duration: Math.min(1350, 650 + distance * 1.4),
    easing: "cubic-bezier(0.42, 0, 0.18, 1)",
    fill: "forwards",
  });
  movement = animation;
  moving.value = true;
  if (!props.playing) animation.pause();
  animation.onfinish = () => {
    cursor.style.transform = `translate3d(${end.x}px, ${end.y}px, 0)`;
    animation.cancel();
    if (movement === animation) {
      movement = undefined;
      moving.value = false;
      if (revision === targetRevision && props.target && target)
        emit("arrive", props.target);
    }
  };
}
watch(() => [props.target, props.x, props.y], locateTarget);
watch(
  () => props.playing,
  (playing) => {
    if (playing) movement?.play();
    else movement?.pause();
  },
);
onMounted(locateTarget);
onBeforeUnmount(() => {
  targetRevision++;
  movement?.cancel();
});
</script>
<template>
  <div ref="root" class="demo-cursor" :class="{ clicking: click && !moving }">
    <svg viewBox="0 0 24 28" fill="none">
      <path
        d="M3 2L21 15L12.5 16.5L8.5 25L3 2Z"
        fill="#28272d"
        stroke="white"
        stroke-width="2"
        stroke-linejoin="round"
      />
    </svg>
  </div>
</template>
