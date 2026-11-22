# 딸기 단어장 Orca 플러그인

Orca 1.4.246 이상에서 단어장 이름과 JSON 배열을 검토하고 계정에 전송합니다. 단어마다 `word`, `meaning` 문자열이 필요하며 `synonym`, `example` 문자열은 선택입니다. 최대 300개이며 이름 120자, word 120자, meaning 600자, synonym 300자, example 1000자까지 입력할 수 있습니다.


## 설치

### Orca 화면에서 설치

[Orca에서 딸기 단어장 열기](https://orca.dev/plugins/dalgicake.ddalgiword?catalog=https%3A%2F%2Fgithub.com%2Fdalgicake%2Fda_ddalgiword_plugins.git)를 누르면 Orca의 플러그인 페이지가 열립니다. 처음에는 `dalgicake/da_ddalgiword_plugins` Git 카탈로그를 추가할지 묻습니다. 출처와 접근 권한을 확인하고 카탈로그 추가에 동의한 뒤, 플러그인 페이지에서 설치하세요. Orca 설정의 Plugins에서도 추가된 카탈로그에서 `dalgicake.ddalgiword`를 검색할 수 있습니다. 플러그인 기능이 꺼져 있다면 먼저 활성화해야 합니다.

이 카탈로그는 Orca 공식 카탈로그가 아닌 Ddalgiword가 제공하는 공개 카탈로그입니다. 카탈로그 추가는 플러그인을 설치하지 않으며, 자동 업데이트를 켠 경우 추가한 카탈로그가 이후 업데이트 출처가 됩니다. 설치할 때 별도로 실행 권한을 확인합니다.

### CLI에서 직접 설치

```sh
orca plugin install dalgicake/da_ddalgiword_plugins@v1.0.0 --json
```

Orca가 `approval_required`를 표시하면 게시자 `dalgicake`, 저장소, 버전과 권한을 확인하세요. 이 플러그인은 사용자 계정 권한으로 Node worker를 실행하며 자신의 암호화된 비밀 저장소(`secrets:own`)를 사용합니다. 신뢰할 경우 CLI가 **이번 명령에 대해 실제로 표시한** 지문으로 다시 실행합니다. 아래는 형식 예시이며 `<CLI가_표시한_지문>`을 그대로 입력하지 마세요.

```sh
orca plugin install dalgicake/da_ddalgiword_plugins@v1.0.0 --json --approve '<CLI가_표시한_지문>'
```

### CLI에서 카탈로그 추가 후 설치

```sh
orca plugin catalog add dalgicake/da_ddalgiword_plugins --json
```

출처와 자동 업데이트에 관한 안내를 확인하고 신뢰한다면, CLI가 표시한 이 카탈로그의 지문으로 다시 실행합니다.

```sh
orca plugin catalog add dalgicake/da_ddalgiword_plugins --json --approve '<CLI가_표시한_카탈로그_지문>'
orca plugin install dalgicake.ddalgiword --catalog https://github.com/dalgicake/da_ddalgiword_plugins --json
```

플러그인 설치에도 별도의 승인이 필요합니다. 위 명령의 출력에서 권한과 실제 플러그인 지문을 확인한 뒤 CLI가 제시한 `--approve` 명령으로 다시 실행하세요. 지문은 파일과 권한에 묶이므로 다른 버전의 지문을 재사용하지 마세요.

## 사용

1. https://ddalgiword.com/plugins 에 로그인하여 연결 키를 발급합니다.
2. Orca의 플러그인 패널에서 키를 저장합니다. OS 키링을 사용할 수 없는 환경에서는 저장하지 않습니다.
3. 단어장 이름과 JSON을 확인하고 전송합니다. 실패 후 내용 수정 없이 다시 전송하면 같은 요청 ID를 사용합니다.

키는 이 플러그인의 Orca 비밀 저장소에만 보관하며 `https://ddalgiword.com/api/integrations/wordlists`에만 전송합니다. 플러그인은 Node worker로 실행되므로 설치 시 Orca가 실행 권한을 요청합니다. 키 취소와 재발급은 웹에서 할 수 있습니다. Orca 플러그인은 현재 MCP 서버 등록을 지원하지 않으므로 MCP 연동은 별도 설치가 필요합니다.
