# 딸기 단어장 Orca 플러그인

Orca 1.4.246 이상에서 단어장 이름과 JSON 배열을 검토하고 계정에 전송합니다. 단어마다 `word`, `meaning` 문자열이 필요하며 `synonym`, `example` 문자열은 선택입니다. 최대 300개이며 이름 120자, word 120자, meaning 600자, synonym 300자, example 1000자까지 입력할 수 있습니다.

1. https://ddalgiword.com/plugins 에 로그인하여 연결 키를 발급합니다.
2. Orca의 플러그인 패널에서 키를 저장합니다. OS 키링을 사용할 수 없는 환경에서는 저장하지 않습니다.
3. 단어장 이름과 JSON을 확인하고 전송합니다. 실패 후 내용 수정 없이 다시 전송하면 같은 요청 ID를 사용합니다.

키는 이 플러그인의 Orca 비밀 저장소에만 보관하며 `https://ddalgiword.com/api/integrations/wordlists`에만 전송합니다. 플러그인은 Node worker로 실행되므로 설치 시 Orca가 실행 권한을 요청합니다. 키 취소와 재발급은 웹에서 할 수 있습니다. Orca 플러그인은 현재 MCP 서버 등록을 지원하지 않으므로 MCP 연동은 별도 설치가 필요합니다.
