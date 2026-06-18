import React from "react";
import Link from "next/link";
import { DashboardSummary } from "@/lib/types";

const toneClass = {
  accent: "accent",
  success: "success",
  warning: "warning",
  neutral: "neutral",
} as const;

const toneDescription = {
  accent: "발행 추이",
  success: "운영 안정",
  warning: "검토 주의",
  neutral: "리스크 현황",
} as const;

const qualitativeValueMap: Record<string, number> = {
  SUCCEEDED: 1,
  UP: 1,
  ACTIVE: 0.92,
  APPROVED: 0.9,
  PARTIAL_FAILURE: 0.58,
  IN_REVIEW: 0.5,
  ANALYSIS_REQUIRED: 0.42,
  AT_RISK: 0.34,
  FAILED: 0.16,
  DOWN: 0.12,
  DELETED: 0.08,
  UNPUBLISHED: 0.08,
};

const qualitativeLabelMap: Record<string, string> = {
  SUCCEEDED: "정상 완료",
  UP: "정상",
  ACTIVE: "활성",
  APPROVED: "승인",
  PARTIAL_FAILURE: "부분 실패",
  IN_REVIEW: "검토 중",
  ANALYSIS_REQUIRED: "분석 필요",
  AT_RISK: "주의 필요",
  FAILED: "실패",
  DOWN: "중단",
  DELETED: "삭제",
  UNPUBLISHED: "비공개",
};

const TREND_BAR_COUNT = 12;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function parseNumericMetric(value: string) {
  const parsed = Number(value.replace(/,/g, ""));

  if (Number.isFinite(parsed)) {
    return parsed;
  }

  return null;
}

function getMetricRatio(value: string, numericMax: number) {
  const numericValue = parseNumericMetric(value);

  if (numericValue !== null) {
    if (numericValue <= 0 || numericMax <= 0) {
      return 0;
    }

    return clamp(numericValue / numericMax, 0.12, 1);
  }

  const mapped = qualitativeValueMap[value.toUpperCase()];
  return mapped ?? 0.4;
}

function getMetricCaption(value: string) {
  const numericValue = parseNumericMetric(value);

  if (numericValue !== null) {
    return `${numericValue.toLocaleString("ko-KR")}건`;
  }

  const normalized = value.toUpperCase();
  return qualitativeLabelMap[normalized] ?? value;
}

function getMetricNote(label: string, ratio: number) {
  const percentage = Math.round(ratio * 100);
  return `${label} 상태를 ${percentage}% 밀도의 막대로 요약했습니다.`;
}

export function DashboardSummaryView({ summary }: { summary: DashboardSummary }) {
  const numericMax = Math.max(
    1,
    ...summary.highlights
      .map((item) => parseNumericMetric(item.value))
      .filter((value): value is number => value !== null),
  );

  return (
    <div className="page-shell">
      <section className="hero-panel">
        <span className="eyebrow">ADM-01 Dashboard 대시보드</span>
        <div className="split-head">
          <div>
            <h1 className="page-title">최근 발행, 검토, 백업, 리스크를 한 화면에서 확인합니다.</h1>
            <p className="page-copy">
              포털 노출 대상과 운영 상태를 분리하지 않고 연결해서 보여주는 관리자 요약 화면입니다.
            </p>
          </div>
          <div className="cta-row">
            <Link href="/content" className="button">
              문서 워크스페이스 열기
            </Link>
            <Link href="/operations" className="button-secondary">
              백업 상태 보기
            </Link>
          </div>
        </div>
      </section>

      <section className="summary-visual-board" aria-label="대시보드 통계 시각화">
        <div className="summary-visual-head">
          <div>
            <span className="eyebrow subtle">Summary visuals</span>
            <h2>핵심 통계를 차트 중심으로 다시 정리했습니다.</h2>
          </div>
          <p>
            수치 자체보다 추세 강도와 상태 밀도를 먼저 읽을 수 있도록 화이트 기반의 차분한 카드로 재구성했습니다.
          </p>
        </div>

        <div className="card-grid metrics-grid">
          {summary.highlights.map((item) => {
            const ratio = getMetricRatio(item.value, numericMax);
            const caption = getMetricCaption(item.value);
            const note = getMetricNote(item.label, ratio);

            return (
              <article key={item.key} className={`metric-card metric-visual-card tone-${toneClass[item.tone]}`}>
                <div className="metric-card-head">
                  <span className="eyebrow subtle">{item.label}</span>
                  <span className="metric-trend-tag">{toneDescription[item.tone]}</span>
                </div>

                <div className="metric-trend" role="img" aria-label={`${item.label} 차트, 현재 ${caption}`}>
                  <div className="metric-trend-bars" aria-hidden="true">
                    {Array.from({ length: TREND_BAR_COUNT }, (_, index) => {
                      const threshold = (index + 1) / TREND_BAR_COUNT;
                      const filled = ratio >= threshold;
                      const barHeight = 28 + (index % 4) * 10;

                      return (
                        <span
                          key={`${item.key}-${index}`}
                          className="metric-trend-bar"
                          data-active={filled}
                          style={{ height: `${barHeight}px` }}
                        />
                      );
                    })}
                  </div>
                  <div className="metric-trend-baseline" aria-hidden="true" />
                </div>

                <div className="metric-caption-row">
                  <strong>{caption}</strong>
                  <span>{Math.round(ratio * 100)}%</span>
                </div>
                <p className="metric-note">{note}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="masonry-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>최근 발행 문서</h3>
            <Link href="/portal" className="text-link">
              포털 Portal 미리보기
            </Link>
          </div>
          <div className="stack-list">
            {summary.recentPublications.map((item) => (
              <Link key={item.id} href={`/content/${item.id}`} className="content-card">
                <strong>{item.title}</strong>
                <span>{item.folderPath}</span>
                <div className="meta-row">
                  <span className="status-badge" data-status={item.status}>
                    {item.status}
                  </span>
                  <span>{new Date(item.updatedAt).toLocaleString("ko-KR")}</span>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>최근 백업</h3>
            <Link href="/operations" className="text-link">
              운영 Operations
            </Link>
          </div>
          <div className="stack-list">
            {summary.backups.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.runType}</strong>
                <div className="meta-row">
                  <span className="status-badge" data-status={item.status}>
                    {item.status}
                  </span>
                  <span>{new Date(item.startedAt).toLocaleString("ko-KR")}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>오픈 리스크</h3>
            <Link href="/governance" className="text-link">
              거버넌스 Governance
            </Link>
          </div>
          <div className="stack-list">
            {summary.risks.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.title}</strong>
                <span>{item.cause}</span>
                <div className="meta-row">
                  <span>{item.owner}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
