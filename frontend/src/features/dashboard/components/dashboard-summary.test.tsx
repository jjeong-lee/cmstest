import React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { describe, expect, it } from "vitest";
import { DashboardSummaryView } from "./dashboard-summary";
import type { DashboardSummary } from "../../../lib/types";

const summary: DashboardSummary = {
  highlights: [
    { key: "published", label: "Published", value: "128", tone: "accent" },
    { key: "review", label: "Review queue", value: "6", tone: "warning" },
    { key: "backups", label: "Backups", value: "12", tone: "success" },
    { key: "changes", label: "Changes", value: "4", tone: "neutral" },
  ],
  recentPublications: [
    {
      id: "doc-1",
      title: "운영 기준 문서",
      folderPath: "정책 / 운영",
      updatedAt: "2026-06-19T06:00:00.000Z",
      status: "PUBLISHED",
    },
  ],
  reviewQueue: [
    {
      id: "doc-2",
      title: "검토 필요 문서",
      folderPath: "콘텐츠 / 가이드",
      updatedAt: "2026-06-18T12:00:00.000Z",
    },
  ],
  backups: [
    {
      id: "backup-1",
      runType: "SCHEDULED",
      status: "SUCCEEDED",
      validationStatus: "PASSED",
      startedAt: "2026-06-19T01:00:00.000Z",
      completedAt: "2026-06-19T01:10:00.000Z",
    },
  ],
  risks: [
    {
      id: "risk-1",
      title: "테마 회귀 위험",
      cause: "공통 스타일 미적용",
      impact: "운영 일관성 저하",
      owner: "Design QA",
      dueDate: "2026-06-25",
      status: "OPEN",
    },
  ],
  deployments: [
    {
      id: "release-1",
      releaseVersion: "v1.4.0",
      gitCommitSha: "abc1234",
      buildNumber: "build-19",
      environment: "production",
      status: "DEPLOYED",
      approvedBy: "Admin",
    },
  ],
};

describe("DashboardSummaryView", () => {
  it("renders the shared admin-theme structure with iconized metrics and section headers", () => {
    const html = renderToStaticMarkup(<DashboardSummaryView summary={summary} />);

    expect(html).toContain("dashboard-hero-panel");
    expect(html).toContain("hero-pill-row");
    expect(html.match(/class=\"metric-icon\"/g)?.length).toBe(summary.highlights.length);
    expect(html.match(/class=\"section-icon\"/g)?.length).toBeGreaterThanOrEqual(5);
    expect(html).toContain("운영 데이터가 같은 패턴으로 정렬됩니다");
  });
});
