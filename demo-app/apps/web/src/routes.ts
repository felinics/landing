import { h } from 'vue'
import { RouterView, type RouteLocationNormalized, type RouteRecordRaw } from 'vue-router'
import { i18nRef } from './i18n'
import { getBotBreadcrumbName } from './lib/bot-breadcrumb'

/** Shared page routes; each host owns its router, history, and navigation guards. */
export function createAppRoutes(platform: 'web' | 'desktop'): RouteRecordRaw[] {
  const desktop = platform === 'desktop'
  return [
    {
      path: '/onboarding',
      name: 'onboarding',
      component: () => import('@/pages/onboarding/index.vue'),
    },
    {
      // Chat area. The chat UI (main-section: sidebar + dockview) is mounted
      // persistently in App.vue, NOT here — these routes exist only so the URL
      // (/, /bot/:name) matches and the breadcrumb/active-bot sync works. Their
      // components render nothing; App.vue shows the persistent MainSection on
      // these route names. This is what lets chat survive a trip into settings
      // (fixed overlay) without unmounting/relayout/re-scroll.
      path: '/',
      component: { render: () => null },
      children: [
        {
          name: 'home',
          path: '',
          component: { render: () => null },
          meta: {
            breadcrumb: i18nRef('sidebar.chat'),
          },
        },
        {
          name: 'bot',
          path: desktop ? '/bot/:botName?/:sessionId?' : '/bot/:botName?',
          component: { render: () => null },
          meta: {
            breadcrumb: i18nRef('sidebar.chat'),
          },
        },
        {
          // Backwards-compatible redirect for legacy UUID-based chat links.
          path: desktop ? '/chat/:botName?/:sessionId?' : '/chat/:botName?',
          redirect: (to) => {
            const botName = (to.params.botName as string) ?? ''
            return botName
              ? { name: 'bot', params: { botName, ...(desktop ? { sessionId: to.params.sessionId } : {}) } }
              : { name: 'home' }
          },
        },
      ],
    },
    {
      path: '/settings',
      component: () => import('@/pages/settings-section/index.vue'),
      // Web needs bare /settings for the mobile navigation list.
      ...(desktop ? { redirect: '/settings/bots' } : {}),
      children: [
        {
          path: 'bots',
          component: { render: () => h(RouterView) },
          meta: {
            breadcrumb: i18nRef('sidebar.bots'),
          },
          children: [
            {
              name: 'bots',
              path: '',
              component: () => import('@/pages/bots/index.vue'),
            },
            {
              name: 'bot-new',
              path: 'new',
              component: () => import('@/pages/bots/new.vue'),
              meta: {
                breadcrumb: i18nRef('bots.createBot'),
              },
            },
            {
              name: 'bot-create-progress',
              path: 'new/progress',
              component: () => import('@/pages/bots/new-progress.vue'),
              meta: {
                breadcrumb: i18nRef('bots.createBot'),
              },
            },
            {
              name: 'bot-detail',
              path: ':botName',
              component: () => import('@/pages/bots/detail.vue'),
              meta: {
                // Resolve the bot's display name from the registry the detail page
                // populates; never echo the raw `bot-<uuid>` route param. Unknown
                // names yield '' so the back affordance shows its generic label.
                breadcrumb: (route: RouteLocationNormalized) =>
                  getBotBreadcrumbName(String(route.params.botName ?? '')),
              },
            },
          ],
        },
        {
          name: 'providers',
          path: 'providers',
          component: () => import('@/pages/providers/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.providers'),
          },
        },
        {
          name: 'runtimes',
          path: 'runtimes',
          component: () => import('@/pages/runtimes/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.runtimes'),
          },
        },
        {
          name: 'web-search',
          path: 'web-search',
          component: () => import('@/pages/web-search/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.webSearch'),
          },
        },
        {
          name: 'memory',
          path: 'memory',
          component: () => import('@/pages/memory/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.memory'),
          },
        },
        {
          name: 'voice',
          path: 'voice',
          component: () => import('@/pages/voice/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.voice'),
          },
        },
        {
          name: 'video',
          path: 'video',
          component: () => import('@/pages/video/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.video'),
          },
        },
        // Speech and transcription merged into the Voice page; keep the old paths
        // working for existing links/bookmarks.
        {
          path: 'speech',
          redirect: { name: 'voice' },
        },
        {
          path: 'transcription',
          redirect: { name: 'voice' },
        },
        {
          name: 'email',
          path: 'email',
          component: () => import('@/pages/email/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.email'),
          },
        },
        {
          name: 'usage',
          path: 'usage',
          component: () => import('@/pages/usage/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.usage'),
          },
        },
        {
          name: 'people',
          path: 'people',
          component: () => import('@/pages/people/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.people'),
            adminOnly: true,
          },
        },
        {
          name: 'appearance',
          path: 'appearance',
          component: () => import('@/pages/appearance/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.appearance'),
          },
        },
        {
          name: 'keyboard',
          path: 'keyboard',
          component: () => import('@/pages/keyboard-shortcuts/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.keyboard'),
          },
        },
        {
          name: 'profile',
          path: 'profile',
          component: () => import('@/pages/profile/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.settings'),
          },
        },
        {
          path: 'supermarket',
          component: { render: () => h(RouterView) },
          meta: {
            breadcrumb: i18nRef('sidebar.supermarket'),
          },
          children: [
            {
              name: 'supermarket',
              path: '',
              component: () => import('@/pages/supermarket/index.vue'),
            },
            {
              name: 'supermarket-category',
              path: 'category/:categoryId',
              component: () => import('@/pages/supermarket/category.vue'),
              meta: {
                breadcrumb: (route: RouteLocationNormalized) => route.params.categoryId,
              },
            },
            {
              name: 'supermarket-app-detail',
              path: ':registryId/:appId',
              component: () => import('@/pages/supermarket/app-detail.vue'),
              meta: {
                breadcrumb: (route: RouteLocationNormalized) => route.params.appId,
              },
            },
          ],
        },
        {
          name: 'about',
          path: 'about',
          component: () => import('@/pages/about/index.vue'),
          meta: {
            breadcrumb: i18nRef('sidebar.about'),
          },
        },
      ],
    },
    {
      name: 'Login',
      path: '/login',
      component: () => import('@/pages/login/index.vue'),
    },
    {
      name: 'oauth-mcp-callback',
      path: '/oauth/mcp/callback',
      component: () => import('@/pages/oauth/mcp-callback.vue'),
    },
    // Dev-only component wall. Registered ONLY in dev builds, so the chunk and
    // its auth-bypass guard never exist in production. Reached by setting the
    // `memoh:dev-tools` localStorage flag and navigating to /dev/components.
    ...(import.meta.env.DEV
      ? [
          {
            name: 'dev-components',
            path: '/dev/components',
            component: () => import('@/pages/dev/components/index.vue'),
          },
        ]
      : []),
  ]
}
