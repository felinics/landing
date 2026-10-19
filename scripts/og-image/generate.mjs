// 生成链接分享图 public/og.jpg(2400×1260,即 1200×630 的 2 倍)。
// 卡片素材从首页现截,保证与线上 landing 一致;版式在 template.html。
//
// 仓库不依赖 Playwright,临时装到仓库外再运行:
//   npm i --prefix /tmp/og-pw playwright@1.57.0
//   PLAYWRIGHT=/tmp/og-pw/node_modules/playwright/index.mjs node scripts/og-image/generate.mjs
// 可选 --url http://localhost:4173 改从本地 preview 截取。浏览器用本机 Chrome(channel: 'chrome')。
import { mkdtemp, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import { dirname, join, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

const { chromium } = await import(process.env.PLAYWRIGHT ?? 'playwright')

const here = dirname(fileURLToPath(import.meta.url))
const root = resolve(here, '../..')
const urlArg = process.argv.indexOf('--url')
const siteUrl = urlArg > -1 ? process.argv[urlArg + 1] : 'https://memoh.ai'
if (!siteUrl) throw new Error('--url requires a value, e.g. --url http://localhost:4173')

// 按首页功能卡片的英文标题定位,不依赖 DOM 顺序。
const CARDS = {
  agents: 'Bring your own agent',
  desktop: 'Let it work. Take over anytime',
  tools: 'Every tool, hosted in one place',
  build: 'Build in the cloud. Preview anytime',
  schedule: 'Runs on its own',
  'reach-out': 'Reaches out first',
  memory: 'Picks up where it left off',
}

const browser = await chromium.launch({ channel: 'chrome' })
const workDir = await mkdtemp(join(tmpdir(), 'memoh-og-'))

try {
  // 首页固定深色主题,卡片本身是深色,分享图只做深色版。
  const site = await browser.newPage({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 3, locale: 'en-US' })
  await site.goto(siteUrl, { waitUntil: 'networkidle' })
  const shots = {}
  for (const [key, title] of Object.entries(CARDS)) {
    const heading = site.locator('h3', { hasText: title }).first()
    // 前四张卡片包在 .computer-feature 里,后三张是标题往上两层的容器;截取容器里的最后一个子元素,即示意画面本身。
    const feature = heading.locator('xpath=ancestor::*[contains(concat(" ",@class," ")," computer-feature ")][1]')
    const card = (await feature.count()) ? feature : heading.locator('xpath=../..')
    await card.scrollIntoViewIfNeeded()
    await site.waitForTimeout(2000)
    shots[key] = join(workDir, `${key}.png`)
    // 卡片是循环播放的演示动画;不冻结的话可能截在两帧淡入淡出之间,画面出现重影。
    await card.locator('xpath=./*[last()]').screenshot({ path: shots[key], animations: 'disabled' })
  }

  const page = await browser.newPage({ viewport: { width: 1200, height: 630 }, deviceScaleFactor: 2 })
  await page.goto(pathToFileURL(join(here, 'template.html')).href)
  await page.evaluate(({ shots, logo }) => {
    document.querySelectorAll('img[data-card]').forEach((img) => { img.src = shots[img.dataset.card] })
    document.querySelector('img[data-logo]').src = logo
  }, {
    shots: Object.fromEntries(Object.entries(shots).map(([k, p]) => [k, pathToFileURL(p).href])),
    logo: pathToFileURL(join(root, 'public/logo.png')).href,
  })
  // 等全部卡片图解码完再截图,否则可能截到空白卡片。
  await page.evaluate(() => Promise.all([...document.images].map((img) => img.decode())))
  // Inter 来自 Google Fonts;加载失败时浏览器会悄悄换成系统字体,这里直接报错。
  const fontsOk = await page.evaluate(async () => {
    await document.fonts.ready
    return document.fonts.check('600 64px Inter') && document.fonts.check('500 27px Inter')
  })
  if (!fontsOk) throw new Error('Inter failed to load from Google Fonts; check the network and retry')
  const out = join(root, 'public/og.jpg')
  await writeFile(out, await page.screenshot({ type: 'jpeg', quality: 88 }))
  console.log(`Wrote ${out}`)
} finally {
  await browser.close()
}
