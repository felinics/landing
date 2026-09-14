<script setup lang="ts">
import { Plus, ChevronDown, ArrowUp, Square, Monitor, Cloud, Folder, ShieldCheck } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
withDefaults(defineProps<{
  text?: string; model?: string; agent?: string; agentIcon?: string; folder?: string; computer?: string;
  sending?: boolean; focused?: boolean; busy?: boolean; selectableAgent?: boolean;
}>(), { text: "", model: "Default", agent: "Memoh", folder: "Daily Planner", computer: "Cloud Computer", agentIcon: "/demo/memoh.svg" });
const { t } = useI18n();
</script>
<template>
  <div class="memoh-composer-dock">
    <div class="memoh-composer">
      <div class="memoh-input" :class="{ filled: text, focused }">
        <span v-if="focused" class="memoh-typing-text">{{ text }}<i class="memoh-caret" /></span>
        <span v-else>{{ text || t("computerDemo.askAnything") }}</span>
      </div>
      <div class="memoh-composer-actions">
        <Plus class="memoh-add" />
        <div class="memoh-model">{{ model }}<ChevronDown /></div>
        <span class="memoh-send" :class="{ inactive: !text && !sending && !busy }">
          <Square v-if="busy" class="memoh-stop" /><ArrowUp v-else />
        </span>
      </div>
    </div>
    <div class="memoh-composer-context">
      <span class="memoh-context-item"><Cloud v-if="computer === 'Cloud Computer'" /><Monitor v-else /><span>{{ computer }}</span></span>
      <span class="memoh-context-item"><Folder /><span>{{ folder }}</span></span>
      <span class="memoh-agent-picker memoh-context-item">
        <img :src="agentIcon" alt="" /><span>{{ agent }}</span><ChevronDown v-if="selectableAgent" />
        <slot />
      </span>
      <span v-if="agent !== 'Memoh'" class="memoh-context-item"><ShieldCheck /><span>{{ t('computerDemo.defaultPermission') }}</span></span>
      <span class="memoh-context-ring" />
    </div>
  </div>
</template>
