<script setup lang="ts">
import scenario from "../../../demo-app/mocks/scenario.json";
import { Check } from "lucide-vue-next";
import { useI18n } from "vue-i18n";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import MemohComposer from "./MemohComposer.vue";
import MemohWindow from "./MemohWindow.vue";
import { useDemoCheckpoints } from "./useDemoCheckpoints";
const { holdAt, arrive, reset } = useDemoCheckpoints(Array.from({ length: scenario.agents.length }, (_, step) => [
  { at: step * 4 + 0.7, target: `[data-agent-trigger="${step}"] .memoh-agent-picker` },
  { at: step * 4 + 2.5, target: `[data-agent="${(step + 1) % scenario.agents.length}"]` },
]).flat());
const { t } = useI18n();
const agents = scenario.agents;
const selected = (time: number) => Math.floor((time + 0.7) / 4) % scenario.agents.length;
const next = (time: number) => (Math.floor(time / 4) + 1) % scenario.agents.length;
const open = (time: number) => time % 4 > 0.8 && time % 4 < 3.3;
const cursorTarget = (time: number) => open(time)
  ? `[data-agent="${next(time)}"]`
  : `[data-agent-trigger="${Math.floor(time / 4)}"] .memoh-agent-picker`;
</script>
<template>
  <DemoPlayer
    :delay="0.4"
    :pace="0.9"
    :rest="2.6"
    :duration="agents.length * 4"
    :hold-at="holdAt"
    @reset="reset"
    :still="5.5"
    :label="t('computerDemo.agentAlt')"
    v-slot="{ time, playing }"
  >
    <MemohWindow :title="t('computerDemo.newSession')">
      <div class="memoh-welcome">
        <h4>{{ t("computerDemo.welcome") }}</h4>
        <MemohComposer :model="agents[selected(time)]!.model" :agent="agents[selected(time)]!.name" :agent-icon="agents[selected(time)]!.icon" selectable-agent :data-agent-trigger="Math.floor(time / 4)">
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
            </div>
          </Transition>
        </MemohComposer>
      </div>
    </MemohWindow>
    <DemoCursor
      :playing="playing"
      :target="cursorTarget(time)"
      :x="open(time) ? 28 : 9.5"
      :y="open(time) ? 38 + next(time) * 8.8 : 80.5"
      :click="(time % 4 >= 0.7 && time % 4 < 0.85) || (time % 4 >= 2.5 && time % 4 < 2.9)"
      @arrive="arrive"
    />
  </DemoPlayer>
</template>
