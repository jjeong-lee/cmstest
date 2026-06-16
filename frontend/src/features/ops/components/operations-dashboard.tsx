import { BackupRun, HealthStatus } from "@/lib/types";

export function OperationsDashboard({
  health,
  backups,
}: {
  health: HealthStatus;
  backups: BackupRun[];
}) {
  return (
    <div className="page-shell">
      <section className="hero-panel compact-hero">
        <span className="eyebrow">ADM-06 운영 Operations</span>
        <h1 className="page-title">헬스 체크, 백업, 복구 상태를 운영 콘솔에서 통제합니다.</h1>
        <p className="page-copy">부분 실패 여부와 검증 상태를 한눈에 확인할 수 있도록 카드 밀도를 높였습니다.</p>
      </section>

      <section className="card-grid triple-grid">
        {health.components.map((component) => (
          <article key={component.name} className="metric-card">
            <span className="eyebrow subtle">{component.name}</span>
            <strong className="metric-value">{component.status}</strong>
          </article>
        ))}
      </section>

      <section className="panel">
        <div className="panel-head">
          <h3>백업 실행 이력</h3>
          <span className="eyebrow subtle">{health.status}</span>
        </div>
        <div className="stack-list">
          {backups.map((backup) => (
            <div key={backup.id} className="content-card">
              <div className="meta-row">
                <strong>{backup.runType}</strong>
                <span className="status-badge" data-status={backup.status}>
                  {backup.status}
                </span>
              </div>
              <div className="meta-row">
                <span>검증 {backup.validationStatus}</span>
                <span>{new Date(backup.startedAt).toLocaleString("ko-KR")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
