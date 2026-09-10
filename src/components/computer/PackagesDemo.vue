<script setup lang="ts">
import { useI18n } from "vue-i18n";
import {
  Search,
  ArrowLeft,
  Github,
  ChevronDown,
  MoreHorizontal,
  X,
  Check,
  LoaderCircle,
} from "lucide-vue-next";
import DemoPlayer from "./DemoPlayer.vue";
import DemoCursor from "./DemoCursor.vue";
import PackageTile from "./PackageTile.vue";
import MacTrafficLights from "./MacTrafficLights.vue";
const { t } = useI18n();
</script>
<template>
  <DemoPlayer
    :delay="1.1"
    :pace="0.88"
    :rest="2.1"
    :duration="22"
    :still="14"
    :label="t('computerDemo.packagesAlt')"
    v-slot="{ time, playing }"
  >
    <div class="package-app">
      <div class="package-titlebar"><MacTrafficLights /></div>
      <div v-if="time < 3" class="package-page reveal">
        <div class="package-heading">
          <h4>Supermarket</h4>
          <span class="ui-button"><Github />Submit</span>
        </div>
        <div class="package-search">
          <Search />{{ t("computerDemo.searchPackages") }}
        </div>
        <div class="package-filters">
          <span>{{ t("computerDemo.all") }}</span
          ><span>Memoh</span><span>OpenAI</span>
        </div>
        <h5>{{ t("computerDemo.runtimes") }}</h5>
        <div class="package-grid">
          <PackageTile
            name="Node.js"
            icon="/demo/node.svg"
            :description="t('computerDemo.nodeDescription')"
          /><PackageTile
            name="Python"
            icon="/demo/python.svg"
            :description="t('computerDemo.pythonDescription')"
          /><PackageTile
            name="uv"
            icon="/demo/uv.svg"
            :description="t('computerDemo.uvDescription')"
          />
        </div>
      </div>
      <div v-else-if="time < 12" class="package-page reveal">
        <div class="package-back"><ArrowLeft />Supermarket</div>
        <div class="package-detail-heading">
          <img src="/demo/node.svg" alt="" />
          <div>
            <h4>Node.js <small>v1.0.0</small></h4>
            <p>Memoh · Memoh</p>
          </div>
          <span class="ui-button primary">{{
            t("computerDemo.installToBot")
          }}</span>
        </div>
        <p class="package-description">
          {{ t("computerDemo.nodeDescription") }}
        </p>
        <h5>{{ t("computerDemo.dependencies") }}</h5>
        <div class="package-dependency">
          <span
            >Node.js<small>{{ t("computerDemo.nodeDescription") }}</small></span
          ><span class="package-version">24.21.0</span>
        </div>
        <h5>{{ t("computerDemo.information") }}</h5>
        <div class="package-information">
          <span>{{ t("computerDemo.version") }}<b>1.0.0</b></span
          ><span>{{ t("computerDemo.source") }}<b>Memoh</b></span>
        </div>
      </div>
      <div v-else-if="time < 16" class="package-page reveal">
        <div class="package-heading">
          <h4>Packages</h4>
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
        <div class="package-back"><ArrowLeft />Packages</div>
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
      <div v-if="time >= 5 && time < 12" class="package-modal-backdrop reveal">
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
          <p>Node.js <span class="muted">v1.0.0</span></p>
          <template v-if="time < 8"
            ><label>{{ t("computerDemo.selectBot") }}</label>
            <div class="package-select">Package Demo<ChevronDown /></div>
            <div class="package-install-note">
              <strong>{{ t("computerDemo.installWill") }}</strong>
              <p>{{ t("computerDemo.installNode") }}</p>
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
              /><span>Node.js</span
              ><span class="muted">{{
                t(
                  time > 10.5
                    ? "computerDemo.installed"
                    : "computerDemo.installing",
                )
              }}</span>
            </div>
            <div class="package-log">
              $ node --version<br /><span v-if="time > 10.5">v24.21.0</span>
            </div></template
          >
        </div>
      </div>
    </div>
    <DemoCursor
      :playing="playing"
      :target="
        time < 3
          ? '.package-tile'
          : time < 5
            ? '.package-detail-heading .ui-button'
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
        (time > 4.6 && time < 5) ||
        (time > 7.6 && time < 8) ||
        (time > 18.6 && time < 19)
      "
    />
  </DemoPlayer>
</template>
