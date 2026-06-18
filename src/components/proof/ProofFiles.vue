<script setup lang="ts">
// S1-2 文件：忠实复刻产品文件树面板（去掉胶囊导航，只留面板内容）。
// 树逻辑（递归节点 + 点击展开/折叠 + 文件高亮）搬自产品 file-tree.vue / file-tree-node.vue，
// 通过 provide 把激活态传给递归节点；这里只换成静态预设树。
// 内容刻意多于一屏，配合外层细滚动条展示「这是一台塞满文件的真机器」。
import { provide, ref } from 'vue'
import ProofFileNode from './ProofFileNode.vue'
import { ProofFilesKey, type FileEntry } from './proof-files-context'

// dirs first（对齐产品 sortDirsFirst）：根目录 memory 已展开，其余目录折叠。
// 默认折叠态刚好放下、不出滚动条；用户点开任意目录后内容溢出，才出现滚动条。
const tree: FileEntry[] = [
  {
    name: 'memory',
    isDir: true,
    expanded: true,
    children: [
      { name: 'episodes.md' },
      { name: 'people.md' },
      { name: 'facts.md' },
    ],
  },
  {
    name: 'media',
    isDir: true,
    children: [
      { name: 'photo-4821.jpg' },
      { name: 'voice-note.m4a' },
    ],
  },
  {
    name: 'downloads',
    isDir: true,
    children: [
      { name: 'report-q2.pdf' },
      { name: 'invoice.pdf' },
    ],
  },
  {
    name: 'workspace',
    isDir: true,
    children: [
      { name: 'weekly-report.md' },
      { name: 'draft.md' },
      { name: 'data.csv' },
    ],
  },
  { name: 'AGENTS.md' },
  { name: 'MEMORY.md' },
  { name: 'HEARTBEAT.md' },
  { name: 'notes.md' },
]

const active = ref<FileEntry | null>(null)
provide(ProofFilesKey, { active, setActive: (entry) => { active.value = entry } })
</script>

<template>
  <div class="proof-surface flex h-full w-full flex-col overflow-hidden rounded-xl border border-white/10 bg-[#0b0b0e]">
    <!-- 面板标题：对齐产品 files-pane 的 header 字号/缩进 -->
    <div class="flex min-h-[1.6875rem] shrink-0 items-center px-2 pl-[15px] pt-3 pb-1 select-none">
      <span class="truncate text-xs font-[550] tracking-[-0.02em] text-muted-foreground/80">Felinic</span>
    </div>

    <!-- 滚动容器：对齐产品 ScrollArea 的角色（高度撑满 + 细滚动条） -->
    <div class="proof-files-scroll min-h-0 flex-1 py-1">
      <ProofFileNode
        v-for="entry in tree"
        :key="entry.name"
        :entry="entry"
        :depth="0"
      />
    </div>
  </div>
</template>

<style scoped>
.proof-files-scroll {
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.16) transparent;
}
.proof-files-scroll::-webkit-scrollbar {
  width: 8px;
}
.proof-files-scroll::-webkit-scrollbar-track {
  background: transparent;
}
.proof-files-scroll::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.14);
  border-radius: 4px;
  border: 2px solid transparent;
  background-clip: padding-box;
}
.proof-files-scroll::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.26);
  background-clip: padding-box;
}
</style>
