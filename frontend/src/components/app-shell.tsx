"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { ReactNode, useMemo, useState } from "react";
import { useSessionStore } from "@/lib/session-store";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", badge: "요약" },
  { href: "/content", label: "콘텐츠 Content", badge: "문서" },
  { href: "/attachments", label: "첨부 Attachments", badge: "파일" },
  { href: "/operations", label: "운영 Operations", badge: "백업" },
  { href: "/governance", label: "거버넌스 Governance", badge: "통제" },
] as const;

const tutorialSteps = [
  {
    href: "/dashboard",
    label: "Dashboard",
    title: "대시보드 시작점",
    description: "콘솔의 핵심 지표와 발행 상태를 먼저 확인하는 시작 화면입니다.",
  },
  {
    href: "/content",
    label: "콘텐츠 Content",
    title: "콘텐츠 편집 허브",
    description: "문서 초안, 검토, 발행 흐름을 한 곳에서 관리하며 변경 요청을 바로 이어서 처리합니다.",
  },
  {
    href: "/attachments",
    label: "첨부 Attachments",
    title: "첨부 자산 보관소",
    description: "문서에 연결되는 파일과 이미지 자산을 업로드하고 재사용 여부를 점검하는 영역입니다.",
  },
  {
    href: "/operations",
    label: "운영 Operations",
    title: "운영 상태 점검",
    description: "백업, 배포 준비, 작업 이력 같은 운영성 정보를 확인하고 장애 대응 흐름을 챙깁니다.",
  },
  {
    href: "/governance",
    label: "거버넌스 Governance",
    title: "거버넌스 통제 구간",
    description: "권한, 감사, 정책 준수 상태를 점검해 관리 콘솔의 변경이 통제 범위 안에 있도록 유지합니다.",
  },
] as const;

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { session } = useSessionStore();
  const [tutorialStepIndex, setTutorialStepIndex] = useState<number | null>(null);

  const tutorialStep = useMemo(
    () => (tutorialStepIndex === null ? null : tutorialSteps[tutorialStepIndex]),
    [tutorialStepIndex],
  );

  const finishTutorial = () => {
    setTutorialStepIndex(null);
    router.push("/dashboard");
  };

  const closeTutorial = () => {
    setTutorialStepIndex(null);
  };

  const advanceTutorial = () => {
    if (tutorialStepIndex === null) {
      return;
    }

    if (tutorialStepIndex === tutorialSteps.length - 1) {
      finishTutorial();
      return;
    }

    setTutorialStepIndex(tutorialStepIndex + 1);
  };

  return (
    <div className="admin-shell">
      <aside className="admin-rail">
        <div className="brand-panel">
          <span className="eyebrow">Markdown CMS</span>
          <h1>Northstar</h1>
          <p>문서 작성, 발행, 검색, 첨부, 운영 통제를 하나의 관리자 콘솔에서 관리합니다.</p>
        </div>

        <nav className="admin-nav" aria-label="관리자 내비게이션">
          {primaryNav.map((item) => {
            const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
            const highlighted = tutorialStep?.href === item.href;

            return (
              <Link
                key={item.href}
                href={item.href}
                className="nav-link"
                data-active={active}
                data-highlight={highlighted}
              >
                <span className="nav-link-copy">
                  <span>{item.label}</span>
                  {highlighted ? (
                    <span className="tutorial-arrow" aria-hidden="true">
                      ↙
                    </span>
                  ) : null}
                </span>
                <span className="nav-badge">{item.badge}</span>
              </Link>
            );
          })}
        </nav>

        <div className="tutorial-entry">
          <button type="button" className="nav-link tutorial-trigger" onClick={() => setTutorialStepIndex(0)}>
            <span>튜토리얼 Tutorial</span>
          </button>
        </div>

        <div className="rail-footer">
          <div className="info-card compact">
            <span className="eyebrow subtle">검토 대기 Review Queue</span>
            <strong>문서 상태 전이와 감사 이력이 우측 패널 없이도 바로 보이도록 구성</strong>
          </div>
          <div className="info-card compact">
            <span className="mini-badge">{session.role}</span>
            <strong>{session.displayName}</strong>
            <p>{session.email}</p>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div>
            <span className="topbar-kicker">현재 워크스페이스 Current Workspace</span>
            <h2>정책 / 운영 / 발행 흐름</h2>
          </div>
          <div className="topbar-actions">
            <div className="search-pill" aria-label="전역 검색">
              <span>검색 Search</span>
              <strong>제목, 본문, 변경 요청</strong>
            </div>
            <Link href="/content" className="status-chip">
              검토 대기 0건
            </Link>
            <Link href="/portal" className="button-secondary">
              포털 Portal 보기
            </Link>
          </div>
        </header>
        <div className="page-frame">{children}</div>
      </main>

      {tutorialStep ? (
        <div className="tutorial-overlay" role="presentation">
          <div className="tutorial-panel" role="dialog" aria-modal="true" aria-labelledby="tutorial-step-label">
            <div className="tutorial-panel-head">
              <span className="eyebrow">관리자 튜토리얼</span>
              <button type="button" className="button-ghost tutorial-dismiss" onClick={closeTutorial}>
                닫기
              </button>
            </div>
            <p className="tutorial-step-count">
              {tutorialStepIndex! + 1} / {tutorialSteps.length}
            </p>
            <h3 id="tutorial-step-label">{tutorialStep.label}</h3>
            <strong>{tutorialStep.title}</strong>
            <p>{tutorialStep.description}</p>
            <div className="tutorial-actions">
              <button type="button" className="button-secondary" onClick={advanceTutorial}>
                {tutorialStepIndex === tutorialSteps.length - 1 ? "끝" : "다음 단계"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
