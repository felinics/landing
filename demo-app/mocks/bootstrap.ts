import { DemoTerminalSocket } from './terminal'
import { demoFetch } from './http'

// The embedded app must never share auth, preferences or caches with its host.
// A fresh visit starts a fresh demo; settings mutations remain valid for the visit.
class DemoStorage implements Storage {
  private values = new Map<string, string>()
  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(String(key)) ?? null }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  removeItem(key: string) { this.values.delete(String(key)) }
  setItem(key: string, value: string) { this.values.set(String(key), String(value)) }
}
Object.defineProperty(window, 'localStorage', { value: new DemoStorage() })
Object.defineProperty(window, 'sessionStorage', { value: new DemoStorage() })
localStorage.setItem('token', 'memoh-browser-demo')
localStorage.setItem('theme', 'dark')
localStorage.setItem('workspace-workbench-open', 'true')
localStorage.setItem('vueuse-color-scheme', 'dark')
document.documentElement.classList.add('dark')
document.documentElement.style.colorScheme = 'dark'
const locale = new URLSearchParams(location.search).get('lang') === 'zh' ? 'zh' : 'en'
localStorage.setItem('language', locale)
sessionStorage.setItem('chat-bot-id', 'bot-memoh')
sessionStorage.setItem('chat-session-id', 'session-welcome')
sessionStorage.setItem('chat-explicit-selection', 'true')
window.fetch = demoFetch
// Chat gets a protocol-compatible in-memory transport. Other runtime sockets
// fail locally instead of ever contacting a server.
window.WebSocket = DemoTerminalSocket as unknown as typeof WebSocket
window.XMLHttpRequest = class {
  constructor() { throw new Error('Demo uploads use the local fetch transport.') }
} as unknown as typeof XMLHttpRequest
window.EventSource = class {
  constructor() { throw new Error('Demo streams use the local fetch transport.') }
} as unknown as typeof EventSource
void import('../apps/web/src/main')
