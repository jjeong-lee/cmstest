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
      <section className="hero-panel">
        <span className="eyebrow">ADM-01 Dashboard</span>
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

      <section className="card-grid metrics-grid">
        {summary.highlights.map((item) => (
          <article key={item.key} className={`metric-card tone-${toneClass[item.tone]}`}>
            <span className="eyebrow subtle">{item.label}</span>
            <strong className="metric-value">{item.value}</strong>
          </article>
        ))}
      </section>

      <section className="masonry-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>최근 발행 문서</h3>
            <Link href="/portal" className="text-link">
              Portal 미리보기
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
              Operations
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
              Governance
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
