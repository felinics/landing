<script setup lang="ts">
import { computed, onMounted, ref, useId } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { Icon } from '@iconify/vue'
import { ChevronDown, Download, LoaderCircle } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import {
  desktopDownloadOptions,
  resolveDesktopDownloadUrl,
  type DesktopDownloadKey,
} from '../lib/desktopDownloads'
import {
  desktopPlatformIcons,
  getInitialDesktopDownloadKey,
  resolvePreferredDesktopDownloadKey,
} from '../lib/desktopDevice'

const props = withDefaults(defineProps<{
  surface?: 'hero' | 'page'
}>(), {
  surface: 'page',
})

const { t } = useI18n()
const root = ref<HTMLElement | null>(null)
const isOpen = ref(false)
const loadingKey = ref<DesktopDownloadKey>()
const preferredKey = ref<DesktopDownloadKey | undefined>(getInitialDesktopDownloadKey())
const errorMessage = ref('')
const menuId = `desktop-download-menu-${useId().replace(/:/g, '')}`

onClickOutside(root, () => {
  isOpen.value = false
})

onMounted(async () => {
  preferredKey.value = await resolvePreferredDesktopDownloadKey() || preferredKey.value
})

const preferredLabel = computed(() => (
  preferredKey.value ? t(`desktop.os.${preferredKey.value}`) : t('desktop.download')
))

const triggerLabel = computed(() => {
  if (props.surface !== 'hero' || !preferredKey.value) return preferredLabel.value
  const key = preferredKey.value
  const platform = key === 'macArm' || key === 'macIntel' ? 'mac' : key === 'win' ? 'win' : 'linux'
  return t('desktop.downloadFor', { os: t(`download.groups.${platform}`) })
})

const toggleMenu = () => {
  errorMessage.value = ''
  isOpen.value = !isOpen.value
}

const download = async (key: DesktopDownloadKey) => {
  if (loadingKey.value) return
  isOpen.value = false
  errorMessage.value = ''
  loadingKey.value = key
  try {
    window.location.assign(await resolveDesktopDownloadUrl(key))
  } catch {
    errorMessage.value = t('desktop.downloadError')
    isOpen.value = true
  } finally {
    loadingKey.value = undefined
  }
}

const downloadPreferred = () => {
  if (!preferredKey.value) {
    toggleMenu()
    return
  }
  void download(preferredKey.value)
}
</script>

<template>
  <div ref="root" class="desktop-download relative" :class="`desktop-download--${surface}`">
    <div class="download-trigger inline-flex overflow-hidden rounded-full">
      <button
        type="button"
        class="download-trigger-main inline-flex min-w-0 items-center justify-center gap-2 px-5 font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        :aria-label="preferredLabel"
        :disabled="Boolean(loadingKey)"
        @click="downloadPreferred"
      >
        <LoaderCircle v-if="loadingKey && loadingKey === preferredKey" :size="18" class="shrink-0 animate-spin" />
        <Download v-else-if="surface !== 'hero'" :size="18" class="shrink-0" />
        <span class="max-w-[215px] truncate">{{ triggerLabel }}</span>
        <Icon
          v-if="preferredKey && !(loadingKey && loadingKey === preferredKey)"
          :icon="desktopPlatformIcons[preferredKey]"
          class="h-[18px] w-[18px] shrink-0"
        />
      </button>
      <button
        type="button"
        class="download-trigger-toggle inline-flex w-[48px] shrink-0 items-center justify-center focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
        :aria-expanded="isOpen"
        :aria-controls="menuId"
        aria-haspopup="menu"
        :aria-label="t('desktop.moreDownloads')"
        @click="toggleMenu"
      >
        <ChevronDown :size="18" class="transition-transform duration-150" :class="{ 'rotate-180': isOpen }" />
      </button>
    </div>

    <Transition
      enter-active-class="transition duration-150 ease-out"
      enter-from-class="translate-y-1 opacity-0"
      enter-to-class="translate-y-0 opacity-100"
      leave-active-class="transition duration-100 ease-in"
      leave-from-class="translate-y-0 opacity-100"
      leave-to-class="translate-y-1 opacity-0"
    >
      <div
        v-if="isOpen"
        :id="menuId"
        role="menu"
        class="download-menu absolute left-1/2 top-full z-50 mt-2 w-[min(340px,calc(100vw-2rem))] -translate-x-1/2 rounded-2xl p-2 text-left sm:left-0 sm:translate-x-0"
      >
        <p class="download-menu-heading px-3 pb-2 pt-1 text-xs font-medium uppercase tracking-[0.14em]">
          {{ t('desktop.otherPlatforms') }}
        </p>
        <div class="download-menu-divider mb-1 h-px" />
        <button
          v-for="option in desktopDownloadOptions"
          :key="option.key"
          type="button"
          role="menuitem"
          class="download-menu-item flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset"
          :disabled="Boolean(loadingKey)"
          @click="download(option.key)"
        >
          <LoaderCircle v-if="loadingKey === option.key" class="h-5 w-5 shrink-0 animate-spin" />
          <Icon v-else :icon="option.icon" class="h-5 w-5 shrink-0" />
          <span class="min-w-0 flex-1 truncate">{{ t(`desktop.os.${option.key}`) }}</span>
        </button>
        <p v-if="errorMessage" role="alert" class="download-error px-3 pb-1 pt-2 text-xs leading-relaxed">
          {{ errorMessage }}
        </p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.download-trigger {
  height: 52px;
  transition: scale 0.2s ease-out;
}

