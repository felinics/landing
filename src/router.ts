import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('./pages/HomePage.vue')
const DownloadPage = () => import('./pages/DownloadPage.vue')
const BlogsPage = () => import('./pages/BlogsPage.vue')
const WaitlistPage = () => import('./pages/WaitlistPage.vue')
const NotFoundPage = () => import('./pages/NotFoundPage.vue')
const LegalPage = () => import('./pages/LegalPage.vue')
const HelpPage = () => import('./pages/HelpPage.vue')
const HelpCollectionPage = () => import('./pages/HelpCollectionPage.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/waitlist', name: 'waitlist', component: WaitlistPage },
    { path: '/download', name: 'download', component: DownloadPage },
    { path: '/blogs', name: 'blogs', component: BlogsPage },
    // Old date-based blog URLs; keep redirects for existing links.
    { path: '/blogs/2026-02-16', redirect: '/blogs/introduction-to-memoh' },
    { path: '/blogs/2026-05-02', redirect: '/blogs/discuss-mode' },
    { path: '/blogs/2026-05-15', redirect: '/blogs/workspace-desktop' },
    { path: '/blogs/2026-09-11', redirect: '/blogs/cloud-computer-for-every-agent' },
    { path: '/blogs/2026-09-11-en', redirect: '/blogs/cloud-computer-for-every-agent' },
    { path: '/blogs/2026-09-15', redirect: '/blogs/cloud-computer-for-every-agent' },
    { path: '/blogs/:slug', name: 'blog-post', component: BlogsPage },
    { path: '/help', name: 'help', component: HelpPage },
    { path: '/help/:collectionId', name: 'help-collection', component: HelpCollectionPage },
    // Answers expand in place on the collection page; keep old article URLs alive.
    {
      path: '/help/:collectionId/:articleId',
      redirect: (to) => ({
        path: `/help/${String(to.params.collectionId)}`,
        hash: `#${String(to.params.articleId)}`,
      }),
    },
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
