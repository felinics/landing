<script setup lang="ts">
// S2-1 定时：忠实复刻产品 schedule 侧栏面板（分组 + 任务卡 + 开关），去掉胶囊。
// 行结构/字号搬自 panel-schedule.vue + schedule-list-item.vue（sidebar variant）。
import { reactive } from 'vue'
import { Plus } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()

interface Task {
  nameKey: string
  descKey: string
  time: string
  on: boolean
}
interface Group {
  labelKey: string
  tasks: Task[]
}

const groups = reactive<Group[]>([
  {
    labelKey: 'proof.schedule.today',
    tasks: [
      { nameKey: 'proof.schedule.t3.name', descKey: 'proof.schedule.t3.desc', time: '21:00', on: true },
    ],
  },
  {
    labelKey: 'proof.schedule.tomorrow',
    tasks: [
      { nameKey: 'proof.schedule.t1.name', descKey: 'proof.schedule.t1.desc', time: '09:00', on: true },
      { nameKey: 'proof.schedule.t2.name', descKey: 'proof.schedule.t2.desc', time: '18:00', on: false },
    ],
  },
])

function toggle(task: Task) {
  task.on = !task.on
}
</script>

<template>
  <div class="proof-surface proof-dark flex h-full w-full flex-col overflow-hidden rounded-xl border border-border bg-background">
    <div
      v-for="(group, gi) in groups"
      :key="group.labelKey"
    >
      <!-- 分组标题 -->
      <div class="flex h-8 items-center px-2 mt-2">
        <span class="flex-1 pl-[11px] text-xs font-[550] tracking-[-0.02em] text-muted-foreground/80">
          {{ t(group.labelKey) }}
        </span>
        <span
          v-if="gi === 0"
          class="mr-1 flex size-6 items-center justify-center rounded-full text-muted-foreground"
        >
          <Plus :stroke-width="1.75" class="size-[15px]" />
        </span>
      </div>

      <!-- 任务卡 -->
      <div class="px-2 pb-1 space-y-1.5">
        <div
          v-for="task in group.tasks"
          :key="task.nameKey"
          class="flex items-center gap-2 rounded-[10px] border border-border bg-muted"
        >
          <div class="min-w-0 flex-1 px-3 py-2.5">
            <div class="flex min-w-0 items-center gap-2">
              <p class="truncate text-[13px] leading-snug text-foreground">{{ t(task.nameKey) }}</p>
              <span class="shrink-0 text-[11px] tabular-nums text-muted-foreground">{{ task.time }}</span>
            </div>
            <p class="mt-0.5 truncate text-[11px] leading-snug text-muted-foreground">{{ t(task.descKey) }}</p>
          </div>
          <span class="shrink-0 pr-2.5">
            <button
              type="button"
              role="switch"
              :aria-checked="task.on"
              class="relative flex h-[18px] w-[31px] cursor-pointer items-center rounded-full transition-colors focus:outline-none"
              :class="task.on ? 'bg-[#3b82f6]' : 'bg-white/20'"
              @click="toggle(task)"
            >
              <span
                class="absolute size-[14px] rounded-full bg-white shadow-sm transition-transform"
                :class="task.on ? 'translate-x-[15px]' : 'translate-x-[2px]'"
              />
            </button>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
