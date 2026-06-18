// S1-2 文件树的共享状态（搬自产品 file-tree-context.ts 的精简版）。
// 产品里树节点通过 inject 拿到 active/openFile 等回调；这里只保留 landing mock 需要的
// 「当前激活文件 + 设置激活」，点击文件即高亮，点击目录由节点本地的 expanded 控制。
import type { InjectionKey, Ref } from 'vue'

export interface FileEntry {
  name: string
  isDir?: boolean
  // 目录是否默认展开（对齐产品：根目录已展开，子目录默认折叠，点击再加载）
  expanded?: boolean
  children?: FileEntry[]
}

export interface ProofFilesCtx {
  active: Ref<FileEntry | null>
  setActive: (entry: FileEntry) => void
}

export const ProofFilesKey: InjectionKey<ProofFilesCtx> = Symbol('proof-files')
