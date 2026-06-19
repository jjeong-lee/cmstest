"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSessionStore } from "@/lib/session-store";

const primaryNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    badge: "개요",
    description: "발행, 검토, 배포 지표",
    icon: "DS",
  },
  {
    href: "/content",
    label: "콘텐츠 Content",
    badge: "문서",
    description: "폴더, 문서, 편집 흐름",
    icon: "CT",
  },
  {
    href: "/attachments",
    label: "첨부 Attachments",
    badge: "파일",
    description: "메타데이터, 연결 상태",
    icon: "AT",
  },
  {
    href: "/operations",
    label: "운영 Operations",
    badge: "복구",
    description: "헬스 체크, 백업, 복구",
    icon: "OP",
  },
  {
    href: "/governance",
    label: "거버넌스 Governance",
    badge: "통제",
    description: "일정, 범위, 리스크, 변경",
    icon: "GV",
  },
] as const;

const secondaryNav = [
  { href: "/portal", label: "Portal 보기" },
  { href: "/content", label: "새 검토 요청 확인" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session } = useSessionStore();
  const currentSection =
    primaryNav.find((item) => pathname === item.href || pathname.startsWith(`${item.href}/`)) ?? primaryNav[0];

  return (
    <div className="admin-shell">
      <aside className="admin-sidebar">
        <div className="sidebar-brand">
          <div className="brand-mark" aria-hidden="true">
            NS
          </div>
          <div>
            <span className="sidebar-kicker">Northstar CMS</span>
            <strong>Tailwind Admin Console</strong>
          </div>
        </div>

        <div className="sidebar-intro card-dark">
          <span className="eyebrow eyebrow-dark">workspace</span>
          <h1>콘텐츠 운영을 한 화면에서 제어하는 관리자 콘솔</h1>
          <p>레퍼런스 대시보드처럼 짙은 사이드바와 밝은 데이터 캔버스로 구조를 재정리했습니다.</p>
        </div>

        <section className="sidebar-section" aria-label="주요 메뉴">
          <div className="sidebar-section-label">MAIN MENU</div>
          <nav className="admin-nav" aria-label="관리자 내비게이션">
            {primaryNav.map((item) => {
              const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
              return (
                <Link key={item.href} href={item.href} className="nav-link" data-active={active}>
                  <span className="nav-icon" aria-hidden="true">
                    {item.icon}
                  </span>
                  <span className="nav-copy">
                    <span className="nav-title-row">
                      <span>{item.label}</span>
                      <span className="nav-badge">{item.badge}</span>
                    </span>
                    <span className="nav-description">{item.description}</span>
                  </span>
                </Link>
              );
            })}
          </nav>
        </section>

        <section className="sidebar-section" aria-label="빠른 이동">
          <div className="sidebar-section-label">SHORTCUTS</div>
          <div className="shortcut-list">
            {secondaryNav.map((item) => (
              <Link key={item.href} href={item.href} className="shortcut-link">
                {item.label}
              </Link>
            ))}
          </div>
        </section>

        <div className="sidebar-footer">
          <div className="sidebar-card card-dark compact">
            <span className="sidebar-section-label">CURRENT VIEW</span>
            <strong>{currentSection.label}</strong>
            <p>{currentSection.description}</p>
          </div>
          <div className="sidebar-card compact">
            <span className="mini-badge">{session.role}</span>
            <strong>{session.displayName}</strong>
            <p>{session.email}</p>
          </div>
        </div>
      </aside>

      <main className="admin-main">
        <header className="topbar">
          <div>
            <span className="topbar-kicker">Admin overview</span>
            <h2>{currentSection.label}</h2>
            <p className="topbar-copy">{currentSection.description}</p>
          </div>
          <div className="topbar-actions">
            <div className="topbar-search" aria-label="전역 검색">
              <span className="topbar-search-label">Search</span>
              <strong>문서 제목, 본문, 변경 요청</strong>
            </div>
            <Link href="/content" className="topbar-status">
              검토 대기 0건
            </Link>
            <Link href="/portal" className="button-secondary topbar-button">
              Live portal
            </Link>
          </div>
        </header>
        <div className="page-frame">{children}</div>
      </main>
    </div>
  );
}