.download-trigger:active {
  scale: 0.985;
}

.desktop-download--hero .download-trigger {
  color: white;
  background: oklch(1 0 0 / 0.10);
  box-shadow: inset 0 0 0 1px oklch(1 0 0 / 0.30);
  backdrop-filter: blur(8px);
}

.desktop-download--hero .download-trigger-main:hover,
.desktop-download--hero .download-trigger-toggle:hover {
  background: oklch(1 0 0 / 0.20);
}

.desktop-download--hero .download-trigger-main {
  padding-right: 8px;
}

.desktop-download--hero .download-trigger-main > .iconify {
  order: -1;
}

.desktop-download--hero .download-trigger-main:focus-visible,
.desktop-download--hero .download-trigger-toggle:focus-visible {
  --tw-ring-color: rgb(255 255 255 / 0.60);
}

.desktop-download--page .download-trigger {
  height: 48px;
  color: var(--foreground);
  border: 1px solid oklch(1 0 0 / 0.15);
  background: transparent;
}

.desktop-download--page .download-trigger-main:hover,
.desktop-download--page .download-trigger-toggle:hover {
  background: oklch(1 0 0 / 0.06);
}

.desktop-download--page .download-trigger-toggle {
  border-left: 1px solid oklch(1 0 0 / 0.15);
}

.desktop-download--page .download-trigger-main:focus-visible,
.desktop-download--page .download-trigger-toggle:focus-visible {
  --tw-ring-color: var(--ring);
}

.download-menu {
  color: var(--popover-foreground);
  background: color-mix(in oklch, var(--popover) 92%, transparent);
  border: 1px solid var(--border-menu);
  box-shadow: var(--shadow-dropdown);
  backdrop-filter: blur(18px);
}

.desktop-download--hero .download-menu {
  color: rgb(245 245 245);
  background: rgb(20 20 22 / 0.94);
  border-color: rgb(255 255 255 / 0.16);
  box-shadow: 0 24px 64px rgb(0 0 0 / 0.36);
}

.download-menu-heading,
.download-error {
  color: var(--muted-foreground);
}

.desktop-download--hero .download-menu-heading {
  color: rgb(255 255 255 / 0.52);
}

.desktop-download--hero .download-error {
  color: rgb(253 186 186);
}

.download-menu-divider {
  background: var(--border);
}

.desktop-download--hero .download-menu-divider {
  background: rgb(255 255 255 / 0.1);
}

.download-menu-item:hover {
  background: var(--ui-selected);
}

.desktop-download--hero .download-menu-item:hover {
  background: rgb(255 255 255 / 0.08);
}
</style>
