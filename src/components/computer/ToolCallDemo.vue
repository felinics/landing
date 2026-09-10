<script setup lang="ts">
import { ChevronRight } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
withDefaults(
  defineProps<{
    kind: "build" | "browser";
    grouped?: boolean;
    active?: boolean;
    step?: string;
  }>(),
  { grouped: false, active: false, step: "" },
);
const { t } = useI18n();
</script>
<template>
  <!-- Mirrors message-item → ToolCallGroup: a lone row, then a collapsed process with a live now-line. -->
  <div class="memoh-process">
    <div v-if="!grouped" class="memoh-process-header">
      <template v-if="kind === 'build'"
        ><span>index.html</span
        ><span class="memoh-diff-count">+48</span></template
      >
      <template v-else
        ><span>{{ t("computerDemo.toolOpenPage") }}</span
        ><span>google.com</span></template
      >
      <ChevronRight />
    </div>
    <template v-else>
      <div class="memoh-process-header">
        <span
          class="memoh-process-verb"
          :class="{ 'memoh-process-running': active }"
          >{{
            t(
              `computerDemo.${kind === "build" ? (active ? "toolEditing" : "toolEdited") : active ? "toolBrowsing" : "toolBrowsed"}`,
            )
          }}</span
        >
        <span>{{
          kind === "build" ? t("computerDemo.toolBuildCounts") : "google.com"
        }}</span>
        <span v-if="kind === 'build' && !active" class="memoh-diff-count"
          >+48</span
        ><ChevronRight />
      </div>
      <div v-if="active" class="memoh-process-current">
        <Transition name="tool-step"
          ><span :key="step">{{ step }}</span></Transition
        >
      </div>
    </template>
  </div>
</template>
