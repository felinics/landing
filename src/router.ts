import { createRouter, createWebHistory } from 'vue-router'

const HomePage = () => import('./pages/HomePage.vue')
const DownloadPage = () => import('./pages/DownloadPage.vue')
const BlogsPage = () => import('./pages/BlogsPage.vue')
const WaitlistPage = () => import('./pages/WaitlistPage.vue')
const NotFoundPage = () => import('./pages/NotFoundPage.vue')

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', name: 'home', component: HomePage },
    { path: '/waitlist', name: 'waitlist', component: WaitlistPage },
    { path: '/download', name: 'download', component: DownloadPage },
    { path: '/blogs', name: 'blogs', component: BlogsPage },
    { path: '/blogs/2026-09-11', redirect: '/blogs/2026-09-15' },
    { path: '/blogs/2026-09-11-en', redirect: '/blogs/2026-09-15' },
    { path: '/blogs/:slug', name: 'blog-post', component: BlogsPage },
    // /desktop has been merged into /download; keep a redirect for old links.
    { path: '/desktop', redirect: '/download' },
    // Catch-all: without it, unknown URLs render an empty body between TopBar and footer.
    { path: '/:pathMatch(.*)*', name: 'not-found', component: NotFoundPage },
  ],
  scrollBehavior(_to, _from, savedPosition) {
    if (savedPosition) return savedPosition
    return { top: 0 }
  },
})
