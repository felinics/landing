<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  Search,
  Blocks,
  MessageCircle,
  Files,
  Calendar,
  Download,
  ArrowLeft,
  Github,
  MoreHorizontal,
  X,
  Check,
  LoaderCircle,
} from "lucide-vue-next";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import PackageTile from "./PackageTile.vue";
import MacTrafficLights from "./MacTrafficLights.vue";
import MemohComposer from "./MemohComposer.vue";
import { useDemoCheckpoints } from "./useDemoCheckpoints";
const { holdAt, arrive, reset } = useDemoCheckpoints([
  { at: 2.6, target: '.package-sidebar-install' },
  { at: 7.6, target: '.package-modal-actions .primary' },
  { at: 18.6, target: '.package-dependency .ui-button' },
]);
const { t } = useI18n();
</script>
<template>
  <DemoPlayer
    :delay="1.1"
    :pace="0.88"
    :rest="2.1"
    :duration="22"
    :hold-at="holdAt"
    @reset="reset"
    :still="14"
    :label="t('computerDemo.packagesAlt')"
    v-slot="{ time, playing }"
  >
    <div class="package-app">
      <div class="package-titlebar"><MacTrafficLights /></div>
      <div v-if="time < 12" class="package-workbench">
        <aside class="package-sidebar">
          <div class="package-sidebar-nav"><MessageCircle /><Files /><Calendar /><span><Blocks />Supermarket</span></div>
          <div class="package-search"><Search />{{ t('computerDemo.searchPackages') }}</div>
          <small>{{ t('computerDemo.installed') }}</small>
          <div v-for="app in [{name:'Claude Code',icon:'/brands/claude-code-color.svg'},{name:'Codex',icon:'/brands/codex-blob.svg'},{name:'Node.js',icon:'/demo/node.svg'}]" :key="app.name" class="package-sidebar-row"><i class="package-sidebar-icon"><img :src="app.icon" alt="" /></i><span>{{ app.name }}<em>Memoh</em></span></div>
          <small>Supermarket</small>
          <div class="package-sidebar-row"><i class="package-sidebar-icon"><img src="/demo/uv.svg" alt="" /></i><span>uv<small>{{ t('computerDemo.uvDescription') }}</small><em>Memoh <span class="package-sidebar-install"><Download /></span></em></span></div>
          <div class="package-sidebar-account">A <span>Alex Chen</span></div>
        </aside>
        <div class="package-chat-welcome"><h4>{{ t('computerDemo.welcome') }}</h4><MemohComposer folder="Design Studio" computer="Alex's Mac Mini" model="DeepSeek V4.1 Flash" /></div>
      </div>
      <div v-else-if="time < 16" class="package-page reveal">
        <div class="package-heading">
          <h4>{{ t("computerDemo.apps") }}</h4>
          <span class="ui-button primary">{{
            t("computerDemo.browseSupermarket")
          }}</span>
        </div>
        <div class="package-grid installed-grid">
          <PackageTile
            name="Node.js"
            icon="/demo/node.svg"
            :description="t('computerDemo.nodeDescription')"
            managed
          /><PackageTile
            name="Python"
            icon="/demo/python.svg"
            :description="t('computerDemo.pythonDescription')"
            managed
          /><PackageTile
            name="uv"
            icon="/demo/uv.svg"
            :description="t('computerDemo.uvDescription')"
            managed
          />
        </div>
      </div>
      <div v-else class="package-page reveal">
        <div class="package-back"><ArrowLeft />{{ t("computerDemo.apps") }}</div>
        <div class="package-detail-heading">
          <span class="package-detail-icon"><Github /></span>
          <div><h4>GitHub</h4></div>
          <MoreHorizontal />
        </div>
        <p class="package-description">
          {{ t("computerDemo.githubDescription") }}
        </p>
        <h5>Connectors <span class="muted">1</span></h5>
        <div class="package-dependency">
          <Github /><span
            >GitHub<small>{{
              t(
                time < 19
                  ? "computerDemo.needsConnection"
                  : "computerDemo.connected",
              )
            }}</small></span
          ><span v-if="time < 19" class="ui-button">{{
            t("computerDemo.authorize")
          }}</span
          ><span v-else class="package-switch"><i /></span>
        </div>
      </div>
      <div v-if="time >= 3 && time < 12" class="package-modal-backdrop reveal">
        <div class="package-modal">
          <div class="package-heading">
            <h4>
              {{
                t(
                  time < 8
                    ? "computerDemo.installPackage"
                    : "computerDemo.installingPackage",
                )
              }}
            </h4>
            <X />
          </div>
          <p>uv <span class="muted">v1.0.0</span></p>
          <template v-if="time < 8">
            <div class="package-install-note">
              <strong>{{ t("computerDemo.installWill") }}</strong>
              <p>{{ t("computerDemo.installUv") }}</p>
            </div>
            <div class="package-modal-actions">
              <span class="ui-button">{{ t("computerDemo.cancel") }}</span
              ><span class="ui-button primary">{{
                t("computerDemo.install")
              }}</span>
            </div></template
          >
          <template v-else
            ><div class="package-install-step">
              <Check v-if="time > 10.5" /><LoaderCircle
                v-else
                class="spinning"
              /><span>uv</span
              ><span class="muted">{{
                t(
                  time > 10.5
                    ? "computerDemo.installed"
                    : "computerDemo.installing",
                )
              }}</span>
            </div>
            <div class="package-log">
              $ uv --version<br /><span v-if="time > 10.5">uv 0.8.15</span>
            </div></template
          >
        </div>
      </div>
    </div>
    <DemoCursor
      :playing="playing"
      :target="
        time < 3
          ? '.package-sidebar-install'
          : time < 8
              ? '.package-modal-actions .primary'
              : time < 16
                ? '.package-tile'
                : time < 19
                  ? '.package-dependency .ui-button'
                  : '.package-switch'
      "
      :x="time < 3 ? 27 : time < 5 ? 85 : time < 12 ? 82 : time < 16 ? 27 : 86"
      :y="time < 3 ? 61 : time < 5 ? 25 : time < 12 ? 80 : time < 16 ? 34 : 61"
      :click="
        (time > 2.6 && time < 3) ||
        (time > 7.6 && time < 8) ||
        (time > 18.6 && time < 19)
      "
      @arrive="arrive"
    />
  </DemoPlayer>
</template>
