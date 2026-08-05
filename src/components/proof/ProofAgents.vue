<script setup lang="ts">
// S1-4「谁住在电脑里」:倾斜三卡扇形构图(参考稿样式),微缩进 proof 卡竖向视觉位。
// 布局按参考稿比例换算为 cqw(相对舞台宽度),随卡位整体缩放。
// 迷你卡只保留 图标+名字:类目/描述在小尺寸下不可读,文字信息由卡片头部 title/desc 承担。
const sideCards = [
  { name: 'Claude', icon: '/brands/claude-code-color.svg', side: 'left' as const },
  { name: 'Codex', icon: '/brands/codex-blob.svg', side: 'right' as const },
]
</script>

<template>
  <div class="fan-stage">
    <!-- 左右白卡:严格对称,旋转 ±8deg,位于中卡后方 -->
    <div
      v-for="card in sideCards"
      :key="card.name"
      class="mini-card mini-side"
      :class="`mini-${card.side}`"
    >
      <div class="mini-visual">
        <img :src="card.icon" :alt="card.name" />
      </div>
      <p class="mini-name">{{ card.name }}</p>
    </div>

    <!-- 中央黑卡:自家 agent,位置更高、层级最高 -->
    <div class="mini-card mini-center">
      <div class="mini-visual mini-center-visual">
        <img src="/logo.png" alt="Memoh" class="mini-mascot" />
      </div>
      <p class="mini-name mini-center-name">Memoh</p>
    </div>
  </div>
</template>

<style scoped>
.fan-stage {
  container-type: inline-size;
  position: relative;
  width: 100%;
  height: 100%;
  overflow: hidden;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: #0b0b0e;
  font-family: Inter, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
}

.mini-card {
  position: absolute;
  display: flex;
  flex-direction: column;
  gap: 2cqw;
  padding: 2.5cqw;
  border-radius: 2cqw;
}

/* 左右白卡 */
.mini-side {
  top: 44cqw;
  z-index: 1;
  width: 32.2cqw;
  height: 45.5cqw;
  background: #ffffff;
  border: 1px solid #e7e7e7;
  box-shadow:
    0 22px 34px rgba(20, 24, 30, 0.25),
    0 4px 8px rgba(20, 24, 30, 0.12);
}
.mini-left {
  left: 8cqw;
  transform: rotate(-8deg);
}
.mini-right {
  left: 59.8cqw;
  transform: rotate(8deg);
}

.mini-visual {
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 1.5cqw;
  background: #f0f0ef;
}
.mini-visual img {
  width: 42%;
  height: auto;
}
.mini-name {
  font-size: 3.4cqw;
  line-height: 1.2;
  font-weight: 650;
  letter-spacing: -0.02em;
  color: #111418;
}

/* 中央黑卡:left = 50 - 宽/2,严格居中(与参考稿中卡位于构图轴线一致) */
.mini-center {
  left: 32.75cqw;
  top: 35.8cqw;
  z-index: 3;
  width: 34.5cqw;
  height: 49cqw;
  background: #262626;
  border: 1px solid rgba(255, 255, 255, 0.08);
  box-shadow:
    0 18px 32px rgba(0, 0, 0, 0.5),
    0 3px 6px rgba(0, 0, 0, 0.3);
}
.mini-center-visual {
  background: #1c1c1c;
}
.mini-mascot {
  width: 52% !important;
}
.mini-center-name {
  color: #f5f5f5;
}
</style>
