import test from 'node:test'
import assert from 'node:assert/strict'
import { parseProject, parsePost } from '../schema.js'

const base = {
  title: 'Fable Bound',
  summary: 'A viking ship that rocked when you rowed it.',
  context: 'art',
  disciplines: ['fabrication'],
  started: '2023-11',
  disclosure: 'open',
}

const parse = (overrides = {}) =>
  parseProject({ ...base, ...overrides }, 'body', 'content/work/x.mdx', 'x')

test('a valid project parses', () => {
  const p = parse()
  assert.equal(p.slug, 'x')
  assert.equal(p.disclosure, 'open')
  assert.equal(p.ended, 'ongoing', 'a missing end date means ongoing, not unknown')
})

test('unknown discipline throws, naming the file and field', () => {
  assert.throws(() => parse({ disciplines: ['welding'] }), (err) => {
    assert.match(err.message, /content\/work\/x\.mdx/)
    assert.match(err.message, /disciplines\[0\]/)
    return true
  })
})

test('unknown context throws', () => {
  assert.throws(() => parse({ context: 'personal' }), /context/)
})

test('unknown accent throws', () => {
  assert.throws(() => parse({ accent: 'chartreuse' }), /accent/)
})

test('missing disclosure throws rather than defaulting', () => {
  const { disclosure, ...withoutDisclosure } = base
  assert.throws(
    () => parseProject(withoutDisclosure, 'body', 'f.mdx', 'x'),
    /disclosure/,
    'a silent default would train you to omit the field'
  )
})

test('unrecognised disclosure level throws', () => {
  assert.throws(() => parse({ disclosure: 'private' }), /disclosure/)
})

test('client under work-only is a validation error, not an elision', () => {
  assert.throws(
    () => parse({ disclosure: 'work-only', client: 'Acme Corp' }),
    (err) => {
      assert.match(err.message, /repo is public/, 'the message should say why')
      assert.match(err.message, /clientDescriptor/, 'and point at the alternative')
      return true
    }
  )
})

test('destination under work-only throws', () => {
  assert.throws(() => parse({ disclosure: 'work-only', destination: 'Kew Gardens' }), /destination/)
})

test('clientDescriptor is permitted under work-only', () => {
  const p = parse({ disclosure: 'work-only', clientDescriptor: 'a botanic garden' })
  assert.equal(p.clientDescriptor, 'a botanic garden')
})

test('summary is required to publish but not to draft', () => {
  const { summary, ...noSummary } = base
  assert.throws(() => parseProject(noSummary, 'b', 'f.mdx', 'x'), /summary/)
  assert.doesNotThrow(() => parseProject({ ...noSummary, status: 'draft' }, 'b', 'f.mdx', 'x'))
})

// `card` was the old name for this field. A stale card in frontmatter would
// otherwise be ignored in silence and the project would publish with no listing
// line at all, which is the failure this rename could most easily cause.
test('a leftover card field is rejected by name', () => {
  assert.throws(() => parse({ card: 'A stale hook.' }), /renamed?|rename|summary/i)
})

test('an over-long summary throws with its length', () => {
  assert.throws(() => parse({ summary: 'x'.repeat(141) }), /141 chars/)
})

test('dates must be quoted, zero-padded YYYY-MM', () => {
  assert.throws(() => parse({ started: '2023-4' }), /started/)
  assert.throws(() => parse({ started: '2023-11-04' }), /started/)
  assert.doesNotThrow(() => parse({ started: '2023-04' }))
})

test('empty disciplines throws', () => {
  assert.throws(() => parse({ disciplines: [] }), /disciplines/)
})

test('weight defaults to the back of the queue', () => {
  assert.equal(parse().weight, 1000)
  assert.equal(parse({ weight: 10 }).weight, 10)
})

test('posts parse and derive a month from a full date', () => {
  const p = parsePost(
    { title: 'The Idea', date: '2024-01-10', project: 'fable-bound' },
    'body',
    'content/writing/idea.mdx',
    'idea'
  )
  assert.equal(p.date, '2024-01')
  assert.equal(p.day, '2024-01-10')
  assert.equal(p.project, 'fable-bound')
})
