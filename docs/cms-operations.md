# CMS Operations Runbook

## Overview

이 저장소는 `frontend`와 `backend`로 분리된 CMS 백오피스 모노레포다. 초기 구현은 Prisma 스키마와 Nest/Next 구조를 제공하며, 런타임에서는 인메모리 더미 데이터를 기본 fallback으로 사용한다.

## Local Services

- App stack: 루트 `docker-compose.yml`
- Infra only: `infrastructure/docker-compose.yml`
- Frontend preview: `http://localhost:3000`
- Backend API: `http://localhost:4000/api/v1`
- PostgreSQL: `localhost:5432`
- MinIO API / Console: `localhost:9000` / `localhost:9001`

## Environment Files

- Root defaults: `.env.example`
- Backend defaults: `backend/.env.example`
- Frontend defaults: `frontend/.env.example`

## Demo Users

- `admin@example.com`
- `editor@example.com`
- `reviewer@example.com`
- `publisher@example.com`

백엔드 데모 인증은 `POST /api/v1/auth/login` 또는 `x-demo-user` 헤더 기반으로 동작한다.

## Core Flows

1. Draft authoring
   `Entries`에서 새 엔트리를 생성하고 `Save Draft`로 revision을 누적한다.
2. Review workflow
   초안을 저장한 뒤 `Submit for Review`를 실행하고 `Review` 화면에서 승인 또는 반려한다.
3. Publication workflow
   승인 후 즉시 발행하거나 미래 시각으로 예약 발행한다.
4. Media operations
   `Media` 화면에서 자산을 업로드하고 대표 이미지로 선택한다.

## Notes

- 현재 API 저장소는 인메모리이므로 프로세스 재시작 시 상태가 초기화된다.
- Prisma 스키마와 seed 파일은 PostgreSQL 영속화 전환을 위한 기준 구조다.
- Playwright와 contract smoke 테스트 파일은 포함되어 있지만, 이 변경에서는 의존성 설치와 실제 실행은 수행하지 않았다.
