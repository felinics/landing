import assert from 'node:assert/strict'
import test from 'node:test'

import { WIN_RATE, ENDS_AT, POOL, STARTS_AT, draw, enter, memoryStore, pickPrize, poolStatus } from './lottery.js'

const LIVE = STARTS_AT + 1000

test('WIN_RATE is 20%', () => assert.equal(WIN_RATE, 0.2))

test('pickPrize respects the 20% win rate boundary', () => {
  const left = { pro: 1, go: 24 }
  assert.equal(pickPrize(left, () => 0.2), 'none')
  assert.notEqual(pickPrize(left, () => 0.19), 'none')
  assert.equal(pickPrize(left, (() => { const v = [0.1, 0.01]; return () => v.shift() })()), 'pro')
  assert.equal(pickPrize(left, (() => { const v = [0.1, 0.5]; return () => v.shift() })()), 'go')
  assert.equal(pickPrize({ pro: 0, go: 0 }, () => 0), 'none')
})

test('win rate is about 20% over many draws', () => {
  let wins = 0
  const n = 60000
  for (let i = 0; i < n; i++) if (pickPrize({ pro: 1, go: 24 }) !== 'none') wins++
  assert.ok(Math.abs(wins / n - 0.2) < 0.01, `rate ${wins / n}`)
})

test('an email draws once and must enter first', async () => {
  const store = memoryStore()
  await assert.rejects(draw(store, 'a@b.co'), { status: 400 })
  await assert.rejects(enter(store, 'not-an-email'), { status: 400 })
  await enter(store, ' A@B.co ', {}, LIVE)
  const first = await draw(store, 'a@b.co', { rand: () => 0, now: LIVE })
  assert.equal(first.result.prize, 'pro')
  assert.match(first.result.code, /^1024-[A-Z2-9]{6}$/)
  await assert.rejects(draw(store, 'a@b.co', { now: LIVE }), (e) => e.status === 409 && e.body.result.code === first.result.code)
  const again = await enter(store, 'a@b.co')
  assert.equal(again.result.code, first.result.code)
})

test('pool never exceeds 1 Pro + 24 Go and then reports sold out', async () => {
  const store = memoryStore()
  const won = { pro: 0, go: 0 }
  for (let i = 0; ; i++) {
    const email = `u${i}@x.io`
    await enter(store, email, {}, LIVE)
    try {
      const { result } = await draw(store, email, { rand: () => 0, now: LIVE })
      won[result.prize]++
    } catch (e) {
      assert.equal(e.status, 410)
      break
    }
  }
  assert.deepEqual(won, POOL)
  assert.equal(poolStatus(await store.all()).soldOut, true)
  const late = await enter(store, 'late@x.io', {}, LIVE)
  assert.equal(late.soldOut, true)
  assert.equal(late.result, undefined)
})

test('draws only inside Oct 24 – Oct 31 (Beijing time)', async () => {
  assert.equal(new Date(STARTS_AT).toISOString(), '2026-10-23T16:00:00.000Z')
  assert.equal(new Date(ENDS_AT).toISOString(), '2026-10-31T16:00:00.000Z')
  const store = memoryStore()
  const early = await enter(store, 'early@x.io', {}, STARTS_AT - 1)
  assert.equal(early.notStarted, true)
  assert.equal(await store.get('early@x.io'), undefined)

  await enter(store, 'w@x.io', {}, LIVE)
  await enter(store, 'slow@x.io', {}, LIVE)
  const { result } = await draw(store, 'w@x.io', { rand: () => 0, now: LIVE })
  await assert.rejects(draw(store, 'slow@x.io', { now: ENDS_AT }), { status: 403 })

  const after = await enter(store, 'w@x.io', {}, ENDS_AT + 1)
  assert.equal(after.ended, true)
  assert.equal(after.result.code, result.code)
  const newcomer = await enter(store, 'new@x.io', {}, ENDS_AT + 1)
  assert.equal(newcomer.result, undefined)
  assert.equal(await store.get('new@x.io'), undefined)
})
