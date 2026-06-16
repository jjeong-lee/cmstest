# CMS Operations Runbook

## Overview

이 저장소는 관리자 콘솔과 포털을 함께 제공하는 마크다운 기반 CMS 모노레포다. 현재 런타임 데이터는 `backend`의 인메모리 저장소를 사용하므로 재시작 시 초기화된다.

## Entry Points

- Branch preview: 루트 `docker-compose.yml`
- Frontend: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
- Health: `http://localhost:4000/api/v1/ops/health`

## Demo Accounts

- `admin@example.com`
- `reviewer@example.com`
- `operator@example.com`
- `user@example.com`

인증은 `POST /api/v1/auth/login` 또는 `x-demo-user` 헤더를 사용한다.

## Admin Flow

1. `Content`에서 폴더와 문서를 확인한다.
2. 문서 상세에서 `Submit Review`, `Approve`, `Publish`, `게시중단`, `삭제`를 순서대로 실행한다.
3. `Attachments`에서 첨부 메타데이터와 다운로드 가능 상태를 확인한다.
4. `Operations`에서 헬스 체크와 백업 이력을 확인한다.
5. `Governance`에서 일정, 범위, 위험, 산출물, 변경 요청 레지스터를 점검한다.

## Portal Flow

1. `/portal`에서 활성 폴더 트리와 추천 문서를 확인한다.
2. `/portal/folders/:folderId`에서 breadcrumb와 문서 목록을 탐색한다.
3. `/portal/documents/:documentId`에서 마크다운 렌더링과 첨부파일 목록을 확인한다.
4. `/portal/search?q=배포`로 게시 문서 검색 결과를 확인한다.

## Operational Notes

- 손상 PDF나 미지원 첨부는 `ORPHANED` 또는 실패 상태로 남길 수 있다.
- 백업 실행 결과는 `SUCCEEDED`, `PARTIAL_FAILURE`, `FAILED` 상태로 구분된다.
- 배포 이력과 소프트웨어 목록은 관리자 콘솔의 `Governance` 화면에서 함께 추적한다.
