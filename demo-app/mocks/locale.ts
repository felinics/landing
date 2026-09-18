// The landing page passes ?lang= to the embedded demo iframe (HeroShowcase.vue).
// mock.test.ts runs under Node where location is undefined; content stays English there.
const langParam = typeof location === 'undefined' ? null : new URLSearchParams(location.search).get('lang')
export const demoLocale = langParam === 'zh' || langParam === 'ja' ? langParam : 'en'
