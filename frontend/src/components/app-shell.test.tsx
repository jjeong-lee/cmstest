import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import { AppShell } from "./app-shell";

vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

vi.mock("next/link", () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/lib/session-store", () => ({
  useSessionStore: () => ({
    session: {
      role: "ADMIN",
      displayName: "콘텐츠 관리자",
      email: "admin@example.com",
    },
  }),
}));

describe("AppShell", () => {
  it("renders a sign-up action in the topbar", () => {
    const html = renderToStaticMarkup(
      <AppShell>
        <div>dashboard</div>
      </AppShell>,
    );

    expect(html).toContain("회원가입");
    expect(html).toContain('href="/signup"');
  });
});
