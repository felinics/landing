<script setup lang="ts">
import { ref, computed } from 'vue'
import { RouterLink } from 'vue-router'
import { onClickOutside } from '@vueuse/core'
import { Moon, Sun, Languages, ChevronDown, Check } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useThemePreference } from '../composables/useTheme'
import GitHubStarsLink from './GitHubStarsLink.vue'

const props = defineProps<{
  overlay?: boolean
  hideThemeToggle?: boolean
  lightSocialIcons?: boolean
}>()

const linkClass = computed(() =>
  props.overlay
    ? 'text-white/85 hover:text-white hover:bg-white/10'
    : 'text-muted-foreground hover:text-foreground hover:bg-accent',
)

const iconBtnClass = computed(() =>
  props.overlay || props.lightSocialIcons
    ? 'text-white/85 hover:text-white'
    : 'text-muted-foreground hover:text-foreground',
)

const { isDark, toggle: toggleDark } = useThemePreference()

const { locale } = useI18n()
const docsUrl = computed(() => locale.value === 'zh' ? 'https://docs.memoh.ai/zh' : 'https://docs.memoh.ai')

const isLangOpen = ref(false)
const langMenuRef = ref<HTMLElement | null>(null)

onClickOutside(langMenuRef, () => {
  isLangOpen.value = false
})

const toggleLangMenu = () => {
  isLangOpen.value = !isLangOpen.value
}

const selectLang = (lang: string) => {
  locale.value = lang
  localStorage.setItem('memoh-lang', lang)
  isLangOpen.value = false
}
</script>

