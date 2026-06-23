"use client";

import React, { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSessionStore } from "@/lib/session-store";
import type { SessionUser } from "@/lib/types";

type AuthMode = "login" | "signup";

type AuthFormProps = {
  mode: AuthMode;
};

type AuthResponse = {
  token: string;
  user: SessionUser;
};

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";

export function AuthForm({ mode }: AuthFormProps) {
  const router = useRouter();
  const { setSession } = useSessionStore();
  const [id, setId] = useState(mode === "login" ? "admin" : "");
  const [password, setPassword] = useState(mode === "login" ? "admin1234" : "");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [email, setEmail] = useState(mode === "login" ? "basic@example.com" : "");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const content = useMemo(
    () =>
      mode === "login"
        ? {
            title: "로그인",
            eyebrow: "account access",
            description: "운영 콘솔 상단의 로그인 진입점을 통해 관리자 계정을 전환합니다.",
            submitLabel: "로그인",
            alternateLabel: "회원가입",
            alternateHref: "/signup",
            alternateCopy: "처음 사용하는 계정이라면 회원가입으로 바로 이어집니다.",
          }
        : {
            title: "회원가입",
            eyebrow: "new account",
            description: "아이디, 이메일, 비밀번호를 등록해 기본 사용자 계정을 생성합니다.",
            submitLabel: "회원가입",
            alternateLabel: "로그인",
            alternateHref: "/login",
            alternateCopy: "이미 계정이 있다면 로그인 화면으로 돌아갑니다.",
          },
    [mode],
  );

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/signup";
      const payload =
        mode === "login"
          ? { id, password }
          : {
              id,
              password,
              passwordConfirm,
              email,
            };

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = (await response.json().catch(() => null)) as AuthResponse | { message?: string } | null;
      if (!response.ok || !body || !("user" in body)) {
        throw new Error((body && "message" in body && body.message) || "로그인 요청을 처리하지 못했습니다.");
      }

      setSession(body.user);
      router.push("/dashboard");
    } catch (caughtError) {
      setError(caughtError instanceof Error ? caughtError.message : "요청을 처리하지 못했습니다.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-screen">
      <section className="auth-panel">
        <div className="auth-hero">
          <span className="eyebrow">{content.eyebrow}</span>
          <h1>{content.title}</h1>
          <p>{content.description}</p>
          <div className="auth-hint-card">
            <strong>기본 관리자 계정</strong>
            <p>id: admin / email: basic@example.com</p>
          </div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <label className="auth-field">
            <span>아이디</span>
            <input name="id" value={id} onChange={(event) => setId(event.target.value)} autoComplete="username" required />
          </label>

          {mode === "signup" ? (
            <label className="auth-field">
              <span>이메일</span>
              <input
                name="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="email"
                required
              />
            </label>
          ) : null}

          <label className="auth-field">
            <span>비밀번호</span>
            <input
              name="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete={mode === "login" ? "current-password" : "new-password"}
              required
            />
          </label>

          {mode === "signup" ? (
            <label className="auth-field">
              <span>비밀번호 확인</span>
              <input
                name="passwordConfirm"
                type="password"
                value={passwordConfirm}
                onChange={(event) => setPasswordConfirm(event.target.value)}
                autoComplete="new-password"
                required
              />
            </label>
          ) : null}

          {mode === "login" ? <input type="hidden" name="email" value={email} readOnly /> : null}

          {error ? <p className="auth-error">{error}</p> : null}

          <div className="auth-actions">
            <button type="submit" className="button" disabled={submitting}>
              {submitting ? "처리 중..." : content.submitLabel}
            </button>
            <Link href={content.alternateHref} className="button-secondary">
              {content.alternateLabel}
            </Link>
          </div>
          <p className="auth-switch-copy">{content.alternateCopy}</p>
        </form>
      </section>
    </div>
  );
}
