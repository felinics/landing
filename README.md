# Memoh Landing Page

The marketing site for **Memoh** — landing page, blog, docs entry points, and desktop download flows. Built for performance, accessibility, and a modern, AI-centric aesthetic.

## Technical Stack

- **Framework**: Vue 3 (Composition API & `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **Routing**: vue-router (HTML5 history mode)
- **i18n**: vue-i18n (English / Chinese)
- **State Management**: Pinia
- **Styling**: Tailwind CSS (with CSS variables)
- **UI Primitives**: Radix Vue (Reka UI)
- **Icons**: Lucide Vue Next

## Project Structure

```text
src/
├── assets/          # Static assets and global CSS styles
├── components/      # Reusable UI components and page sections
├── content/
│   └── blogs/       # Blog posts in Markdown (en/ and zh/ locales)
├── lib/
│   ├── blogs.ts     # Blog loader: frontmatter parsing, locales, slug aliases
│   └── desktopDownloads.ts  # Manifest-first desktop download resolution
├── pages/           # Route-level pages (home, blogs, download, ...)
├── router.ts        # Routes, including legacy blog URL redirects
├── store/           # Pinia stores
├── App.vue          # Root application component
└── main.ts          # Application entry point
public/
└── blogs/<slug>/    # Images and media for each blog post
workers/             # Cloudflare Worker for legacy desktop download proxy
```

## Getting Started

### Prerequisites

Node.js and `npm` installed locally.

### Installation

```bash
git clone https://github.com/felinics/landing.git
cd landing
npm install
```

### Development

```bash
npm run dev
```

### 套餐入口联调

Pricing 的按钮跳转到 Cloud `/plans?plan=<code>`，当前官网使用 `go-monthly`、`pro-monthly`、`premium-monthly`。
`<code>` 是 Cloud **定价卡**（管理台 → 订阅运营 → 定价页展示）的 code，不是套餐名或售卖方案名；
套餐页按它精确匹配，对不上会显示“此套餐暂不可用”。运营改卡名或新增年付卡时，必须同一批次更新这里的值。
实际购买价格与资格由 Cloud 目录决定。
Cloud 应先上线对 `plan` 的支持，再上线官网链接。

默认目标为 `https://app.memoh.net`。本地联调可指定 Cloud 前端地址：

```bash
VITE_MEMOH_APP_URL=http://127.0.0.1:8094 pnpm dev --host 127.0.0.1 --port 5194
```

此变量只影响 Pricing 套餐按钮，不改变普通 Get Started 或下载入口。
支付验收还需要 Cloud 测试工作区、可购买的套餐和 Stripe 测试配置；本地前端本身不提供支付后端。

### Build for Production

```bash
npm run build
```

## Blog Content

Blog posts live in `src/content/blogs/{locale}/{slug}.md`, where `locale` is `en` or `zh` and `slug` is a descriptive, English, kebab-case name (for example `cloud-computer-for-every-agent`). **Do not use dates as filenames.** The slug becomes the public URL: `/blogs/<slug>`.

### Adding a post

1. Create `src/content/blogs/en/<slug>.md` (and optionally `zh/<slug>.md` for the Chinese version — same slug, so the page switches with the site locale).
2. Add frontmatter:

   ```markdown
   ---
   title: Introducing Memoh
   author: Yanbo
   date: 2026-09-15
   ---
   ```

   `date` (YYYY-MM-DD) controls display date and list ordering (newest first).
3. Put images in `public/blogs/<slug>/` and reference them as `/blogs/<slug>/image.png`.

### Legacy URLs

Older posts used date-based URLs (e.g. `/blogs/2026-09-15`). These keep working through two layers:

- Redirect routes in `src/router.ts` (old date path → new slug path)
- `slugAliases` in `src/lib/blogs.ts` as a fallback lookup

When renaming a post's slug, add both a redirect route and an alias entry so existing links never break.

## Desktop Downloads

The landing page resolves Cloud Desktop installers from the public
S3-compatible release directory:

```text
https://desktopresource.memoh.ai/latest.yml
https://desktopresource.memoh.ai/latest-mac.yml
https://desktopresource.memoh.ai/latest-linux.yml
```

Every download action fetches the relevant `latest*.yml` manifest first. Windows
and Linux use the artifact filename declared in its `files` list. Because
`latest-mac.yml` is an `electron-updater` feed and therefore declares ZIP
archives, macOS downloads use the matching same-version, same-architecture DMG
filename. Do not hard-code a versioned filename. A different public directory
can be supplied at build time with `VITE_MEMOH_DESKTOP_RESOURCE_BASE_URL`.

The manifest-first Cloud Desktop flow is implemented in
`src/lib/desktopDownloads.ts` and is shared by the home-page download menu and
the `/download` page.

## Legacy Desktop Download Proxy

The older OSS Desktop download routes are still served through a Cloudflare
Worker at:

```text
/downloads/desktop/latest/mac-arm64.dmg
/downloads/desktop/latest/mac-x64.dmg
/downloads/desktop/latest/win-x64-setup.exe
/downloads/desktop/latest/linux-amd64.deb
/downloads/desktop/latest/linux-x86_64.AppImage
```

The Worker resolves the latest `felinics/Memoh` release, redirects to a same-domain versioned URL, then caches the release asset at Cloudflare edge on first download. Users never download from a GitHub release URL directly.

Release assets are discovered by the stable platform suffix in each route and proxied through the `browser_download_url` returned by GitHub. Do not reconstruct asset URLs or couple the Worker to a product-name prefix such as `Memoh` or `Memoh-Local`.

Deploy the Worker after configuring the `memoh.ai/downloads/desktop/*` route:

```bash
npx wrangler deploy --config workers/wrangler.toml
```

GitHub Actions also deploys the Worker from `.github/workflows/deploy-download-worker.yml` when files under `workers/` change. Add these repository secrets before relying on the workflow:

```text
CLOUDFLARE_API_TOKEN
CLOUDFLARE_ACCOUNT_ID
MEMOH_GITHUB_TOKEN
```

`MEMOH_GITHUB_TOKEN` is written to the Worker as the runtime `GITHUB_TOKEN` secret, so the Worker can call the GitHub Releases API without hitting unauthenticated rate limits. A fine-grained read-only token for the release repository is enough.

If a download URL returns a GitHub Pages 404 page, the Worker route is not active for that path yet. Re-run the Worker deployment and, if Cloudflare cached the old 404, purge `/downloads/desktop/*`.

For manual deployments, set the Worker secret directly:

```bash
npx wrangler secret put GITHUB_TOKEN --config workers/wrangler.toml
```
