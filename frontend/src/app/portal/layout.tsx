import Link from "next/link";
import { ReactNode } from "react";

export default function PortalLayout({ children }: { children: ReactNode }) {
  return (
    <div className="portal-wrapper">
      <header className="portal-topbar">
        <Link href="/portal" className="portal-brand">
          Northstar Portal
        </Link>
        <nav className="portal-nav">
          <Link href="/portal">최근 업데이트</Link>
          <Link href="/portal/search?q=배포">검색 Search</Link>
          <Link href="/dashboard">관리 Admin</Link>
        </nav>
      </header>
      <main>{children}</main>
    </div>
  );
}