<template>
  <header
    class="z-50 w-full flex justify-center shadow-none"
    :class="overlay
      ? 'absolute top-0 left-0 bg-transparent'
      : 'sticky top-0 backdrop-blur bg-background/80'"
  >
    <div
      class="max-w-[1080px] w-full h-14 px-4 md:px-8 flex items-center justify-between relative"
      :class="overlay ? '' : 'after:absolute after:bottom-0 after:left-4 after:right-4 md:after:left-8 md:after:right-8 after:h-px after:bg-border'"
    >
      <div class="flex items-center gap-4 sm:gap-6 md:gap-10 overflow-hidden">
        <RouterLink to="/" class="flex items-center shrink-0 gap-2">
          <img src="/logo.png" alt="Memoh Logo" class="w-6 h-6 object-contain" />
          <span class="font-bold text-lg tracking-tight" :class="overlay ? 'text-white' : 'text-foreground'">
            Memoh
          </span>
        </RouterLink>
        <nav class="hidden md:flex items-center gap-1 sm:gap-2">
          <a :href="docsUrl" target="_blank" rel="noopener noreferrer" class="font-medium text-sm rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap" :class="linkClass">{{ $t('nav.docs') }}</a>
          <!-- Pricing 入口先撤下:/pricing 路由不存在,点进去是空白页。定价页上线时连同 nav.pricing 文案一起恢复。 -->
          <RouterLink to="/blogs" class="font-medium text-sm rounded-md px-3 py-2 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 whitespace-nowrap" :class="linkClass" :active-class="overlay ? 'text-white bg-white/10' : 'text-foreground bg-accent'">{{ $t('nav.blogs') }}</RouterLink>
        </nav>
      </div>

      <div class="flex items-center ml-2 sm:ml-4 shrink-0 gap-2">
        <GitHubStarsLink :overlay="overlay" />
        <a href="https://t.me/memohai"
           target="_blank"
           rel="noopener noreferrer"
           aria-label="Telegram"
           class="icon-ghost flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-md bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-none"
           :class="[iconBtnClass, overlay ? 'icon-ghost--overlay' : '']">
          <span aria-hidden="true" class="telegram-icon h-4 w-4 shrink-0"></span>
        </a>

        <div class="relative flex items-center" ref="langMenuRef">
          <button @click="toggleLangMenu"
                  class="icon-ghost flex items-center justify-center gap-1.5 px-2 h-9 rounded-md bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-none"
                  :class="[iconBtnClass, overlay ? 'icon-ghost--overlay' : '']"
                  aria-label="Select language">
            <Languages class="w-4 h-4 shrink-0" />
            <span class="text-[10px] font-bold tracking-tighter">{{ locale === 'zh' ? 'ZH' : 'EN' }}</span>
            <ChevronDown class="w-3 h-3 shrink-0 opacity-50 transition-transform duration-200" :class="{ 'rotate-180': isLangOpen }" />
          </button>

          <Transition
            enter-active-class="transition ease-out duration-75"
            enter-from-class="opacity-0"
            enter-to-class="opacity-100"
            leave-active-class="transition ease-in duration-75"
            leave-from-class="opacity-100"
            leave-to-class="opacity-0"
          >
            <div v-if="isLangOpen"
                 class="lang-menu absolute top-full right-0 mt-1.5 w-36 z-50 p-1.5 flex flex-col gap-0.5">
              <button @click="selectLang('en')"
                      class="lang-item flex items-center justify-between gap-2 w-full rounded-[8px] px-2.5 py-1.5 text-sm text-left transition-colors duration-[60ms]"
                      :class="locale === 'en' ? 'text-foreground' : 'text-muted-foreground'">
                <span>English</span>
                <Check v-if="locale === 'en'" class="w-4 h-4 shrink-0" />
              </button>
              <button @click="selectLang('zh')"
                      class="lang-item flex items-center justify-between gap-2 w-full rounded-[8px] px-2.5 py-1.5 text-sm text-left transition-colors duration-[60ms]"
                      :class="locale === 'zh' ? 'text-foreground' : 'text-muted-foreground'">
                <span>中文</span>
                <Check v-if="locale === 'zh'" class="w-4 h-4 shrink-0" />
              </button>
            </div>
          </Transition>
        </div>

        <button v-if="!hideThemeToggle" @click="toggleDark()"
                class="icon-ghost flex items-center justify-center w-9 h-9 min-w-[36px] min-h-[36px] rounded-md bg-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 shadow-none"
                :class="[iconBtnClass, overlay ? 'icon-ghost--overlay' : '']"
                aria-label="Toggle theme">
          <Sun v-if="isDark" class="w-4 h-4 shrink-0" />
          <Moon v-else class="w-4 h-4 shrink-0" />
        </button>

      </div>
    </div>
  </header>
</template>

<style scoped>
/* Icon buttons adopt the @memohai/ui contract semantic: the icon never moves —
   background + press-scale live on ::before, so only the bg layer reacts. */
.icon-ghost {
  position: relative;
  isolation: isolate;
}
.icon-ghost::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: -1;
  border-radius: inherit;
  background-color: transparent;
  transition:
    scale 0.255s linear(0, .3505, .7432, .9336, .9951, 1.0062, 1.0045, 1.0019, 1.0005, 1),
    background-color 0.12s ease-out;
}
.icon-ghost:hover::before {
  background-color: var(--btn-ghost-hover);
}
.icon-ghost--overlay:hover::before {
  background-color: oklch(1 0 0 / 0.12);
}
/* ghost/secondary press contract: a restrained 0.974 nudge, not a hard squash */
.icon-ghost:active::before {
  scale: 0.974;
}

.telegram-icon {
  background-color: currentColor;
  mask: url('/brands/telegram.svg') center / contain no-repeat;
  -webkit-mask: url('/brands/telegram.svg') center / contain no-repeat;
}

/* 语言下拉：完全沿用 @memohai/ui Select 的表面（色/描边/阴影/圆角） */
.lang-menu {
  background-color: var(--popover);
  color: var(--popover-foreground);
  border: 1px solid var(--border-menu);
  border-radius: 12px;
  box-shadow: var(--shadow-dropdown);
}
.lang-item:hover {
  background-color: var(--ui-selected);
}
</style>
