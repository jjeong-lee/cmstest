import Link from "next/link";
import { DashboardSummary } from "@/lib/types";

const toneClass = {
  accent: "accent",
  success: "success",
  warning: "warning",
  neutral: "neutral",
};

export function DashboardSummaryView({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="page-shell">
      <section className="dashboard-hero panel panel-hero">
        <div>
          <span className="eyebrow">CMS overview</span>
          <h1 className="page-title">콘텐츠 운영 상태를 Tailwind Admin 스타일의 요약 보드로 재구성했습니다.</h1>
          <p className="page-copy">
            발행, 검토, 백업, 리스크를 같은 시야에 두고 즉시 이동할 수 있도록 카드 계층과 액션 배치를 단순화했습니다.
          </p>
        </div>
        <div className="hero-actions">
          <Link href="/content" className="button">
            문서 워크스페이스 열기
          </Link>
          <Link href="/operations" className="button-secondary">
            운영 상태 보기
          </Link>
        </div>
      </section>

      <section className="stats-grid" aria-label="핵심 지표">
        {summary.highlights.map((item) => (
          <article key={item.key} className={`stat-card tone-${toneClass[item.tone]}`}>
            <span className="stat-label">{item.label}</span>
            <strong className="stat-value">{item.value}</strong>
            <span className="stat-meta">실시간 관리자 지표</span>
          </article>
        ))}
      </section>

      <section className="detail-grid dashboard-detail-grid">
        <article className="panel section-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Publishing</span>
              <h3>최근 발행 문서</h3>
            </div>
            <Link href="/portal" className="text-link">
              포털 미리보기
            </Link>
          </div>
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
          <div className="section-heading">
            <div>
              <span className="section-kicker">Queue</span>
              <h3>검토 대기</h3>
            </div>
            <Link href="/content" className="text-link">
              전체 문서 보기
            </Link>
          </div>
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
          <div className="section-heading">
            <div>
              <span className="section-kicker">Recovery</span>
              <h3>최근 백업</h3>
            </div>
            <Link href="/operations" className="text-link">
              백업 상세
            </Link>
          </div>
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
          <div className="section-heading">
            <div>
              <span className="section-kicker">Risk</span>
              <h3>오픈 리스크</h3>
            </div>
            <Link href="/governance" className="text-link">
              리스크 레지스터
            </Link>
          </div>
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
          <div className="section-heading">
            <div>
              <span className="section-kicker">Release</span>
              <h3>최근 배포</h3>
            </div>
            <Link href="/governance" className="text-link">
              배포 이력
            </Link>
          </div>
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
