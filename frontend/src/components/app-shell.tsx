"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSessionStore } from "@/lib/session-store";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", badge: "요약" },
  { href: "/content", label: "Content", badge: "문서" },
  { href: "/attachments", label: "Attachments", badge: "파일" },
  { href: "/operations", label: "Operations", badge: "백업" },
  { href: "/governance", label: "Governance", badge: "통제" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session } = useSessionStore();

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
            return (
              <Link key={item.href} href={item.href} className="nav-link" data-active={active}>
                <span>{item.label}</span>
                <span className="nav-badge">{item.badge}</span>
              </Link>
            );
          })}
        </nav>

        <div className="rail-footer">
          <div className="info-card compact">
            <span className="eyebrow subtle">Review Queue</span>
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
            <span className="topbar-kicker">Current Workspace</span>
            <h2>정책 / 운영 / 발행 흐름</h2>
          </div>
          <div className="topbar-actions">
            <div className="search-pill" aria-label="전역 검색">
              <span>Search</span>
              <strong>제목, 본문, 변경 요청</strong>
            </div>
            <Link href="/content" className="status-chip">
              검토 대기 0건
            </Link>
            <Link href="/portal" className="button-secondary">
              Portal 보기
            </Link>
          </div>
        </header>
        <div className="page-frame">{children}</div>
      </main>
    </div>
  );
}
