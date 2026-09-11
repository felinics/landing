<script setup lang="ts">
import {
  PanelLeftOpen,
  ChevronLeft,
  ChevronRight,
  Plus,
  X,
} from "lucide-vue-next";
import MacTrafficLights from "./MacTrafficLights.vue";
withDefaults(
  defineProps<{ title: string; preview?: string; split?: boolean }>(),
  { preview: "", split: false },
);
// The application tab has an 8px crown and matching outward feet, not a rounded rectangle.
const tabOutline =
  "M -8 35 L -7.5 34.5 A 7.5 7.5 0 0 0 .5 27 L .5 8 A 7.5 7.5 0 0 1 8 .5 L 167 .5 A 7.5 7.5 0 0 1 174.5 8 L 174.5 27 A 7.5 7.5 0 0 0 182.5 34.5 L 183 35";
</script>
<template>
  <div class="memoh-window">
    <div class="memoh-tabbar" :class="{ 'memoh-tabbar-split': split }">
      <div class="memoh-tab-group">
        <MacTrafficLights />
        <div class="memoh-navigation">
          <PanelLeftOpen /><ChevronLeft /><ChevronRight />
        </div>
        <div class="memoh-tab" :class="{ active: !preview }">
          <svg
            v-if="!preview"
            class="memoh-tab-shape"
            viewBox="-8 0 191 35"
            preserveAspectRatio="none"
          >
            <path :d="`${tabOutline} Z`" fill="#191919" />
            <path
              :d="tabOutline"
              fill="none"
              stroke="#383838"
              stroke-width="1"
            />
          </svg>
          <span>{{ title }}</span
          ><X class="memoh-tab-close" />
        </div>
        <div v-if="preview" class="memoh-tab active reveal">
          <svg
            class="memoh-tab-shape"
            viewBox="-8 0 191 35"
            preserveAspectRatio="none"
          >
            <path :d="`${tabOutline} Z`" fill="#191919" />
            <path
              :d="tabOutline"
              fill="none"
              stroke="#383838"
              stroke-width="1"
            />
          </svg>
          <span>{{ preview }}</span
          ><X class="memoh-tab-close" />
        </div>
        <Plus class="memoh-new-tab" />
      </div>
      <div v-if="split" class="memoh-tab-group memoh-desktop-tab-group">
        <div class="memoh-tab active">
          <svg
            class="memoh-tab-shape"
            viewBox="-8 0 191 35"
            preserveAspectRatio="none"
          >
            <path :d="`${tabOutline} Z`" fill="#191919" />
            <path
              :d="tabOutline"
              fill="none"
              stroke="#383838"
              stroke-width="1"
            />
          </svg>
          <span>Desktop</span><X class="memoh-tab-close" />
        </div>
        <Plus class="memoh-new-tab" />
      </div>
    </div>
    <slot />
  </div>
</template>
