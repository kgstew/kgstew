import test from 'node:test'
import assert from 'node:assert/strict'
import { applyDisclosure, assertNoRedactedTerms, deepFreeze } from '../disclosure.js'

const project = (overrides = {}) => ({
  slug: 'x',
  title: 'A project',
  summary: '',
  outcome: '',
  role: '',
  body: '',
  disclosure: 'open',
  client: 'Acme Corp',
  destination: 'Kew Gardens',
  links: [{ label: 'Site', url: 'https://acme.example' }],
  collaborators: [{ name: 'Alex', credit: 'Steel', url: 'https://alex.example' }],
  ...overrides,
})

test('open passes every field through', () => {
  const p = applyDisclosure(project())
  assert.equal(p.client, 'Acme Corp')
  assert.equal(p.destination, 'Kew Gardens')
})

test('embargoed returns null — it does not exist, rather than existing hidden', () => {
  assert.equal(applyDisclosure(project({ disclosure: 'embargoed' })), null)
})

test('work-only deletes the keys rather than nulling them', () => {
  const p = applyDisclosure(project({ disclosure: 'work-only' }))

  // The distinction that matters: a component cannot render a key that is
  // absent, but it can very easily render `null` by accident.
  assert.equal('client' in p, false)
  assert.equal('destination' in p, false)
  assert.equal('links' in p, false)
  assert.equal(p.client, undefined)
})

test('work-only strips collaborator URLs, which leak the destination too', () => {
  const p = applyDisclosure(project({ disclosure: 'work-only' }))
  assert.equal(p.collaborators[0].name, 'Alex')
  assert.equal(p.collaborators[0].credit, 'Steel')
  assert.equal('url' in p.collaborators[0], false)
})

test('work-only retains the disclosure level so the UI can say so', () => {
  assert.equal(applyDisclosure(project({ disclosure: 'work-only' })).disclosure, 'work-only')
})

test('results are deeply frozen, so nothing downstream can re-attach a field', () => {
  const p = applyDisclosure(project({ disclosure: 'work-only' }))
  assert.throws(() => {
    'use strict'
    p.client = 'Acme Corp'
  }, TypeError)
  assert.throws(() => {
    p.collaborators[0].url = 'https://alex.example'
  }, TypeError)
})

test('deepFreeze tolerates cycles and primitives', () => {
  const a = { name: 'a' }
  a.self = a
  assert.doesNotThrow(() => deepFreeze(a))
  assert.doesNotThrow(() => deepFreeze(null))
})

// --- leak scan -------------------------------------------------------------

const asset = (over = {}) => ({ alt: '', caption: '', credit: '', source: 'IMG_1.HEIC', ...over })

test('a redaction term in prose throws', () => {
  assert.throws(
    () => assertNoRedactedTerms(project({ body: 'Built for Acme Corp.' }), [], ['Acme Corp']),
    /Acme Corp/
  )
})

test('a redaction term in an asset CAPTION throws — the path nothing else covers', () => {
  assert.throws(
    () =>
      assertNoRedactedTerms(project(), [asset({ caption: 'Installed at Kew Gardens' })], [
        'Kew Gardens',
      ]),
    /Kew Gardens/
  )
})

test('a redaction term in alt text throws', () => {
  assert.throws(
    () => assertNoRedactedTerms(project(), [asset({ alt: 'The Kew Gardens lobby' })], ['Kew Gardens']),
    /Kew Gardens/
  )
})

test('the scan is case-insensitive', () => {
  assert.throws(
    () => assertNoRedactedTerms(project({ body: 'built for acme corp' }), [], ['Acme Corp']),
    /Acme Corp/
  )
})

test('clean content passes, and an empty denylist is a no-op', () => {
  assert.doesNotThrow(() => assertNoRedactedTerms(project(), [asset()], ['Nothing Here']))
  assert.doesNotThrow(() => assertNoRedactedTerms(project(), [asset()], []))
})
