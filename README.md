# TicketMate AI — Next.js 스타터

간단한 Next.js 템플릿입니다. 메인 페이지와 공연 설정, AI 실행 화면을 포함합니다.

Claude API 연동:

- `.env.local.example`을 복사하여 `.env.local`로 저장합니다.
- `ANTHROPIC_API_KEY`에 Claude API 키를 넣습니다.

설치 및 실행:

```bash
npm install
cp .env.local.example .env.local
# .env.local 파일에 키를 붙여넣기
npm run dev
```

페이지 경로:

- `/` - 메인
- `/booking` - 공연 설정 및 Claude 리포트 생성
- `/agent` - AI Agent 실행 로그
