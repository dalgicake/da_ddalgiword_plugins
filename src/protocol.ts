export {}
declare module 'orca' {
  interface PluginRequests {
    'key.status': { output: { configured: boolean; protected: boolean } }
    'key.save': { input: { key: string }; output: { ok: boolean } }
    'key.delete': { output: { ok: boolean } }
    'wordlist.id': { output: { id: string } }
    'wordlist.send': { input: { name: string; wordsJson: string; requestId: string }; output: { id: string | number; name: string; wordCount: number; replayed: boolean } }
  }
}
