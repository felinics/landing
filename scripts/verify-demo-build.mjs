import { access, readFile } from 'node:fs/promises'
import { resolve } from 'node:path'

// A missing demo falls through to the landing site's 404 inside the iframe.
const html = await readFile(resolve('dist/memoh-demo/index.html'), 'utf8')
const assets = [...html.matchAll(/(?:src|href)="(\/memoh-demo\/[^"?#]+)(?:[?#][^"]*)?"/g)]
if (!assets.some(([, asset]) => asset.endsWith('.js'))) {
  throw new Error('Built demo is missing its JavaScript entry')
}
for (const [, asset] of assets) {
  await access(resolve('dist', `.${asset}`))
}
console.log('Verified deployed demo entry and referenced assets')
