<script setup lang="ts">
// Generated guide cover: brand-light panel with the mascot's eyes on the left,
// deep brand panel with the guide's short title on the right.
defineProps<{ title: string }>()
</script>

<template>
  <div class="guide-cover">
    <div class="guide-cover-eyes">
      <!-- Eye paths are the mascot's (MemohMascot.vue), cropped to the eye area. -->
      <svg viewBox="380 600 760 300" aria-hidden="true">
        <path
          d="M520 665 C556 665 586 696 580 736 L571 790 C561 840 517 873 471 873 C435 873 405 844 412 808 L420 756 C430 705 472 665 520 665 Z"
        />
        <path
          d="M1045 624 C1081 624 1111 655 1105 695 L1096 749 C1086 799 1042 832 996 832 C960 832 930 803 937 767 L945 715 C955 664 997 624 1045 624 Z"
        />
      </svg>
    </div>
    <div class="guide-cover-title">
      <span>{{ title }}</span>
    </div>
  </div>
</template>

<style scoped>
.guide-cover {
  container-type: inline-size;
  display: grid;
  grid-template-columns: 42% 1fr;
  aspect-ratio: 19 / 10;
  width: 100%;
  overflow: hidden;
  border-radius: 14px;
  border: 1px solid var(--border);
}

.guide-cover-eyes {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #bb6bff;
}
.guide-cover-eyes svg {
  width: 68%;
  fill: #f6f1ff;
}

.guide-cover-title {
  display: flex;
  align-items: center;
  padding: 0 7cqw;
  background: #2e1a6b;
  color: #f3eeff;
  font-size: 7.2cqw;
  font-weight: 400;
  letter-spacing: -0.03em;
  line-height: 1.1;
}
</style>
