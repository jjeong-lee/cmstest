import Link from "next/link";
import { DashboardSummary } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function DashboardSummaryView({ summary }: { summary: DashboardSummary }) {
  return (
    <div className="page-shell">
      <section className="hero-panel">
        <div className="header-row">
          <div>
            <span className="eyebrow">Dashboard</span>
            <h2 className="hero-title page-title">오늘의 운영 흐름을 한 화면에서 정리합니다.</h2>
            <p className="page-copy">
              Pinterest 레퍼런스의 카드 집중도는 유지하되, CMS 업무에 맞게 핵심 액션과 상태 전이를 앞세운 구성입니다.
            </p>
          </div>
          <div className="cta-row">
            <Link href="/entries/new" className="button">
              New Entry
            </Link>
            <Link href="/media" className="button-secondary">
              Open Media
            </Link>
          </div>
        </div>
        <div className="metrics-grid">
          {summary.kpis.map((kpi) => (
            <article key={kpi.key} className="metric-card">
              <h3>{kpi.label}</h3>
              <div className="metric-value">{kpi.value}</div>
              <p className="muted">{kpi.trend}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="page-header">
            <h3>Recent Entries</h3>
            <Link href="/entries" className="button-ghost">
              Browse all
            </Link>
          </div>
          <div className="entry-card-grid">
            {summary.recentEntries.map((entry) => (
              <Link key={entry.id} href={`/entries/${entry.id}`} className="entry-card">
                <div
                  className="entry-thumb"
                  style={{
                    backgroundImage: entry.thumbnailUrl
                      ? `linear-gradient(180deg, rgba(0,0,0,0.06), rgba(0,0,0,0.2)), url(${entry.thumbnailUrl})`
                      : "linear-gradient(135deg, #efe7dc, #d6c3ac)",
                  }}
                />
                <div className="entry-card-body">
                  <span className="status-badge" data-status={entry.status}>
                    {entry.status}
                  </span>
                  <strong>{entry.title}</strong>
                  <span className="muted">
                    {entry.contentType} • {entry.authorName}
                  </span>
                  <span className="muted">{formatDate(entry.updatedAt)}</span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Upcoming Publish Timeline</h3>
          <div className="timeline">
            {summary.upcomingPublications.map((item) => (
              <div key={item.id} className="timeline-item">
                <span className="status-badge" data-status={item.status}>
                  {item.status}
                </span>
                <strong>{item.title}</strong>
                <span className="muted">{formatDate(item.scheduledFor)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="dashboard-grid">
        <div className="panel">
          <div className="page-header">
            <h3>Recent Media</h3>
            <Link href="/media" className="button-ghost">
              Media library
            </Link>
          </div>
          <div className="asset-grid masonry">
            {summary.recentAssets.map((asset, index) => (
              <div key={asset.id} className="asset-card">
                <div
                  className="asset-thumb"
                  style={{
                    minHeight: `${210 + (index % 3) * 70}px`,
                    backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.2)), url(${asset.thumbnailUrl})`,
                  }}
                />
                <div className="asset-card-body">
                  <strong>{asset.fileName}</strong>
                  <span className="muted">{asset.altText}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="panel">
          <h3>Activity Feed</h3>
          <div className="activity-list">
            {summary.activity.map((item) => (
              <div key={item.id} className="activity-row">
                <span className="mini-badge">{item.action}</span>
                <strong>{item.entityLabel}</strong>
                <span className="muted">{item.actorName}</span>
                <span className="muted">{formatDate(item.createdAt)}</span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
