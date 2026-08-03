export type DesktopDownloadKey =
  | 'macArm'
  | 'macIntel'
  | 'win'
  | 'linuxDebAmd64'
  | 'linuxAppImageX86'
  | 'linuxRpmX86'

type ClientHintValues = {
  architecture?: string
  platform?: string
}

type UserAgentData = {
  mobile?: boolean
  platform?: string
  getHighEntropyValues?: (hints: string[]) => Promise<ClientHintValues>
}

type DesktopNavigator = Navigator & {
  userAgentData?: UserAgentData
}

type DeviceSignals = {
  architecture?: string
  isMobileHint?: boolean
  maxTouchPoints?: number
  platform?: string
  userAgent?: string
}

export const desktopPlatformIcons: Record<DesktopDownloadKey, string> = {
  macArm: 'simple-icons:apple',
  macIntel: 'simple-icons:apple',
  win: 'simple-icons:windows11',
  linuxDebAmd64: 'simple-icons:linux',
  linuxAppImageX86: 'simple-icons:linux',
  linuxRpmX86: 'simple-icons:linux',
}

const normalize = (...parts: Array<string | undefined>) => parts.filter(Boolean).join(' ').toLowerCase()

const getNavigator = (): DesktopNavigator | undefined => {
  if (typeof navigator === 'undefined') return undefined
  return navigator as DesktopNavigator
}

const pickPreferredDownloadKey = ({
  architecture,
  isMobileHint,
  maxTouchPoints,
  platform,
  userAgent,
}: DeviceSignals): DesktopDownloadKey | undefined => {
  const deviceText = normalize(platform, userAgent)
  const architectureText = normalize(architecture)
  const looksLikeTouchMac = deviceText.includes('macintosh') && (maxTouchPoints ?? 0) > 1

  if (isMobileHint || looksLikeTouchMac || /iphone|ipad|ipod|android|mobile/.test(deviceText)) {
    return undefined
  }

  if (/win/.test(deviceText)) return 'win'

  if (/mac|darwin/.test(deviceText)) {
    if (/x86|x64|amd64|x86_64|ia32/.test(architectureText)) return 'macIntel'
    return 'macArm'
  }

  if (/ubuntu|debian|mint|pop!_os|pop os|zorin/.test(deviceText)) return 'linuxDebAmd64'
  if (/linux|x11|fedora|arch|manjaro|suse|red hat|rhel/.test(deviceText)) return 'linuxAppImageX86'

  return undefined
}

const readSignals = (nav: DesktopNavigator, hints?: ClientHintValues): DeviceSignals => ({
  architecture: hints?.architecture,
  isMobileHint: nav.userAgentData?.mobile,
  maxTouchPoints: nav.maxTouchPoints,
  platform: normalize(hints?.platform, nav.userAgentData?.platform, nav.platform),
  userAgent: nav.userAgent,
})

const readClientHints = async (nav: DesktopNavigator): Promise<ClientHintValues | undefined> => {
  try {
    return await nav.userAgentData?.getHighEntropyValues?.(['architecture', 'platform'])
  } catch {
    return undefined
  }
}

export const getInitialDesktopDownloadKey = () => {
  const nav = getNavigator()
  if (!nav) return undefined

  return pickPreferredDownloadKey(readSignals(nav))
}

export const resolvePreferredDesktopDownloadKey = async () => {
  const nav = getNavigator()
  if (!nav) return undefined

  const hints = await readClientHints(nav)
  return pickPreferredDownloadKey(readSignals(nav, hints))
}
