<script setup lang="ts">
import {
  Plus,
  ChevronDown,
  ArrowUp,
  AudioLines,
  Square,
} from "lucide-vue-next";
import { useI18n } from "vue-i18n";
withDefaults(
  defineProps<{
    text?: string;
    model?: string;
    sending?: boolean;
    focused?: boolean;
    busy?: boolean;
  }>(),
  { text: "", model: "Default" },
);
const { t } = useI18n();
</script>
<template>
  <div class="memoh-composer">
    <div class="memoh-input" :class="{ filled: text, focused }">
      <span v-if="focused" class="memoh-typing-text"
        >{{ text }}<i class="memoh-caret"
      /></span>
      <span v-else>{{ text || t("computerDemo.askAnything") }}</span>
    </div>
    <div class="memoh-composer-actions">
      <Plus class="memoh-add" />
      <div class="memoh-model">{{ model }}<ChevronDown /></div>
      <span class="memoh-send"
        ><Square v-if="busy" class="memoh-stop" /><ArrowUp
          v-else-if="text || sending" /><AudioLines v-else
      /></span>
    </div>
    <slot />
  </div>
</template>
