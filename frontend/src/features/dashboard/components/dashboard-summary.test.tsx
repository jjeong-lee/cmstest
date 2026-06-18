import React, { type ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { renderToStaticMarkup } from "react-dom/server";
import { mockDashboardSummary } from "../../../lib/mock-data";
import { DashboardSummaryView } from "./dashboard-summary";

vi.mock("next/link", () => ({
  default: ({ children, href, className }: { children: ReactNode; href: string; className?: string }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

describe("DashboardSummaryView", () => {
  it("renders the summary highlights as chart-driven cards instead of large number tiles", () => {
    const html = renderToStaticMarkup(<DashboardSummaryView summary={mockDashboardSummary} />);
    const chartCardCount = (html.match(/metric-trend-bars/g) ?? []).length;
    const chartImageCount = (html.match(/aria-label="[^"]+ 차트, 현재 /g) ?? []).length;

    expect(html).toContain("summary-visual-board");
    expect(chartCardCount).toBe(mockDashboardSummary.highlights.length);
    expect(chartImageCount).toBe(mockDashboardSummary.highlights.length);
    expect(html).toContain("검토 대기 차트, 현재 0건");
    expect(html).toContain("0건</strong><span>0%</span>");
    expect(html).not.toContain("metric-value");
  });
});
