<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  Search,
  ArrowLeft,
  ArrowRight,
  RotateCw,
  Plus,
  X,
  SlidersHorizontal,
} from "lucide-vue-next";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import MemohWindow from "./MemohWindow.vue";
import MemohComposer from "./MemohComposer.vue";
import ToolCallDemo from "./ToolCallDemo.vue";
import { useDemoCheckpoints } from "./useDemoCheckpoints";
const { holdAt, arrive, reset } = useDemoCheckpoints([
  { at: 1.4, target: ".memoh-input" },
  { at: 6, target: ".memoh-send" },
  { at: 10.2, target: ".google-home .google-search" },
]);
const { t } = useI18n();
const typed = (text: string, time: number, start: number, duration: number) =>
  text.slice(
    0,
    Math.floor(
      Math.max(0, Math.min(1, (time - start) / duration)) * text.length,
    ),
  );
</script>
<template>
  <DemoPlayer
    :delay="2.2"
    :pace="0.94"
    :rest="3.4"
    :duration="20"
    :hold-at="holdAt"
    @reset="reset"
    :still="16"
    :label="t('computerDemo.desktopAlt')"
    v-slot="{ time, playing, cycle }"
  >
    <MemohWindow :title="t('computerDemo.newSession')" split>
      <div class="memoh-split">
        <div class="memoh-chat-pane">
          <div v-if="time >= 6.5" class="memoh-user-message reveal">
            {{ t("computerDemo.youtubeRequest") }}
          </div>
          <div v-if="time >= 7" class="memoh-assistant-body">
            <p class="memoh-assistant-message">
              {{ t("computerDemo.youtubeReply") }}
            </p>
            <ToolCallDemo
              v-if="time >= 7.6"
              kind="browser"
              :grouped="time >= 8.8"
              :active="time < 13.5"
              :step="
                time < 10.7
                  ? t('computerDemo.toolFocusSearch')
                  : time < 12.8
                    ? t('computerDemo.toolTypeYoutube')
                    : t('computerDemo.toolPressEnter')
              "
            />
          </div>
          <MemohComposer
            :text="
              time < 6.5
                ? typed(t('computerDemo.youtubeRequest'), time, 2, 2.4)
                : ''
            "
            :focused="time >= 1.6 && time < 6.5"
            :busy="time >= 6.5 && time < 13.5"
          />
        </div>
        <div class="memoh-desktop-pane">
          <div class="linux-panel">
            <span>Applications</span><span>Chromium</span><span>12:30</span>
          </div>
          <div class="linux-desktop">
            <div class="chromium" :class="{ visible: time >= 8 }">
              <div class="chromium-title">
                <span
                  >{{ time >= 13.1 ? "youtube - Google Search" : "Google" }} -
                  Chromium</span
                ><span>− □ ×</span>
              </div>
              <div class="chromium-tabs">
                <span
                  ><i /><em>{{
                    time >= 13.1 ? "youtube - Google Search" : "Google"
                  }}</em
                  ><X /></span
                ><Plus />
              </div>
              <div class="chromium-address">
                <ArrowLeft /><ArrowRight /><RotateCw /><span
                  ><SlidersHorizontal />google.com</span
                >
              </div>
              <div v-if="time < 13.1" class="google-home">
                <strong class="google-word"
                  ><b>G</b><b>o</b><b>o</b><b>g</b><b>l</b><b>e</b></strong
                >
                <div class="google-search" :class="{ focused: time >= 10.4 }">
                  <Search /><span
                    >{{ typed("youtube", time, 10.7, 1.7)
                    }}<i v-if="time >= 10.4" class="memoh-caret"
                  /></span>
                </div>
              </div>
              <div v-else class="google-results reveal">
                <div class="google-search"><Search />youtube</div>
                <div class="google-search-tabs">
                  <b>All</b><span>Videos</span><span>Images</span>
                </div>
                <div class="google-result">
                  <div>
                    <span class="youtube-mark">▶</span
                    ><span>YouTube<small>https://www.youtube.com</small></span>
                  </div>
                  <h5>YouTube</h5>
                  <p>{{ t("computerDemo.youtubeResult") }}</p>
                  <span>Home · Music · Shorts</span>
                </div>
              </div>
            </div>
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
          : time < 8.8
            ? '.memoh-send'
            : time < 13.1
              ? '.google-home .google-search'
              : ''
      "
      :x="12"
      :y="80"
      :click="
        (time >= 1.6 && time < 1.82) ||
        (time >= 6.2 && time < 6.42) ||
        (time >= 10.4 && time < 10.62)
      "
    />
  </DemoPlayer>
</template>
