import { mkdir, readFile, writeFile } from 'node:fs/promises'
import { resolve } from 'node:path'

const distDir = resolve('dist')
const indexPath = resolve(distDir, 'index.html')
const metaPattern = /<!-- app-meta-start -->[\s\S]*?<!-- app-meta-end -->/

// 静态 meta 必须与 src/locales 里的 seo.* 文案保持同一定位;home 同时是 index.html 的兜底内容
const pages = {
  home: {
    title: 'Memoh — The multi-agent platform',
    description: 'Every agent gets its own computer with a desktop, filesystem, and network. Always on, always there.',
    socialDescription: 'Every agent gets its own computer with a desktop, filesystem, and network. Always on, always there.',
    url: 'https://memoh.ai/',
  },
  // /desktop 已重定向到 /download,但保留静态入口让旧链接拿到 200 而不是 404
  desktop: {
    title: 'Memoh Desktop - Download for macOS, Windows & Linux',
    description: 'Download the Memoh desktop app for macOS, Windows, and Linux. Run your agent workspace natively on your computer.',
    socialDescription: 'Download Memoh Desktop for macOS, Windows, and Linux.',
    url: 'https://memoh.ai/desktop',
  },
  download: {
    title: 'Download Memoh Desktop - macOS, Windows & Linux',
    description: 'Pick the Memoh desktop installer for your system. Available for macOS (Apple Silicon & Intel), Windows, and Linux.',
    socialDescription: 'Download Memoh Desktop for macOS, Windows, and Linux.',
    url: 'https://memoh.ai/download',
  },
  waitlist: {
    title: 'Join the Memoh waitlist',
    description: 'Join the Memoh waitlist for early access to cloud agent workspaces.',
    socialDescription: 'Join the Memoh waitlist for early access to cloud agent workspaces.',
    url: 'https://memoh.ai/waitlist',
  },
  blogs: {
    title: 'Memoh Blog',
    description: 'Field notes, architecture writeups, and product updates from the Memoh team.',
    socialDescription: 'Field notes, architecture writeups, and product updates from the Memoh team.',
    url: 'https://memoh.ai/blogs',
  },
}

const escapeHtml = (value) => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

const renderMeta = ({ title, description, socialDescription, url }) => {
  const image = 'https://memoh.ai/logo.png'

  return `<!-- app-meta-start -->
    <title>${escapeHtml(title)}</title>
    <meta name="description" content="${escapeHtml(description)}" />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="${escapeHtml(url)}" />
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Memoh" />
    <meta property="og:title" content="${escapeHtml(title)}" />
    <meta property="og:description" content="${escapeHtml(socialDescription)}" />
    <meta property="og:url" content="${escapeHtml(url)}" />
    <meta property="og:image" content="${image}" />
    <meta name="twitter:card" content="summary" />
    <meta name="twitter:title" content="${escapeHtml(title)}" />
    <meta name="twitter:description" content="${escapeHtml(socialDescription)}" />
    <meta name="twitter:image" content="${image}" />
    <!-- app-meta-end -->`
}

const withMeta = (html, page) => {
  if (!metaPattern.test(html)) {
    throw new Error('Missing app metadata markers in dist/index.html')
  }

  return html.replace(metaPattern, renderMeta(page))
}

const indexHtml = await readFile(indexPath, 'utf8')
await writeFile(indexPath, withMeta(indexHtml, pages.home))
await writeFile(resolve(distDir, '404.html'), withMeta(indexHtml, pages.home))

// 每个 SPA 路由都必须在这里有静态入口,否则 GitHub Pages 用 404.html 兜底、返回 404 状态码(SEO 直接判死)
for (const route of ['desktop', 'download', 'waitlist', 'blogs']) {
  const routeDir = resolve(distDir, route)
  await mkdir(routeDir, { recursive: true })
  await writeFile(resolve(routeDir, 'index.html'), withMeta(indexHtml, pages[route]))
}

console.log('Created SPA fallback files')
