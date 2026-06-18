import React, { type ReactNode } from "react";
import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { AppShell } from "@/components/app-shell";

const push = vi.fn();
let pathname = "/operations";

vi.mock("next/link", () => ({
  default: ({ href, children, ...props }: { href: string; children: ReactNode }) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}));

vi.mock("next/navigation", () => ({
  usePathname: () => pathname,
  useRouter: () => ({
    push,
  }),
}));

vi.mock("@/lib/session-store", () => ({
  useSessionStore: () => ({
    session: {
      role: "ADMIN",
      displayName: "테스트 관리자",
      email: "admin@example.com",
    },
  }),
}));

describe("AppShell tutorial walkthrough", () => {
  beforeEach(() => {
    pathname = "/operations";
    push.mockReset();
  });

  it("adds a tutorial menu at the bottom and returns to dashboard after the last step", () => {
    render(
      <AppShell>
        <div>page content</div>
      </AppShell>,
    );

    fireEvent.click(screen.getByRole("button", { name: "튜토리얼 Tutorial" }));

    expect(screen.getByRole("heading", { name: "Dashboard" })).toBeTruthy();
    expect(screen.getByText("콘솔의 핵심 지표와 발행 상태를 먼저 확인하는 시작 화면입니다.")).toBeTruthy();
    expect(screen.getByText("↙")).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    expect(screen.getByRole("heading", { name: "콘텐츠 Content" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    expect(screen.getByRole("heading", { name: "첨부 Attachments" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    expect(screen.getByRole("heading", { name: "운영 Operations" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "다음 단계" }));
    expect(screen.getByRole("heading", { name: "거버넌스 Governance" })).toBeTruthy();

    fireEvent.click(screen.getByRole("button", { name: "끝" }));
    expect(push).toHaveBeenCalledWith("/dashboard");
    expect(screen.queryByRole("heading", { name: "거버넌스 Governance" })).toBeNull();
  });
});
