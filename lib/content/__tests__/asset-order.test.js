import test from 'node:test'
import assert from 'node:assert/strict'
import { sortAssets, compareAssets } from '../../asset-order.js'

test('an all-digit asset id cannot jump the queue', () => {
  // V8 treats integer-like keys as array indices and hoists them in
  // Object.values regardless of insertion order. Asset ids are ten hex chars,
  // so roughly one in three hundred is all-digit — which is often enough that
  // across a few hundred assets a random detail shot lands above the heroes.
  const manifest = {}
  manifest['ef98d42090'] = { id: 'ef98d42090', role: 'hero', order: 1, source: 'hero.jpg' }
  manifest['4029581037'] = { id: '4029581037', role: 'detail', order: 30, source: 'detail.jpg' }

  assert.equal(
    Object.values(manifest)[0].role,
    'detail',
    'sanity: raw Object.values really does hoist the numeric key'
  )
  assert.equal(sortAssets(manifest)[0].role, 'hero')
})

test('roles sort hero, then process, then detail', () => {
  const out = sortAssets({
    c: { role: 'detail', source: 'c' },
    a: { role: 'hero', source: 'a' },
    b: { role: 'process', source: 'b' },
  })
  assert.deepEqual(
    out.map((a) => a.role),
    ['hero', 'process', 'detail']
  )
})

test('order breaks ties within a role', () => {
  const out = sortAssets({
    a: { role: 'hero', order: 5, source: 'a' },
    b: { role: 'hero', order: 1, source: 'b' },
  })
  assert.deepEqual(
    out.map((a) => a.source),
    ['b', 'a']
  )
})

test('assets without an order sort after those with one', () => {
  const out = sortAssets({
    a: { role: 'hero', source: 'a' },
    b: { role: 'hero', order: 99, source: 'b' },
  })
  assert.deepEqual(
    out.map((a) => a.source),
    ['b', 'a']
  )
})

test('capture date then filename break remaining ties, so output is stable', () => {
  const out = sortAssets({
    a: { role: 'detail', capturedAt: '2024-08-26T10:00:00', source: 'b.jpg' },
    b: { role: 'detail', capturedAt: '2024-08-25T10:00:00', source: 'a.jpg' },
  })
  assert.deepEqual(
    out.map((a) => a.source),
    ['a.jpg', 'b.jpg']
  )
})

test('an unknown role sorts last rather than throwing', () => {
  const out = sortAssets({ a: { role: 'mystery', source: 'a' }, b: { role: 'detail', source: 'b' } })
  assert.equal(out[0].role, 'detail')
})

test('empty and missing input are safe', () => {
  assert.deepEqual(sortAssets({}), [])
  assert.deepEqual(sortAssets(undefined), [])
})

test('the comparator is a valid total order', () => {
  const a = { role: 'hero', order: 1, source: 'a' }
  const b = { role: 'hero', order: 1, source: 'a' }
  assert.equal(compareAssets(a, b), 0)
})
