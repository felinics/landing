export type Prize = 'pro' | 'go' | 'none'
export interface Entry {
  email: string
  prize: Prize | null
  code?: string | null
  at?: number | null
  createdAt?: number
  redeemed?: boolean
  [meta: string]: unknown
}
export interface Store {
  all(): Promise<Entry[]>
  get(email: string): Promise<Entry | undefined>
  put(entry: Entry): Promise<void>
}
export interface PoolStatus {
  remaining: { pro: number, go: number }
  soldOut: boolean
  startsAt: number
  endsAt: number
  notStarted: boolean
  ended: boolean
}
export interface DrawResult { prize: Prize, code?: string, at: number }
export interface DrawOptions { rand?: () => number, randomBytes?: (n: number) => Uint8Array, now?: number }

export const POOL: { pro: number, go: number }
export const WIN_RATE: number
export const STARTS_AT: number
export const ENDS_AT: number
export function normalizeEmail(email: unknown): string
export function isValidEmail(email: string): boolean
export function remaining(entries: Partial<Entry>[]): { pro: number, go: number }
export function poolStatus(entries: Partial<Entry>[], now?: number): PoolStatus
export function makeCode(random?: (n: number) => Uint8Array): string
export function pickPrize(left: { pro: number, go: number }, rand?: () => number): Prize
export class LotteryError extends Error {
  status: number
  body?: Record<string, unknown>
  constructor(status: number, message: string, body?: Record<string, unknown>)
}
export function enter(store: Store, email: unknown, meta?: Record<string, unknown>, now?: number): Promise<PoolStatus & { result?: DrawResult }>
export function draw(store: Store, email: unknown, opts?: DrawOptions): Promise<PoolStatus & { result: DrawResult }>
export function memoryStore(initial?: Partial<Entry>[]): Store
