# CMS Operations Runbook

## Start Points

- App stack: `docker-compose.yml`
- Frontend preview: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
- Health check: `GET /api/v1/ops/health`

## Demo Access

- `admin@example.com`
- `reviewer@example.com`
- `operator@example.com`
- `user@example.com`

모든 관리자 API는 `Authorization: Bearer <email>` 또는 `x-demo-user: <email>`로 테스트할 수 있다.

## Core Smoke

1. `POST /api/v1/auth/login`으로 관리자 세션을 발급한다.
2. `POST /api/v1/admin/folders`로 폴더를 생성한다.
3. `POST /api/v1/admin/documents`로 문서를 만들고 `submit-review -> approve -> publish`를 순서대로 호출한다.
4. `GET /api/v1/portal/search?q=<keyword>`로 게시 문서 검색 결과를 확인한다.
5. `GET /api/v1/admin/backups`와 `POST /api/v1/admin/backups`로 운영 콘솔 흐름을 확인한다.

## Caveats

- 현재 구현은 인메모리 저장소 기반이므로 프로세스 재시작 시 데이터가 초기화된다.
- 포털은 `PUBLISHED + PUBLIC + ACTIVE folder` 조건을 만족하는 문서만 노출한다.
- 손상 또는 미지원 파일은 다운로드 가능 목록에서 제외될 수 있다.
