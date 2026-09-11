<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { useTa } from "../../composables/useTa";
import AgentDemo from "./AgentDemo.vue";
import DesktopDemo from "./DesktopDemo.vue";
import PackagesDemo from "./PackagesDemo.vue";
import BuildDemo from "./BuildDemo.vue";
import "./computer.css";
const { t } = useI18n();
const { th } = useTa();
const scenes = [AgentDemo, DesktopDemo, PackagesDemo, BuildDemo];
</script>
<template>
  <section class="computer-section" aria-labelledby="computer-title">
    <header class="computer-heading">
      <h2 id="computer-title" v-html="th('s1.title')" />
      <p v-html="th('s1.subtitle')" />
    </header>
    <div class="computer-grid">
      <article
        v-for="(scene, index) in scenes"
        :key="index"
        class="computer-feature"
      >
        <div class="computer-feature-copy">
          <h3>{{ t(`s1.c${index + 1}.title`) }}</h3>
          <p>{{ t(`s1.c${index + 1}.desc`) }}</p>
        </div>
        <component :is="scene" />
      </article>
    </div>
  </section>
</template>
