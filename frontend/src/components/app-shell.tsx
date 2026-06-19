"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSessionStore } from "@/lib/session-store";

type IconName = "dashboard" | "content" | "attachment" | "operations" | "governance" | "portal" | "queue" | "search";

function Icon({ name }: { name: IconName }) {
  const paths: Record<IconName, ReactNode> = {
    dashboard: (
      <>
        <path d="M4.75 5.75h5.5v5.5h-5.5z" />
        <path d="M13.75 5.75h5.5v3.5h-5.5z" />
        <path d="M13.75 12.75h5.5v6.5h-5.5z" />
        <path d="M4.75 14.75h5.5v4.5h-5.5z" />
      </>
    ),
    content: (
      <>
        <path d="M7.75 4.75h8.25l4.25 4.25v10a1.5 1.5 0 0 1-1.5 1.5H7.75a1.5 1.5 0 0 1-1.5-1.5v-12.75a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M15.75 4.75v4.5h4.5" />
        <path d="M9.5 12h7" />
        <path d="M9.5 15.5h7" />
      </>
    ),
    attachment: (
      <>
        <path d="M8.75 12.25l5.5-5.5a3 3 0 1 1 4.25 4.25l-7.5 7.5a4.5 4.5 0 1 1-6.36-6.36l7.86-7.86" />
      </>
    ),
    operations: (
      <>
        <path d="M12 4.75v3" />
        <path d="M12 16.25v3" />
        <path d="M4.75 12h3" />
        <path d="M16.25 12h3" />
        <path d="M6.88 6.88l2.12 2.12" />
        <path d="M15 15l2.12 2.12" />
        <path d="M6.88 17.12 9 15" />
        <path d="M15 9l2.12-2.12" />
        <circle cx="12" cy="12" r="3.25" />
      </>
    ),
    governance: (
      <>
        <path d="M12 4.75 18.5 7v5.25c0 3.37-2.54 6.44-6.5 7-3.96-.56-6.5-3.63-6.5-7V7z" />
        <path d="M9.5 12.25 11.25 14 14.75 10.5" />
      </>
    ),
    portal: (
      <>
        <path d="M12 4.75c3.75 0 6.79 3.02 6.79 6.75S15.75 18.25 12 18.25 5.21 15.23 5.21 11.5 8.25 4.75 12 4.75Z" />
        <path d="M4.75 12h14.5" />
        <path d="M12 4.75c1.7 1.93 2.63 4.33 2.63 6.75S13.7 16.32 12 18.25c-1.7-1.93-2.63-4.33-2.63-6.75S10.3 6.68 12 4.75Z" />
      </>
    ),
    queue: (
      <>
        <path d="M6.25 5.75h11.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.75 3v-3H6.25a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M8.75 10h6.5" />
        <path d="M8.75 13h4.5" />
      </>
    ),
    search: (
      <>
        <circle cx="11" cy="11" r="4.25" />
        <path d="m16 16 3.25 3.25" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const primaryNav = [
  {
    href: "/dashboard",
    label: "Dashboard",
    badge: "개요",
    description: "발행, 검토, 배포 지표",
    icon: "dashboard",
  },
  {
    href: "/content",
    label: "콘텐츠 Content",
    badge: "문서",
    description: "폴더, 문서, 편집 흐름",
    icon: "content",
  },
  {
    href: "/attachments",
    label: "첨부 Attachments",
    badge: "파일",
    description: "메타데이터, 연결 상태",
    icon: "attachment",
  },
  {
    href: "/operations",
    label: "운영 Operations",
    badge: "복구",
    description: "헬스 체크, 백업, 복구",
    icon: "operations",
  },
  {
    href: "/governance",
    label: "거버넌스 Governance",
    badge: "통제",
    description: "일정, 범위, 리스크, 변경",
    icon: "governance",
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
                    <Icon name={item.icon} />
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
              <span className="topbar-search-icon" aria-hidden="true">
                <Icon name="search" />
              </span>
              <div>
                <span className="topbar-search-label">Search</span>
                <strong>문서 제목, 본문, 변경 요청</strong>
              </div>
            </div>
            <Link href="/content" className="topbar-status">
              <span className="topbar-status-icon" aria-hidden="true">
                <Icon name="queue" />
              </span>
              검토 대기 0건
            </Link>
            <Link href="/portal" className="button-secondary topbar-button">
              <span className="button-icon" aria-hidden="true">
                <Icon name="portal" />
              </span>
              Live portal
            </Link>
          </div>
        </header>
        <div className="page-frame">{children}</div>
      </main>
    </div>
  );
}
