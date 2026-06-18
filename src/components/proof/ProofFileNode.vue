<script setup lang="ts">
// 搬自产品 components/file-manager/file-tree-node.vue：
//  · 行结构 / 类名 / 缩进列(每层 w-2 占位) / chevron 旋转 / seti 文件图标 一致
//  · 点击目录 → 切换本地 expanded；点击文件 → 设为激活并高亮
//  · 子节点递归挂载（展开才渲染，保持和产品一致的「点开才展开」手感）
// 与产品的差异：去掉了真实 API（listDirectory）、多选、右键菜单——landing 用静态预设树。
import { inject, ref } from 'vue'
import { ChevronRight } from 'lucide-vue-next'
import { resolveFileIcon } from './file-icon'
import { ProofFilesKey, type FileEntry } from './proof-files-context'

const props = defineProps<{ entry: FileEntry, depth: number }>()

const ctx = inject(ProofFilesKey)
if (!ctx) throw new Error('ProofFileNode must be used within ProofFiles')

const expanded = ref(props.entry.expanded ?? false)
const icon = (name: string) => resolveFileIcon(name, true)

function onRowClick() {
  if (props.entry.isDir) expanded.value = !expanded.value
  else ctx!.setActive(props.entry)
}
</script>

<template>
  <div
    class="group/row flex min-h-[1.6875rem] cursor-pointer items-center mx-1 mb-px pl-1 pr-1 rounded-sm text-[0.84375rem] tracking-normal font-[350] select-none [-webkit-font-smoothing:auto]"
    :class="!entry.isDir && ctx!.active.value === entry
      ? 'bg-white/[0.09] text-foreground'
      : 'text-foreground/80 hover:bg-white/[0.06]'"
    @click="onRowClick"
  >
    <span
      v-for="g in depth"
      :key="g"
      class="h-full w-2 shrink-0 self-stretch"
    />

    <span class="flex size-6 shrink-0 items-center justify-center">
      <ChevronRight
        v-if="entry.isDir"
        :stroke-width="1.53"
        class="size-4 text-muted-foreground"
        :class="{ 'rotate-90': expanded }"
      />
      <span
        v-else
        class="proof-seti-icon"
        :style="{ color: icon(entry.name).color }"
      >{{ icon(entry.name).char }}</span>
    </span>
    <span class="ml-1 min-w-0 flex-1 truncate">{{ entry.name }}</span>
  </div>

  <template v-if="entry.isDir && expanded && entry.children">
    <ProofFileNode
      v-for="child in entry.children"
      :key="child.name"
      :entry="child"
      :depth="depth + 1"
    />
  </template>
</template>

<style scoped>
/* Seti 私有区图标字体，对齐产品 file-tree-node 的列内渲染。 */
.proof-seti-icon {
  font-family: 'seti';
  font-size: 18px;
  line-height: 1;
  font-style: normal;
  font-weight: normal;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
