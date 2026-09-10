<script setup lang="ts">
import { ExternalLink, MoreHorizontal, Github } from "lucide-vue-next";
defineProps<{
  name: string;
  description: string;
  icon?: string;
  managed?: boolean;
}>();
</script>
<template>
  <div class="package-tile">
    <span class="package-icon"
      ><img v-if="icon" :src="icon" alt="" /><Github v-else
    /></span>
    <div class="package-tile-content">
      <div>
        <strong>{{ name }}</strong
        ><ExternalLink />
      </div>
      <p>{{ description }}</p>
    </div>
    <MoreHorizontal v-if="managed" class="package-more" />
  </div>
</template>
