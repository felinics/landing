# Memoh Landing Page

Welcome to the **Memoh Landing Page** project! This repository contains the frontend scaffold for Memoh's landing page, engineered for high performance, accessibility, and a modern, AI-centric aesthetic.

## ✨ Features & Design

Inspired by Memoh's clean and modern interface, this landing page incorporates:
- **Modern UI/UX**: Clean interfaces with Dark/Light mode support, utilizing Action Blue/Indigo and modern AI gradients.
- **Layout Patterns**: Features split-layout hero sections and bento-box style grids for presenting features.
- **Accessible Components**: Built on top of Radix Vue for fully accessible, interactive primitives (e.g., accordions, dialogs, tooltips).
- **Mobile-First Responsive Design**: Fluid and responsive layouts powered by Tailwind CSS.

## 🛠 Technical Stack

This project leverages a robust, modern frontend architecture based on the `felinics/Memoh` core repository:

- **Framework**: Vue 3 (Composition API & `<script setup>`)
- **Language**: TypeScript
- **Build Tool**: Vite
- **State Management**: Pinia
- **Styling**: Tailwind CSS (with CSS Variables integration)
- **UI Primitives**: Radix Vue (Reka UI)
- **Icons**: Lucide Vue Next

## 📂 Project Structure

```text
src/
├── assets/      # Static assets and global CSS styles
├── components/  # Atomic, reusable UI components and page sections
├── store/       # Pinia stores for state management
├── App.vue      # Root application component
└── main.ts      # Application entry point
```

## 🚀 Getting Started

### Prerequisites

Make sure you have Node.js and `npm` installed on your local machine.

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/felinics/Memoh.git
   ```
2. Navigate to the landing page directory and install the dependencies:
   ```bash
   npm install
   ```

### Development

Start the development server with Hot Module Replacement (HMR):
```bash
npm run dev
```

### Build for Production

Create a production-ready, minified build:
```bash
npm run build
```

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
