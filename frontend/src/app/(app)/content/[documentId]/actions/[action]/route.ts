import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:4000/api/v1";
const DEMO_USER = process.env.NEXT_PUBLIC_DEMO_USER ?? "admin@example.com";

export async function POST(
  _request: NextRequest,
  {
    params,
  }: {
    params: Promise<{ documentId: string; action: string }>;
  },
) {
  const { documentId, action } = await params;

  const path =
    action === "submit-review"
      ? `/admin/documents/${documentId}/submit-review`
      : action === "approve"
        ? `/admin/documents/${documentId}/approve`
        : action === "publish"
          ? `/admin/documents/${documentId}/publish`
          : action === "unpublish"
            ? `/admin/documents/${documentId}/unpublish`
            : action === "delete"
              ? `/admin/documents/${documentId}`
              : null;

  if (path) {
    await fetch(`${API_BASE_URL}${path}`, {
      method: action === "delete" ? "DELETE" : "POST",
      headers: {
        "Content-Type": "application/json",
        "x-demo-user": action === "approve" ? "reviewer@example.com" : DEMO_USER,
      },
      body: action === "unpublish" ? JSON.stringify({ reason: "관리자 요청" }) : action === "approve" ? JSON.stringify({ comment: "승인" }) : "{}",
      cache: "no-store",
    }).catch(() => undefined);
  }

  return NextResponse.redirect(new URL(`/content/${documentId}`, _request.url));
}
