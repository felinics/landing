<script setup lang="ts">
import { Check, Paperclip } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import MemohComposer from "./MemohComposer.vue";
import MemohWindow from "./MemohWindow.vue";
const { t } = useI18n();
const agents = [
  { name: "Memoh", icon: "/logo.png", model: "Default (GPT-5.6-Sol)" },
  {
    name: "Codex",
    icon: "/brands/codex-blob.svg",
    model: "Default (GPT-5.6-Sol)",
  },
  {
    name: "Claude Code",
    icon: "/brands/claude-code-color.svg",
    model: "Default (GPT-5.6-Sol)",
  },
];
const selected = (time: number) => Math.floor((time + 1.2) / 4) % 3;
const next = (time: number) => (Math.floor(time / 4) + 1) % 3;
const open = (time: number) => time % 4 > 0.8 && time % 4 < 3.3;
</script>
<template>
  <DemoPlayer
    :delay="0.4"
    :pace="0.9"
    :rest="2.6"
    :duration="12"
    :still="5.5"
    :label="t('computerDemo.agentAlt')"
    v-slot="{ time, playing }"
  >
    <MemohWindow :title="t('computerDemo.newSession')">
      <div class="memoh-welcome">
        <h4>{{ t("computerDemo.welcome") }}</h4>
        <MemohComposer :model="agents[selected(time)]!.model">
          <Transition name="menu">
            <div v-if="open(time)" class="memoh-agent-menu">
              <small>Agent</small>
              <div
                v-for="(agent, index) in agents"
                :key="agent.name"
                :data-agent="index"
                :class="{ hovered: index === next(time) }"
              >
                <img :src="agent.icon" alt="" /><span>{{ agent.name }}</span
                ><Check v-if="index === selected(time)" />
              </div>
              <div class="memoh-attach">
                <Paperclip />{{ t("computerDemo.attachFiles") }}
              </div>
            </div>
          </Transition>
        </MemohComposer>
      </div>
    </MemohWindow>
    <DemoCursor
      :playing="playing"
      :target="open(time) ? `[data-agent='${next(time)}']` : '.memoh-add'"
      :x="open(time) ? 28 : 9.5"
      :y="open(time) ? 38 + next(time) * 8.8 : 80.5"
      :click="time % 4 > 2.5 && time % 4 < 2.9"
    />
  </DemoPlayer>
</template>
