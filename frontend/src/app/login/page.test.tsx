import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it, vi } from "vitest";
import LoginPage from "./page";
import { SessionProvider } from "@/lib/session-store";

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

describe("LoginPage", () => {
  it("renders the login form with a signup path for new users", () => {
    const html = renderToStaticMarkup(
      <SessionProvider>
        <LoginPage />
      </SessionProvider>,
    );

    expect(html).toContain("로그인");
    expect(html).toContain('name="id"');
    expect(html).toContain('name="password"');
    expect(html).toContain("회원가입");
    expect(html).toContain('href="/signup"');
  });
});
