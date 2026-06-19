import Link from "next/link";
import React, { ReactNode } from "react";
import { DashboardSummary } from "@/lib/types";

const toneClass = {
  accent: "accent",
  success: "success",
  warning: "warning",
  neutral: "neutral",
};

type SummaryIconName = "publication" | "queue" | "backup" | "risk" | "release" | "trend";

function SummaryIcon({ name }: { name: SummaryIconName }) {
  const paths: Record<SummaryIconName, ReactNode> = {
    publication: (
      <>
        <path d="M7.75 4.75h8.25l4.25 4.25v10a1.5 1.5 0 0 1-1.5 1.5H7.75a1.5 1.5 0 0 1-1.5-1.5v-12.75a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M15.75 4.75v4.5h4.5" />
        <path d="M9.5 12h7" />
        <path d="M9.5 15.5h5" />
      </>
    ),
    queue: (
      <>
        <path d="M6.25 5.75h11.5a1.5 1.5 0 0 1 1.5 1.5v8.5a1.5 1.5 0 0 1-1.5 1.5H11l-4.75 3v-3H6.25a1.5 1.5 0 0 1-1.5-1.5v-8.5a1.5 1.5 0 0 1 1.5-1.5Z" />
        <path d="M8.75 10h6.5" />
        <path d="M8.75 13h4.5" />
      </>
    ),
    backup: (
      <>
        <path d="M5.75 7.75A7.25 7.25 0 1 1 4.75 12" />
        <path d="M4.75 5.75v4h4" />
        <path d="M12 8.5v4l2.5 1.5" />
      </>
    ),
    risk: (
      <>
        <path d="M12 4.75 19 18.25H5L12 4.75Z" />
        <path d="M12 9v4.5" />
        <circle cx="12" cy="16.25" r=".75" fill="currentColor" stroke="none" />
      </>
    ),
    release: (
      <>
        <path d="M12 4.75 18.5 8.5 12 12.25 5.5 8.5 12 4.75Z" />
        <path d="M18.5 8.5v7L12 19.25l-6.5-3.75v-7" />
        <path d="M12 12.25v7" />
      </>
    ),
    trend: (
      <>
        <path d="M5.5 16.5 10 12l3 3 5.5-6" />
        <path d="M14.75 9h3.75v3.75" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}

const sectionIcons: Record<string, SummaryIconName> = {
  Publishing: "publication",
  Queue: "queue",
  Recovery: "backup",
  Risk: "risk",
  Release: "release",
};

const statIcons: SummaryIconName[] = ["publication", "queue", "backup", "trend"];

function SectionHeader({ kicker, title, href, hrefLabel }: { kicker: keyof typeof sectionIcons; title: string; href: string; hrefLabel: string }) {
  return (
    <div className="section-heading">
      <div className="section-heading-main">
        <span className="section-icon" aria-hidden="true">
          <SummaryIcon name={sectionIcons[kicker]} />
        </span>
        <div>
          <span className="section-kicker">{kicker}</span>
          <h3>{title}</h3>
        </div>
      </div>
      <Link href={href} className="text-link">
        {hrefLabel}
      </Link>
    </div>
  );
}

export function DashboardSummaryView({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="page-shell">
      <section className="dashboard-hero panel panel-hero dashboard-hero-panel">
        <div className="dashboard-hero-copy">
          <span className="eyebrow">CMS overview</span>
          <h1 className="page-title">콘텐츠 운영 상태를 Tailwind Admin 흐름으로 다시 정돈한 요약 보드입니다.</h1>
          <p className="page-copy">
            발행, 검토, 백업, 리스크를 하나의 리듬으로 읽을 수 있도록 아이콘 체계, 타이포그래피, 카드 밀도, 섹션 헤더를 같은 시스템으로 맞췄습니다.
          </p>
          <div className="hero-pill-row" aria-label="대시보드 요약 포인트">
            <span className="search-pill">실시간 운영 상태</span>
            <span className="search-pill">공통 아이콘 언어</span>
            <span className="search-pill">균일한 카드 계층</span>
          </div>
          <div className="hero-actions">
            <Link href="/content" className="button">
              문서 워크스페이스 열기
            </Link>
            <Link href="/operations" className="button-secondary">
              운영 상태 보기
            </Link>
          </div>
        </div>
        <div className="dashboard-hero-aside">
          <div className="dashboard-aside-card">
            <span className="section-kicker">This week</span>
            <strong>운영 데이터가 같은 패턴으로 정렬됩니다</strong>
            <p>카드 헤더, 상태 배지, 보조 설명, 링크 동선이 모두 동일한 밀도와 대비를 따르도록 조정했습니다.</p>
          </div>
          <div className="dashboard-aside-stat">
            <span className="section-icon" aria-hidden="true">
              <SummaryIcon name="trend" />
            </span>
            <div>
              <span className="section-kicker">Focused canvas</span>
              <strong>{summary.highlights.length}개 핵심 메트릭</strong>
            </div>
          </div>
        </div>
      </section>

      <section className="stats-grid" aria-label="핵심 지표">
        {summary.highlights.map((item, index) => (
          <article key={item.key} className={`stat-card tone-${toneClass[item.tone]}`}>
            <div className="stat-card-head">
              <span className="metric-icon" aria-hidden="true">
                <SummaryIcon name={statIcons[index] ?? "trend"} />
              </span>
              <span className="stat-label">{item.label}</span>
            </div>
            <strong className="stat-value">{item.value}</strong>
            <span className="stat-meta">실시간 관리자 지표</span>
          </article>
        ))}
      </section>

      <section className="detail-grid dashboard-detail-grid">
        <article className="panel section-panel">
          <SectionHeader kicker="Publishing" title="최근 발행 문서" href="/portal" hrefLabel="포털 미리보기" />
          <div className="activity-list">
            {summary.recentPublications.map((item) => (
              <Link key={item.id} href={`/content/${item.id}`} className="activity-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.folderPath}</p>
                </div>
                <div className="activity-meta">
                  <span className="status-badge" data-status={item.status}>
                    {item.status}
                  </span>
                  <span>{new Date(item.updatedAt).toLocaleString("ko-KR")}</span>
                </div>
              </Link>
            ))}
          </div>
        </article>

        <article className="panel section-panel">
          <SectionHeader kicker="Queue" title="검토 대기" href="/content" hrefLabel="전체 문서 보기" />
          {summary.reviewQueue.length > 0 ? (
            <div className="activity-list">
              {summary.reviewQueue.map((item) => (
                <Link key={item.id} href={`/content/${item.id}`} className="activity-item">
                  <div>
                    <strong>{item.title}</strong>
                    <p>{item.folderPath}</p>
                  </div>
                  <span>{new Date(item.updatedAt).toLocaleString("ko-KR")}</span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="empty-state compact-empty">
              <strong>검토 대기 문서가 없습니다.</strong>
              <p>현재 워크플로우는 깨끗한 상태이며 새 변경 요청이 들어오면 이 영역에 표시됩니다.</p>
            </div>
          )}
        </article>
      </section>

      <section className="detail-grid dashboard-detail-grid secondary-grid">
        <article className="panel section-panel">
          <SectionHeader kicker="Recovery" title="최근 백업" href="/operations" hrefLabel="백업 상세" />
          <div className="activity-list">
            {summary.backups.map((item) => (
              <div key={item.id} className="activity-item static-item">
                <div>
                  <strong>{item.runType}</strong>
                  <p>검증 {item.validationStatus}</p>
                </div>
                <div className="activity-meta">
                  <span className="status-badge" data-status={item.status}>
                    {item.status}
                  </span>
                  <span>{new Date(item.startedAt).toLocaleString("ko-KR")}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel section-panel">
          <SectionHeader kicker="Risk" title="오픈 리스크" href="/governance" hrefLabel="리스크 레지스터" />
          <div className="activity-list">
            {summary.risks.map((item) => (
              <div key={item.id} className="activity-item static-item">
                <div>
                  <strong>{item.title}</strong>
                  <p>{item.cause}</p>
                </div>
                <div className="activity-meta align-end">
                  <span>{item.owner}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel section-panel">
          <SectionHeader kicker="Release" title="최근 배포" href="/governance" hrefLabel="배포 이력" />
          <div className="activity-list">
            {summary.deployments.map((item) => (
              <div key={item.id} className="activity-item static-item">
                <div>
                  <strong>{item.releaseVersion}</strong>
                  <p>
                    {item.environment} · {item.buildNumber}
                  </p>
                </div>
                <div className="activity-meta align-end">
                  <span>{item.status}</span>
                  <span>{item.approvedBy ?? "승인자 미기록"}</span>
                </div>
              </div>
            ))}
          </div>
        </article>
      </section>
    </div>
  );
}
