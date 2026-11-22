import { assert, mockHost, mount, test } from 'orca/testing'
import * as panel from './panel'
test('renders connection and wordlist form', async () => {
  const host = mockHost({ requests: { 'key.status': () => ({ configured: false, protected: true }) } })
  const view = await mount(panel, { host })
  assert.deepEqual(view.errors, [])
  assert.deepEqual(view.refusals, [])
  await view.unmount()
})
