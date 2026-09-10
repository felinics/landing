import fs from 'node:fs/promises'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import postcss from 'postcss'
import tailwind from '@tailwindcss/postcss'
import prefix from 'postcss-prefix-selector'

const directory = path.dirname(fileURLToPath(import.meta.url))
const input = '@import "tailwindcss" source(none);\n@import "./vendor/upstream.css";\n@import "./vendor/typography.css";\n@source "./";\n@source "../PricingSection.vue";\n'
const compiled = await postcss([tailwind()]).process(input, {from:path.join(directory,'input.css')})
const scoped = await postcss([prefix({prefix:'.cloud-pricing', transform(prefix, selector, prefixed) {
  if (selector === ':lang(zh) body') return `${prefix}:lang(zh)`
  if (selector === ':root' || selector === ':host' || selector === 'html' || selector === 'body') return prefix
  if (selector.startsWith(':root')) return selector.replace(':root',prefix)
  if (selector === '.dark') return `.dark ${prefix}`
  if (selector.startsWith('.dark ')) return `.dark ${prefix} ${selector.slice(6)}`
  return prefixed
}})]).process(compiled.css, {from:undefined})
await fs.writeFile(path.join(directory,'cloud-pricing.css'), '/* Generated from the copied Cloud UI stylesheet by build-css.mjs. */\n'+scoped.css+'\n.cloud-pricing { background:transparent; text-autospace:normal; }\n')
