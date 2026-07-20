const RELEASE_REPO = 'memohai/Memoh'
const DOWNLOAD_PREFIX = '/downloads/desktop'
const LATEST_TTL_SECONDS = 300
const ASSET_TTL_SECONDS = 60 * 60 * 24 * 30

const assetPattern = (slug) => new RegExp(`^Memoh-Local-[0-9][0-9A-Za-z.-]*-${slug.replaceAll('.', '\\.')}$`, 'i')

const ASSETS = {
  'mac-arm64.dmg': {
    key: 'macArm',
    pattern: assetPattern('mac-arm64.dmg'),
  },
  'mac-x64.dmg': {
    key: 'macIntel',
    pattern: assetPattern('mac-x64.dmg'),
  },
  'win-x64-setup.exe': {
    key: 'win',
    pattern: assetPattern('win-x64-setup.exe'),
  },
  'linux-amd64.deb': {
    key: 'linuxDebAmd64',
    pattern: assetPattern('linux-amd64.deb'),
  },
  'linux-x86_64.AppImage': {
    key: 'linuxAppImageX86',
    pattern: assetPattern('linux-x86_64.AppImage'),
  },
}

const sanitizeFileNamePart = (value) => {
  return String(value).replace(/[\\/:*?"<>|]+/g, '-').replace(/\s+/g, '-')
}

const downloadFileName = (tag, slug) => {
  return `Memoh-Local-${sanitizeFileNamePart(tag)}-${sanitizeFileNamePart(slug)}`
}

const githubAssetFileName = (tag, slug) => {
  const version = tag.replace(/^v/i, '')
  return `Memoh-Local-${version}-${slug}`
}

const githubAssetUrl = (repo, tag, slug) => {
  return `https://github.com/${repo}/releases/download/${encodeURIComponent(tag)}/${encodeURIComponent(githubAssetFileName(tag, slug))}`
}

const jsonResponse = (body, init = {}) => {
  return new Response(JSON.stringify(body, null, 2), {
    ...init,
    headers: {
      'content-type': 'application/json; charset=utf-8',
      ...init.headers,
    },
  })
}

const notFound = () => new Response('Not found', { status: 404 })

const githubHeaders = (env, accept = 'application/vnd.github+json') => {
  const headers = {
    accept,
    'user-agent': 'memoh-landing-download-proxy',
    'x-github-api-version': '2022-11-28',
  }

  if (env.GITHUB_TOKEN) {
    headers.authorization = `Bearer ${env.GITHUB_TOKEN}`
  }

  return headers
}

const githubFetch = async (url, env, accept) => {
  let response = await fetch(url, {
    headers: githubHeaders(env, accept),
    redirect: 'follow',
  })

  // Token 过期/失效不应让下载功能整体瘫痪(2026-07 曾因此全站 /downloads/* 502):
  // 公开仓库的 release 元数据匿名即可读,token 被拒(401)或触限(403)时去掉
  // Authorization 重试一次。匿名限流 60 次/时/IP,由 release 缓存(5 分钟)稀释,
  // 实际请求量远低于阈值。token 换新后此路径自动不再触发。
  if (!response.ok && env.GITHUB_TOKEN && (response.status === 401 || response.status === 403)) {
    response = await fetch(url, {
      headers: githubHeaders({ ...env, GITHUB_TOKEN: undefined }, accept),
      redirect: 'follow',
    })
  }

  if (!response.ok) {
    const detail = await response.text().catch(() => '')
    const message = detail ? ` ${detail.slice(0, 240)}` : ''
    throw new Error(`GitHub request failed: ${response.status} ${url}${message}`)
  }

  return response
}

const releaseTimestamp = (release) => {
  return Date.parse(release.published_at || release.created_at || '') || 0
}

const pickLatestRelease = (releases) => {
  return releases
    .filter((release) => !release.draft)
    .sort((a, b) => releaseTimestamp(b) - releaseTimestamp(a))[0]
}

const getLatestRelease = async (env, ctx) => {
  const repo = env.MEMOH_RELEASE_REPO || RELEASE_REPO
  const cache = caches.default
  const cacheKey = new Request(`https://memoh.internal/downloads/latest-release/${encodeURIComponent(repo)}`)
  const cached = await cache.match(cacheKey)
  if (cached) return cached.json()

  const response = await githubFetch(`https://api.github.com/repos/${repo}/releases?per_page=30`, env)
  const latest = pickLatestRelease(await response.json())

  if (!latest) {
    throw new Error(`No published releases found for ${repo}`)
  }

  ctx.waitUntil(cache.put(cacheKey, jsonResponse(latest, {
    headers: cacheHeaders(LATEST_TTL_SECONDS),
  })))

  return latest
}

const getRelease = async (tag, env, ctx) => {
  if (tag === 'latest') {
    return getLatestRelease(env, ctx)
  }

  const repo = env.MEMOH_RELEASE_REPO || RELEASE_REPO
  const response = await githubFetch(`https://api.github.com/repos/${repo}/releases/tags/${encodeURIComponent(tag)}`, env)

  return response.json()
}

const findAsset = (release, slug) => {
  const definition = ASSETS[slug]
  if (!definition) return undefined

  const asset = release.assets?.find((candidate) => definition.pattern.test(candidate.name))
  if (!asset) return undefined

  return {
    ...definition,
    slug,
    asset,
  }
}

const buildManifest = (requestUrl, release, repo) => {
  const assets = {}

  for (const [slug, definition] of Object.entries(ASSETS)) {
    const match = findAsset(release, slug)
    if (!match) continue

    const { asset } = match

    assets[definition.key] = {
      path: `${requestUrl.origin}${DOWNLOAD_PREFIX}/${encodeURIComponent(release.tag_name)}/${slug}`,
      name: downloadFileName(release.tag_name, slug),
      originalName: asset.name,
      size: asset.size,
      contentType: asset.content_type,
      updatedAt: asset.updated_at,
    }
  }

  return {
    repo,
    name: release.name,
    prerelease: Boolean(release.prerelease),
    tag: release.tag_name,
    sourceUrl: release.html_url,
    publishedAt: release.published_at,
    assets,
  }
}

const cacheHeaders = (seconds, extra = {}) => ({
  'cache-control': `public, max-age=${seconds}, s-maxage=${seconds}`,
  ...extra,
})

const withCacheStatus = (response, status) => {
  const cachedResponse = new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers: response.headers,
  })
  cachedResponse.headers.set('x-memoh-cache', status)
  return cachedResponse
}

