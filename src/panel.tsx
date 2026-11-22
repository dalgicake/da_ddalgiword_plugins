import { atom, Button, Heading, Input, plugin, read, set, Stack, Text, Textarea, type PanelContext } from 'orca'

const key = atom('')
const configured = atom(false)
const protectedStore = atom(false)
const name = atom('')
const words = atom('[\n  {"word": "apple", "meaning": "사과"}\n]')
const message = atom('')
const busy = atom(false)
let requestId = ''
function changed() { requestId = ''; set(message, '') }
async function status() { const s = await plugin.request('key.status'); set(configured, s.configured); set(protectedStore, s.protected) }
export function setup(_ctx: PanelContext): void { void status().catch(() => set(message, '키 저장소 상태를 확인할 수 없습니다.')) }
async function saveKey() {
  try { await plugin.request('key.save', { key: read(key).trim() }); set(key, ''); await status(); set(message, '연결 키를 저장했습니다.') }
  catch (e) { set(message, e instanceof Error ? e.message : '키 저장에 실패했습니다.') }
}
async function deleteKey() {
  try { await plugin.request('key.delete'); await status(); set(message, '연결 키를 삭제했습니다.') }
  catch { set(message, '키 삭제에 실패했습니다.') }
}
async function send() {
  set(busy, true); set(message, '')
  try {
    if (!requestId) requestId = (await plugin.request('wordlist.id')).id
    const result = await plugin.request('wordlist.send', { name: read(name), wordsJson: read(words), requestId })
    set(message, `${result.name}: ${result.wordCount}개 전송 완료${result.replayed ? ' (이미 처리된 요청)' : ''}`)
  } catch (e) { set(message, e instanceof Error ? e.message : '전송에 실패했습니다. 같은 내용으로 다시 시도할 수 있습니다.') }
  finally { set(busy, false) }
}
export default function Panel() {
  return <Stack gap="md">
    <Heading>딸기 단어장</Heading>
    <Text>ddalgiword.com/plugins에서 발급한 키를 연결하세요. 키는 OS 키링에 저장됩니다.</Text>
    <Text>{read(configured) ? '연결 키가 저장되어 있습니다.' : '연결 키가 없습니다.'}{read(protectedStore) ? '' : ' OS 키링을 사용할 수 없습니다.'}</Text>
    <Input label="연결 키" type="password" value={read(key)} onChange={v => set(key, v)} />
    <Button onPress={saveKey} disabled={!read(protectedStore)}>키 저장</Button>
    <Button variant="ghost" onPress={deleteKey} disabled={!read(configured)}>키 삭제</Button>
    <Input label="단어장 이름" disabled={read(busy)} value={read(name)} onChange={v => { set(name, v); changed() }} />
    <Textarea label="단어 JSON 배열" disabled={read(busy)} rows={10} value={read(words)} onChange={v => { set(words, v); changed() }} />
    <Text muted size="xs">각 항목에 word와 meaning을 입력하고, 필요하면 synonym과 example을 추가하세요. 전송 전에 내용을 확인해 주세요.</Text>
    <Button onPress={send} disabled={read(busy) || !read(configured)}>단어장 전송</Button>
    <Text>{read(message)}</Text>
  </Stack>
}
