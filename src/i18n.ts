import { createI18n } from 'vue-i18n'
import en from './locales/en.json'
import zh from './locales/zh.json'
import ja from './locales/ja.json'

export const supportedLocales = ['en', 'zh', 'ja'] as const
export type SupportedLocale = (typeof supportedLocales)[number]

const isSupported = (lang: string): lang is SupportedLocale =>
  (supportedLocales as readonly string[]).includes(lang)

// Determine default locale from localStorage or browser language
const getBrowserLang = (): SupportedLocale => {
  const lang = navigator.language.split('-')[0]
  return isSupported(lang) ? lang : 'en'
}
const savedLang = localStorage.getItem('memoh-lang')
const defaultLocale = savedLang && isSupported(savedLang) ? savedLang : getBrowserLang()

export const i18n = createI18n({
  legacy: false, // use Composition API
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: {
    en,
    zh,
    ja
  }
})
