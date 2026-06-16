"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ReactNode } from "react";
import { useSessionStore } from "@/lib/session-store";

const primaryNav = [
  { href: "/dashboard", label: "Dashboard", badge: "4" },
  { href: "/entries", label: "Entries", badge: "12" },
  { href: "/review", label: "Review", badge: "2" },
  { href: "/media", label: "Media", badge: "18" },
];

const secondaryNav = [
  { href: "/users", label: "Users" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { session } = useSessionStore();

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">
          <span className="eyebrow">Image-led Ops</span>
          <h1>Northstar CMS</h1>
          <p>콘텐츠 작성, 검수, 발행, 미디어 운영을 한 흐름으로 묶은 관리자 콘솔</p>
        </div>

        <div className="nav-section nav-list">
          {primaryNav.map((item) => (
            <Link key={item.href} href={item.href} className="nav-link" data-active={pathname.startsWith(item.href)}>
              <span>{item.label}</span>
              <span className="nav-badge">{item.badge}</span>
            </Link>
          ))}
        </div>

        <div className="nav-section nav-secondary">
          {secondaryNav.map((item) => (
            <a key={item.href} href={item.href} className="nav-link" data-active="false">
              <span>{item.label}</span>
            </a>
          ))}
        </div>

        <div className="sidebar-footer">
          <div className="workspace-card">
            <span className="eyebrow">Workspace</span>
            <h3>Northstar</h3>
            <p className="muted">Asia/Seoul • 1 active workspace</p>
          </div>
          <div className="workspace-card">
            <span className="mini-badge">{session.role}</span>
            <h3>{session.displayName}</h3>
            <p className="muted">{session.email}</p>
          </div>
        </div>
      </aside>
      <main className="main">{children}</main>
    </div>
  );
}
