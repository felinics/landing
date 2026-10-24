// Memoh 1024 lottery — draw rules shared by the landing dev mock and the
// admin.memoh.net backend. Storage-agnostic: callers pass in a `store`.
//
// API contract (all JSON, base: https://admin.memoh.net/api/events/1024):
//   GET  /status          -> { remaining: { pro, go }, soldOut, startsAt, endsAt, notStarted, ended }
//   POST /entry  {email}  -> { remaining, soldOut, result? }   registers the email
//   POST /draw   {email}  -> { remaining, soldOut, result }    400 bad email / no entry
//                                                              409 already drawn (returns result)
//                                                              410 pool empty
//                                                              403 outside the event window
//   result = { prize: 'pro' | 'go' | 'none', code?, at }
//
// Admin (behind admin auth): GET /admin/entries -> [{ email, prize, code, at, createdAt, ip, userAgent, redeemed }]

export const POOL = { pro: 1, go: 24 }
export const WIN_RATE = 0.2
// Oct 24 00:00 – Oct 31 23:59:59, Beijing time.
export const STARTS_AT = Date.parse('2026-10-24T00:00:00+08:00')
export const ENDS_AT = Date.parse('2026-11-01T00:00:00+08:00')

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const CODE_ALPHABET = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'

export const normalizeEmail = (email) => String(email ?? '').trim().toLowerCase()
export const isValidEmail = (email) => EMAIL_RE.test(email) && email.length <= 254

export function remaining(entries) {
  const left = { ...POOL }
  for (const e of entries) {
    if (e.prize === 'pro' || e.prize === 'go') left[e.prize]--
  }
  return { pro: Math.max(0, left.pro), go: Math.max(0, left.go) }
}

export function poolStatus(entries, now = Date.now()) {
  const left = remaining(entries)
  return {
    remaining: left,
    soldOut: left.pro + left.go === 0,
    startsAt: STARTS_AT,
    endsAt: ENDS_AT,
    notStarted: now < STARTS_AT,
    ended: now >= ENDS_AT,
  }
}

export function makeCode(random = cryptoRandomBytes) {
  const bytes = random(6)
  return `1024-${Array.from(bytes, b => CODE_ALPHABET[b % CODE_ALPHABET.length]).join('')}`
}

function cryptoRandomBytes(n) {
  return crypto.getRandomValues(new Uint8Array(n))
}

function cryptoRandomFloat() {
  return crypto.getRandomValues(new Uint32Array(1))[0] / 2 ** 32
}

// Win with WIN_RATE; a winner gets one prize picked uniformly from what is
// left, so the single Pro has the same chance as any one Go ticket.
export function pickPrize(left, rand = cryptoRandomFloat) {
  const total = left.pro + left.go
  if (total === 0 || rand() >= WIN_RATE) return 'none'
  return rand() * total < left.pro ? 'pro' : 'go'
}

export class LotteryError extends Error {
  constructor(status, message, body) {
    super(message)
    this.status = status
    this.body = body
  }
}

const publicResult = (entry) => entry?.prize
  ? { prize: entry.prize, ...(entry.code ? { code: entry.code } : {}), at: entry.at }
  : undefined

// `store` must provide: all() -> entries[], get(email), put(entry).
// The backend must run draw() inside a transaction / single-writer section so
// two concurrent draws can't both take the last prize.
export async function enter(store, rawEmail, meta = {}, now = Date.now()) {
  const email = normalizeEmail(rawEmail)
  if (!isValidEmail(email)) throw new LotteryError(400, 'Invalid email')
  let entry = await store.get(email)
  const status = poolStatus(await store.all(), now)
  // Outside the window an email can still look up its result but not join.
  if (!entry && (status.notStarted || status.ended)) return status
  if (!entry) {
    entry = { email, prize: null, code: null, at: null, createdAt: Date.now(), redeemed: false, ...meta }
    await store.put(entry)
  }
  return { ...poolStatus(await store.all(), now), result: publicResult(entry) }
}

export async function draw(store, rawEmail, opts = {}) {
  const now = opts.now ?? Date.now()
  const email = normalizeEmail(rawEmail)
  const entry = await store.get(email)
  if (!entry) throw new LotteryError(400, 'Submit your email first')
  const status = poolStatus(await store.all(), now)
  if (entry.prize) {
    throw new LotteryError(409, 'This email has already drawn', { ...status, result: publicResult(entry) })
  }
  if (status.notStarted) throw new LotteryError(403, 'The event has not started yet', status)
  if (status.ended) throw new LotteryError(403, 'The event has ended', status)
  if (status.soldOut) throw new LotteryError(410, 'All prizes are gone', status)

  const prize = pickPrize(status.remaining, opts.rand)
  const next = { ...entry, prize, code: prize === 'none' ? null : makeCode(opts.randomBytes), at: now }
  await store.put(next)
  return { ...poolStatus(await store.all(), now), result: publicResult(next) }
}

export function memoryStore(initial = []) {
  const map = new Map(initial.map(e => [e.email, e]))
  return {
    all: async () => [...map.values()],
    get: async (email) => map.get(email),
    put: async (entry) => { map.set(entry.email, entry) },
  }
}
