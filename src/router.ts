import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('./pages/HomePage.vue')
const DownloadPage = () => import('./pages/DownloadPage.vue')
const BlogsPage = () => import('./pages/BlogsPage.vue')
const WaitlistPage = () => import('./pages/WaitlistPage.vue')
const NotFoundPage = () => import('./pages/NotFoundPage.vue')
const LegalPage = () => import('./pages/LegalPage.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/waitlist', name: 'waitlist', component: WaitlistPage },
    { path: '/download', name: 'download', component: DownloadPage },
    { path: '/blogs', name: 'blogs', component: BlogsPage },
    { path: '/blogs/:slug', name: 'blog-post', component: BlogsPage },
    { path: '/legal', redirect: '/legal/terms' },
    { path: '/legal/terms', name: 'legal-terms', component: LegalPage, props: { documentKey: 'terms' }, meta: { legal: true } },
    { path: '/legal/privacy', name: 'legal-privacy', component: LegalPage, props: { documentKey: 'privacy' }, meta: { legal: true } },
    { path: '/legal/cross-border', name: 'legal-cross-border', component: LegalPage, props: { documentKey: 'cross-border' }, meta: { legal: true } },
    // /desktop has been merged into /download; keep a redirect for old links.
    { path: '/desktop', redirect: '/download' },
    // Catch-all: without it, unknown URLs render an empty body between TopBar and footer.
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    // LegalPage resolves fragments after its Markdown has rendered.
    if (_to.meta.legal && _to.hash) return false
    return { top: 0 }
  },
})
