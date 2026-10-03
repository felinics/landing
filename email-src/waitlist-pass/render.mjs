// 把 card.html 渲染成候补通过邮件（iam.waitlist.approved）从 https://memoh.ai/email/ 引用的 PNG。
// 邮件里不能直接用这段 HTML：缺口（SVG）、柔和阴影（filter）、斜放的章（transform）
// 在 Gmail、Outlook 里都不显示，所以卡片以图片形式发出。
//
// 背景透明：卡片轮廓以外（含两个半圆缺口）在邮件客户端改成深色时会透出邮件背景，
// 不再是一整块白色矩形。叠在白底上与不透明渲染逐像素一致，浅色模式不变。
//
// 用法：node email-src/waitlist-pass/render.mjs
// Chrome 不在 macOS 默认路径时，用环境变量 CHROME 指定可执行文件。
import { execFileSync } from 'node:child_process'
import { fileURLToPath, pathToFileURL } from 'node:url'
import path from 'node:path'
import os from 'node:os'
import { copyFileSync, readFileSync, rmSync } from 'node:fs'

const here = path.dirname(fileURLToPath(import.meta.url))
const outDir = path.resolve(here, '../../public/email')
const chrome = process.env.CHROME || '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
// 图片有改动就升版本、换新文件名，模板随之指向新地址：Gmail 图片代理按 URL 缓存，
// 旧文件保留给已经发出的邮件。
const version = 'v2'
const locales = ['en-US', 'zh-CN', 'zh-HK', 'ja-JP']

const args = (out, url) => [
  '--headless=new',
  '--disable-gpu',
  '--hide-scrollbars',
  '--default-background-color=00000000',
  '--force-device-scale-factor=3',
  '--window-size=576,196',
  '--virtual-time-budget=3000',
  `--screenshot=${out}`,
  url,
]

for (const locale of locales) {
  const url = new URL(pathToFileURL(path.join(here, 'card.html')))
  url.search = new URLSearchParams({ l: locale, stamp: '1' }).toString()
  const out = path.join(outDir, `waitlist-pass-${version}-${locale}.png`)
  // #stage 在页面左上角，576×196 CSS px，正是模板里的显示尺寸；按 3 倍出图给高分屏。
  // headless Chrome 偶尔会在透明背景上留下一块未重绘的不透明白块，
  // 所以每张渲染两次，字节一致才采用。
  const tmp = path.join(os.tmpdir(), `waitlist-pass-${process.pid}-${locale}`)
  let ok = false
  for (let attempt = 0; attempt < 5 && !ok; attempt++) {
    execFileSync(chrome, args(`${tmp}-a.png`, url.href), { stdio: 'ignore' })
    execFileSync(chrome, args(`${tmp}-b.png`, url.href), { stdio: 'ignore' })
    ok = readFileSync(`${tmp}-a.png`).equals(readFileSync(`${tmp}-b.png`))
  }
  if (!ok) throw new Error(`${locale}：连续 5 次两次渲染结果都不一致，请手动检查输出`)
  copyFileSync(`${tmp}-a.png`, out)
  rmSync(`${tmp}-a.png`)
  rmSync(`${tmp}-b.png`)
  console.log(path.relative(process.cwd(), out))
}
