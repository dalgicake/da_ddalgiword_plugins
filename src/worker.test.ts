import { assert, test } from 'orca/testing'
import { parseWords } from './worker'
test('validates word entries', () => {
  assert.deepEqual(parseWords('[{"word":"apple","meaning":"사과"}]'), [{ word: 'apple', meaning: '사과' }])
  let failed = false
  try { parseWords('[{"word":"apple"}]') } catch { failed = true }
  assert.equal(failed, true)
  failed = false
  try { parseWords(JSON.stringify([{ word: 'a'.repeat(121), meaning: '뜻' }])) } catch { failed = true }
  assert.equal(failed, true)
})

test('creates a UUID for retries', async () => {
  const { mountWorker } = await import('orca/testing')
  const main = await import('./worker')
  const worker = await mountWorker(main)
  const result = await worker.request('wordlist.id')
  assert.equal(/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(result.id), true)
  await worker.deactivate()
})