const proxyAsset = async (request, env, ctx, tag, slug) => {
  const cache = caches.default
  const cacheKey = new Request(request.url, { method: 'GET' })

  if (request.method === 'GET' && !request.headers.has('range')) {
    const cached = await cache.match(cacheKey)
    if (cached) return withCacheStatus(cached, 'HIT')
  }

  if (!ASSETS[slug]) return notFound()

  const repo = env.MEMOH_RELEASE_REPO || RELEASE_REPO
  const assetResponse = await fetch(githubAssetUrl(repo, tag, slug), {
    method: request.method === 'HEAD' ? 'HEAD' : 'GET',
    headers: {
      'user-agent': 'memoh-landing-download-proxy',
      ...(request.headers.has('range') ? { range: request.headers.get('range') } : {}),
    },
    redirect: 'follow',
  })

  if (!assetResponse.ok && assetResponse.status !== 206) {
    return new Response('Unable to fetch release asset', { status: assetResponse.status })
  }

  const response = new Response(request.method === 'HEAD' ? null : assetResponse.body, {
    status: assetResponse.status,
    statusText: assetResponse.statusText,
    headers: assetResponse.headers,
  })
  response.headers.set('cache-control', `public, max-age=${ASSET_TTL_SECONDS}, immutable`)
  response.headers.set('content-disposition', `attachment; filename="${downloadFileName(tag, slug)}"`)
  response.headers.set('x-memoh-release-tag', tag)
  response.headers.set('x-memoh-cache', 'MISS')
  response.headers.delete('set-cookie')

  if (request.method === 'GET' && !request.headers.has('range')) {
    ctx.waitUntil(cache.put(cacheKey, response.clone()))
  }

  return response
}

const parsePath = (pathname) => {
  if (!pathname.startsWith(`${DOWNLOAD_PREFIX}/`)) return undefined

  const rest = pathname.slice(DOWNLOAD_PREFIX.length + 1)
  const [tag, ...fileParts] = rest.split('/').filter(Boolean)
  const file = fileParts.join('/')

  if (!tag || !file) return undefined
  return { tag: decodeURIComponent(tag), file: decodeURIComponent(file) }
}

export default {
  async fetch(request, env, ctx) {
    if (!['GET', 'HEAD'].includes(request.method)) {
      return new Response('Method not allowed', {
        status: 405,
        headers: { allow: 'GET, HEAD' },
      })
    }

    try {
      const url = new URL(request.url)
      const parsed = parsePath(url.pathname)
      if (!parsed) return notFound()

      if (parsed.file === 'manifest.json') {
        const cache = caches.default
        const cacheKey = new Request(request.url, { method: 'GET' })
        const cached = await cache.match(cacheKey)
        if (cached) return withCacheStatus(cached, 'HIT')

        const release = await getRelease(parsed.tag, env, ctx)
        const response = jsonResponse(request.method === 'HEAD' ? undefined : buildManifest(url, release, env.MEMOH_RELEASE_REPO || RELEASE_REPO), {
          headers: cacheHeaders(parsed.tag === 'latest' ? LATEST_TTL_SECONDS : ASSET_TTL_SECONDS, {
            'x-memoh-cache': 'MISS',
          }),
        })
        if (request.method === 'GET') {
          ctx.waitUntil(cache.put(cacheKey, response.clone()))
        }
        return response
      }

      if (!ASSETS[parsed.file]) return notFound()

      if (parsed.tag === 'latest') {
        const release = await getRelease('latest', env, ctx)
        const redirectUrl = new URL(request.url)
        redirectUrl.pathname = `${DOWNLOAD_PREFIX}/${encodeURIComponent(release.tag_name)}/${parsed.file}`

        return new Response(null, {
          status: 302,
          headers: cacheHeaders(LATEST_TTL_SECONDS, {
            location: redirectUrl.toString(),
            'x-memoh-release-tag': release.tag_name,
          }),
        })
      }

      return proxyAsset(request, env, ctx, parsed.tag, parsed.file)
    } catch (error) {
      return new Response(error instanceof Error ? error.message : 'Unexpected error', { status: 502 })
    }
  },
}
