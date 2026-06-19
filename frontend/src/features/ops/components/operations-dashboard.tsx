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
      <section className="panel panel-hero compact-hero">
        <div className="split-head workspace-header">
          <div>
            <span className="eyebrow">Operations center</span>
            <h1 className="page-title">헬스 체크, 백업, 복구 상태를 운영 콘솔 카드와 테이블로 재정렬했습니다.</h1>
            <p className="page-copy">서비스 상태를 요약 카드로 압축하고, 백업 이력은 비교하기 쉬운 리스트 패널로 정리했습니다.</p>
          </div>
          <div className="hero-actions compact-actions">
            <span className="button-ghost">마지막 점검 {new Date(health.checkedAt).toLocaleString("ko-KR")}</span>
          </div>
        </div>
      </section>

      <section className="stats-grid">
        {health.components.map((component) => (
          <article key={component.name} className="stat-card tone-neutral">
            <span className="stat-label">{component.name}</span>
            <strong className="stat-value small-value">{component.status}</strong>
            <span className="stat-meta">시스템 컴포넌트 상태</span>
          </article>
        ))}
        <article className="stat-card tone-warning">
          <span className="stat-label">전체 상태</span>
          <strong className="stat-value small-value">{health.status}</strong>
          <span className="stat-meta">운영 대시보드 집계</span>
        </article>
      </section>

      <section className="panel section-panel">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Backups</span>
            <h3>백업 실행 이력</h3>
          </div>
          <span className="table-caption">최근 백업 결과와 검증 상태를 시간순으로 확인합니다.</span>
        </div>
        <div className="activity-list">
          {backups.map((backup) => (
            <div key={backup.id} className="activity-item static-item">
              <div>
                <strong>{backup.runType}</strong>
                <p>검증 {backup.validationStatus}</p>
              </div>
              <div className="activity-meta">
                <span className="status-badge" data-status={backup.status}>
                  {backup.status}
                </span>
                <span>{new Date(backup.startedAt).toLocaleString("ko-KR")}</span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
