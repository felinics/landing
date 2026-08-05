import { desktopPlatformIcons, type DesktopDownloadKey } from './desktopDevice'

export type { DesktopDownloadKey } from './desktopDevice'

export type DesktopDownloadOption = {
  key: DesktopDownloadKey
  icon: string
}

type DesktopManifestName = 'latest.yml' | 'latest-mac.yml' | 'latest-linux.yml'

const DEFAULT_DESKTOP_RESOURCE_BASE_URL = 'https://desktopresource.memoh.ai'
const desktopResourceBaseUrl = (
  import.meta.env.VITE_MEMOH_DESKTOP_RESOURCE_BASE_URL || DEFAULT_DESKTOP_RESOURCE_BASE_URL
).replace(/\/+$/, '')

const desktopManifestNames: Record<DesktopDownloadKey, DesktopManifestName> = {
  macArm: 'latest-mac.yml',
  macIntel: 'latest-mac.yml',
  win: 'latest.yml',
  linuxDebAmd64: 'latest-linux.yml',
  linuxAppImageX86: 'latest-linux.yml',
  linuxRpmX86: 'latest-linux.yml',
}

const desktopArtifactPatterns: Record<DesktopDownloadKey, RegExp> = {
  macArm: /-mac-arm64\.(?:zip|dmg)$/i,
  macIntel: /-mac-x64\.(?:zip|dmg)$/i,
  win: /-win-x64-setup\.exe$/i,
  linuxDebAmd64: /-linux-amd64\.deb$/i,
  linuxAppImageX86: /-linux-x86_64\.AppImage$/i,
  linuxRpmX86: /-linux-x86_64\.rpm$/i,
}

const readYamlScalar = (rawValue: string) => {
  const value = rawValue.trim()
  if (value.startsWith('"') && value.endsWith('"')) {
    try {
      return JSON.parse(value) as string
    } catch {
      return value.slice(1, -1)
    }
  }
  if (value.startsWith("'") && value.endsWith("'")) {
    return value.slice(1, -1).replace(/''/g, "'")
  }
  return value
}

export const parseDesktopManifestFiles = (manifest: string) => {
  return manifest
    .split(/\r?\n/)
    .map((line) => line.match(/^\s*-\s+url:\s*(.+?)\s*$/)?.[1])
    .filter((value): value is string => Boolean(value))
    .map(readYamlScalar)
}

const resolveArtifactUrl = (filename: string) => {
  const resourceRoot = `${desktopResourceBaseUrl}/`
  const url = new URL(filename, resourceRoot)
  if (!url.href.startsWith(resourceRoot)) {
    throw new Error('Desktop manifest contains an invalid artifact URL')
  }
  return url.href
}

const resolveInstallerFilename = (key: DesktopDownloadKey, filename: string) => {
  if (key === 'macArm' || key === 'macIntel') {
    // latest-mac.yml is an electron-updater feed, so its macOS artifacts are
    // ZIP archives. The public download should use the matching signed DMG.
    return filename.replace(/\.zip$/i, '.dmg')
  }
  return filename
}

export const desktopDownloadOptions: DesktopDownloadOption[] = [
  { key: 'macArm', icon: desktopPlatformIcons.macArm },
  { key: 'macIntel', icon: desktopPlatformIcons.macIntel },
  { key: 'win', icon: desktopPlatformIcons.win },
  { key: 'linuxDebAmd64', icon: desktopPlatformIcons.linuxDebAmd64 },
  { key: 'linuxAppImageX86', icon: desktopPlatformIcons.linuxAppImageX86 },
  { key: 'linuxRpmX86', icon: desktopPlatformIcons.linuxRpmX86 },
]

export const resolveDesktopDownloadUrl = async (key: DesktopDownloadKey) => {
  const manifestUrl = `${desktopResourceBaseUrl}/${desktopManifestNames[key]}`
  const response = await fetch(manifestUrl, {
    cache: 'no-store',
    headers: {
      accept: 'application/yaml, text/yaml, text/plain',
    },
  })
  if (!response.ok) {
    throw new Error(`Unable to load ${desktopManifestNames[key]}`)
  }

  const filename = parseDesktopManifestFiles(await response.text())
    .find((candidate) => desktopArtifactPatterns[key].test(candidate))
  if (!filename) {
    throw new Error(`No matching Desktop artifact found in ${desktopManifestNames[key]}`)
  }
  return resolveArtifactUrl(resolveInstallerFilename(key, filename))
}
