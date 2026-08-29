import assert from 'node:assert/strict'
import test from 'node:test'

import worker from './desktop-download-proxy.js'

const release = {
  name: 'v0.16.0',
  tag_name: 'v0.16.0',
  html_url: 'https://github.com/felinics/Memoh/releases/tag/v0.16.0',
  published_at: '2026-07-11T16:56:45Z',
  assets: [
    {
      name: 'Memoh-0.16.0-mac-arm64.dmg',
      browser_download_url: 'https://downloads.example.test/assets/mac-arm64',
      size: 123,
      content_type: 'application/x-apple-diskimage',
      updated_at: '2026-07-11T16:56:45Z',
    },
    {
      name: 'Any-Future-Product-0.16.0-linux-amd64.deb',
      browser_download_url: 'https://downloads.example.test/assets/linux-amd64',
      size: 456,
      content_type: 'application/vnd.debian.binary-package',
      updated_at: '2026-07-11T16:56:45Z',
    },
  ],
}

const createRuntime = () => {
  const cacheEntries = new Map()
  globalThis.caches = {
    default: {
      async match(request) {
        const response = cacheEntries.get(request.url)
        return response?.clone()
      },
      async put(request, response) {
        cacheEntries.set(request.url, response.clone())
      },
    },
  }

  const pending = []
  return {
    ctx: {
      waitUntil(promise) {
        pending.push(promise)
      },
    },
    flush: () => Promise.all(pending),
  }
}

const requestUrl = (input) => input instanceof Request ? input.url : String(input)

test('falls back to the public API and discovers assets without a product-name prefix', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  const calls = []
  globalThis.fetch = async (input, init = {}) => {
    const url = requestUrl(input)
    calls.push({ url, authorization: init.headers?.authorization })

    if (calls.length === 1) {
      return new Response('Bad credentials', { status: 401 })
    }

    return Response.json([release])
  }

  const runtime = createRuntime()
  const response = await worker.fetch(
    new Request('https://memoh.ai/downloads/desktop/latest/manifest.json'),
    { MEMOH_RELEASE_REPO: 'felinics/Memoh', GITHUB_TOKEN: 'expired-token' },
    runtime.ctx,
  )
  await runtime.flush()

  assert.equal(response.status, 200)
  assert.deepEqual(calls.map((call) => call.authorization), [
    'Bearer expired-token',
    undefined,
  ])

  const manifest = await response.json()
  assert.equal(manifest.tag, 'v0.16.0')
  assert.equal(manifest.assets.macArm.name, 'Memoh-0.16.0-mac-arm64.dmg')
  assert.equal(manifest.assets.linuxDebAmd64.name, 'Any-Future-Product-0.16.0-linux-amd64.deb')
})

test('proxies the asset URL returned by GitHub instead of constructing a filename', async (t) => {
  const originalFetch = globalThis.fetch
  t.after(() => {
    globalThis.fetch = originalFetch
  })

  const calls = []
  globalThis.fetch = async (input) => {
    const url = requestUrl(input)
    calls.push(url)

    if (url.includes('/releases/tags/v0.16.0')) {
      return Response.json(release)
    }

    if (url === release.assets[0].browser_download_url) {
      return new Response('installer-bytes', {
        headers: { 'content-type': 'application/x-apple-diskimage' },
      })
    }

    return new Response('Unexpected URL', { status: 500 })
  }

  const runtime = createRuntime()
  const response = await worker.fetch(
    new Request('https://memoh.ai/downloads/desktop/v0.16.0/mac-arm64.dmg'),
    { MEMOH_RELEASE_REPO: 'felinics/Memoh' },
    runtime.ctx,
  )
  await runtime.flush()

  assert.equal(response.status, 200)
  assert.equal(await response.text(), 'installer-bytes')
  assert.equal(response.headers.get('content-disposition'), 'attachment; filename="Memoh-0.16.0-mac-arm64.dmg"')
  assert.deepEqual(calls, [
    'https://api.github.com/repos/felinics/Memoh/releases/tags/v0.16.0',
    release.assets[0].browser_download_url,
  ])
})
