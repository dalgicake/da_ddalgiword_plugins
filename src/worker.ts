import type { OrcaWorkerApi } from 'orca/worker'

const KEY = 'ddalgiword-api-key'
const ENDPOINT = 'https://ddalgiword.com/api/integrations/wordlists'

type Word = { word: string; meaning: string; synonym?: string; example?: string }
export function parseWords(input: string): Word[] {
  let value: unknown
  try { value = JSON.parse(input) } catch { throw new Error('단어 JSON을 확인해 주세요.') }
  if (!Array.isArray(value) || value.length === 0 || value.length > 300) throw new Error('단어는 1개 이상 300개 이하의 JSON 배열이어야 합니다.')
  return value.map((item: unknown) => {
    if (!item || typeof item !== 'object' || Array.isArray(item)) throw new Error('각 단어는 객체여야 합니다.')
    const row = item as Record<string, unknown>
    if (typeof row.word !== 'string' || !row.word.trim() || typeof row.meaning !== 'string' || !row.meaning.trim()) throw new Error('각 단어에 word와 meaning이 필요합니다.')
    if (Object.keys(row).some(k => !['word', 'meaning', 'synonym', 'example'].includes(k)) || ['synonym', 'example'].some(k => row[k] !== undefined && typeof row[k] !== 'string')) throw new Error('허용된 항목은 word, meaning, synonym, example 문자열입니다.')
    if (row.word.length > 120 || row.meaning.length > 600 || (typeof row.synonym === 'string' && row.synonym.length > 300) || (typeof row.example === 'string' && row.example.length > 1000)) throw new Error('단어 항목의 길이가 허용 범위를 초과했습니다.')
    return row as Word
  })
}
export default function activate(orca: OrcaWorkerApi): void {
  orca.panels.handle('key.status', async () => ({ configured: !!(await orca.secrets.get(KEY)), protected: (await orca.host.call('secrets.protection')).status === 'os-keyring' }))
  orca.panels.handle('key.save', async ({ key }) => {
    if ((await orca.host.call('secrets.protection')).status !== 'os-keyring') throw new Error('OS 키링을 사용할 수 없어 키를 저장할 수 없습니다.')
    if (!/^dwk_[A-Za-z0-9_-]{43}$/.test(key)) throw new Error('발급받은 dwk_ 키를 입력해 주세요.')
    await orca.secrets.set(KEY, key)
    return { ok: true }
  })
  orca.panels.handle('key.delete', async () => { await orca.secrets.delete(KEY); return { ok: true } })
  orca.panels.handle('wordlist.id', async () => ({ id: crypto.randomUUID() }))
  orca.panels.handle('wordlist.send', async ({ name, wordsJson, requestId }, { signal }) => {
    if (!name.trim() || name.length > 120) throw new Error('단어장 이름을 확인해 주세요.')
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(requestId)) throw new Error('요청 ID가 올바르지 않습니다.')
    const words = parseWords(wordsJson)
    const key = await orca.secrets.get(KEY)
    if (!key) throw new Error('먼저 연결 키를 저장해 주세요.')
    const response = await fetch(ENDPOINT, { method: 'POST', redirect: 'error', signal, headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${key}` }, body: JSON.stringify({ name: name.trim(), words, requestId }) })
    if (!response.ok) throw new Error(`전송에 실패했습니다 (HTTP ${response.status}). 키와 단어장을 확인해 주세요.`)
    const result = await response.json() as { id: string | number; name: string; wordCount: number; replayed: boolean }
    return { id: result.id, name: result.name, wordCount: result.wordCount, replayed: result.replayed }
  })
}
