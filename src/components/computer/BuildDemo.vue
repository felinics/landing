<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { Globe, RotateCw, Plus, Search, Circle, Check } from "lucide-vue-next";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import MemohWindow from "./MemohWindow.vue";
import MemohComposer from "./MemohComposer.vue";
import ToolCallDemo from "./ToolCallDemo.vue";
import { useDemoCheckpoints } from "./useDemoCheckpoints";
const { holdAt, arrive, reset } = useDemoCheckpoints([
  { at: 1.4, target: ".memoh-input" },
  { at: 6, target: ".memoh-send" },
  { at: 13.3, target: ".memoh-preview-link" },
]);
const { t } = useI18n();
const typed = (time: number) =>
  t("computerDemo.buildRequest").slice(
    0,
    Math.floor(
      Math.max(0, Math.min(1, (time - 2) / 2.5)) *
        t("computerDemo.buildRequest").length,
    ),
  );
</script>
<template>
  <DemoPlayer
    :delay="3.8"
    :pace="0.84"
    :rest="4.3"
    :duration="22"
    :hold-at="holdAt"
    @reset="reset"
    :still="18"
    :label="t('computerDemo.buildAlt')"
    v-slot="{ time, playing, cycle }"
  >
    <MemohWindow
      :title="t('computerDemo.readingList')"
      :preview="time >= 14 ? 'localhost:5173' : ''"
    >
      <div v-if="time < 14" class="memoh-build-chat">
        <div v-if="time >= 6.5" class="memoh-user-message reveal">
          {{ t("computerDemo.buildRequest") }}
        </div>
        <div v-if="time >= 7.2" class="memoh-assistant-body">
          <ToolCallDemo
            kind="build"
            :grouped="time >= 8.8"
            :active="time < 10.5"
            :step="`${t('computerDemo.toolRun')} npm run dev`"
          />
          <div v-if="time >= 11" class="memoh-assistant-message">
            <p>{{ t("computerDemo.buildReply") }}</p>
            <a
              class="memoh-preview-link"
              href="http://localhost:5173"
              tabindex="-1"
              @click.prevent
              >http://localhost:5173</a
            >
          </div>
        </div>
        <MemohComposer
          :text="time < 6.5 ? typed(time) : ''"
          :focused="time >= 1.6 && time < 6.5"
          :busy="time >= 6.5 && time < 11"
        />
      </div>
      <div v-else class="memoh-browser reveal">
        <div class="memoh-browser-address">
          <Globe /><span>http://localhost:5173</span><span>Go</span><RotateCw />
        </div>
        <div class="reading-page">
          <div class="reading-heading">
            <div>
              <small>{{ t("computerDemo.library") }}</small>
              <h4>{{ t("computerDemo.readingList") }}</h4>
            </div>
            <span><Plus />{{ t("computerDemo.addBook") }}</span>
          </div>
          <div class="reading-search">
            <Search />{{ t("computerDemo.findBook") }}
          </div>
          <div class="reading-tabs">
            <b>{{ t("computerDemo.toRead") }} <span>3</span></b
            ><span>{{ t("computerDemo.finished") }} 1</span>
          </div>
          <div
            v-for="(book, index) in [
              'The Design of Everyday Things',
              'A Philosophy of Software Design',
              'The Creative Act',
            ]"
            :key="book"
            class="reading-book"
          >
            <Circle />
            <div>
              <strong>{{ book }}</strong
              ><small>{{
                ["Don Norman", "John Ousterhout", "Rick Rubin"][index]
              }}</small>
            </div>
          </div>
          <div class="reading-book completed">
            <Check />
            <div><strong>Deep Work</strong><small>Cal Newport</small></div>
          </div>
        </div>
      </div>
    </MemohWindow>
    <DemoCursor
      :key="cycle"
      :playing="playing"
      @arrive="arrive"
      :target="
        time < 4.9
          ? '.memoh-input'
          : time < 11.8
            ? '.memoh-send'
            : time < 14
              ? '.memoh-preview-link'
              : ''
      "
      :x="12"
      :y="80"
      :click="
        (time >= 1.6 && time < 1.82) ||
        (time >= 6.2 && time < 6.42) ||
        (time >= 13.5 && time < 13.75)
      "
    />
  </DemoPlayer>
</template>
