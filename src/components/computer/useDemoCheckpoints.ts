import { computed, ref } from "vue";

// Scripted clicks wait for the pointer's arrival; frame rate and pause/resume cannot skip them.
export function useDemoCheckpoints(
  checkpoints: { at: number; target: string }[],
) {
  const reached = ref(new Set<string>());
  const holdAt = computed(
    () =>
      checkpoints.find((point) => !reached.value.has(point.target))?.at ??
      Infinity,
  );
  const arrive = (target: string) => {
    reached.value.add(target);
  };
  const reset = () => {
    reached.value = new Set();
  };
  return { holdAt, arrive, reset };
}
