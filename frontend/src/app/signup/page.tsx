import React from "react";
import Link from "next/link";

const signupFields = [
  {
    id: "signup-username",
    label: "아이디",
    type: "text",
    placeholder: "northstar-admin",
    autoComplete: "username",
  },
  {
    id: "signup-password",
    label: "비밀번호",
    type: "password",
    placeholder: "영문, 숫자, 특수문자 조합",
    autoComplete: "new-password",
  },
  {
    id: "signup-phone",
    label: "전화번호",
    type: "tel",
    placeholder: "010-1234-5678",
    autoComplete: "tel",
  },
  {
    id: "signup-email",
    label: "이메일",
    type: "email",
    placeholder: "team@example.com",
    autoComplete: "email",
  },
] as const;

export default function SignupPage() {
  return (
    <main className="auth-shell">
      <section className="auth-hero-panel">
        <div className="auth-hero-copy">
          <span className="eyebrow">IF-04a Signup Access</span>
          <h1 className="page-title">Northstar CMS에 바로 참여할 새 작업자 계정을 등록합니다.</h1>
          <p className="page-copy">
            현재 관리자 콘솔의 톤을 그대로 이어받아, 초대받은 운영자와 편집자가 아이디·비밀번호·전화번호·이메일을
            한 번에 입력할 수 있는 가입 화면입니다.
          </p>
        </div>

        <div className="auth-signature-card">
          <span className="eyebrow subtle">Account Intake Sheet</span>
          <div className="auth-signature-grid" aria-hidden="true">
            <div>
              <strong>ID</strong>
              <span>workspace alias</span>
            </div>
            <div>
              <strong>PW</strong>
              <span>private access key</span>
            </div>
            <div>
              <strong>TEL</strong>
              <span>ops contact line</span>
            </div>
            <div>
              <strong>MAIL</strong>
              <span>notification inbox</span>
            </div>
          </div>
        </div>
      </section>

      <section className="panel auth-form-panel">
        <div className="split-head auth-form-head">
          <div>
            <span className="eyebrow subtle">회원가입 양식</span>
            <h2>계정 정보 입력</h2>
            <p className="page-copy">필수 정보를 입력하면 다음 단계에서 권한과 워크스페이스를 연결할 수 있습니다.</p>
          </div>
          <Link href="/dashboard" className="button-ghost">
            대시보드로 돌아가기
          </Link>
        </div>

        <form className="signup-form">
          <div className="signup-form-grid">
            {signupFields.map((field) => (
              <label key={field.id} className="signup-field" htmlFor={field.id}>
                <span>{field.label}</span>
                <input
                  id={field.id}
                  name={field.id}
                  type={field.type}
                  placeholder={field.placeholder}
                  autoComplete={field.autoComplete}
                />
              </label>
            ))}
          </div>

          <div className="signup-actions">
            <button type="submit" className="button">
              회원가입 요청 보내기
            </button>
            <p>입력한 연락처 정보는 승인 안내와 계정 복구 절차에 사용됩니다.</p>
          </div>
        </form>
      </section>
    </main>
  );
}
