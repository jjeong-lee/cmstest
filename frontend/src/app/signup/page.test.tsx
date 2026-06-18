import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import SignupPage from "./page";

vi.mock("next/link", () => ({
  default: ({ children, href, className }: { children: React.ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("SignupPage", () => {
  it("renders the sign-up form fields for account creation", () => {
    const html = renderToStaticMarkup(<SignupPage />);

    expect(html).toContain("회원가입");
    expect(html).toContain("아이디");
    expect(html).toContain("비밀번호");
    expect(html).toContain("전화번호");
    expect(html).toContain("이메일");
    expect(html).toContain('type="password"');
    expect(html).toContain('type="tel"');
    expect(html).toContain('type="email"');
  });
});
