import {
  ChangeRequest,
  Deliverable,
  DeploymentRelease,
  ProjectSchedule,
  RiskIssue,
  ScopeItem,
  SoftwareInventoryItem,
  StaffAssignment,
} from "@/lib/types";

export function GovernanceDashboard({
  softwareInventory,
  deployments,
  schedules,
  scopeItems,
  staffAssignments,
  risks,
  deliverables,
  changeRequests,
}: {
  softwareInventory: SoftwareInventoryItem[];
  deployments: DeploymentRelease[];
  schedules: ProjectSchedule[];
  scopeItems: ScopeItem[];
  staffAssignments: StaffAssignment[];
  risks: RiskIssue[];
  deliverables: Deliverable[];
  changeRequests: ChangeRequest[];
}) {
  return (
    <div className="page-shell">
      <section className="hero-panel compact-hero">
        <span className="eyebrow">ADM-07 Governance</span>
        <h1 className="page-title">일정, 범위, 인력, 위험, 산출물, 변경 요청을 하나의 레지스터로 확인합니다.</h1>
      </section>

      <section className="masonry-grid">
        <article className="panel">
          <div className="panel-head">
            <h3>소프트웨어 / 배포</h3>
          </div>
          <div className="stack-list">
            {softwareInventory.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.componentName}</strong>
                <div className="meta-row">
                  <span>{item.version}</span>
                  <span>{item.licenseStatus}</span>
                  <span>{item.riskLevel}</span>
                </div>
              </div>
            ))}
            {deployments.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.releaseVersion}</strong>
                <div className="meta-row">
                  <span>{item.environment}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>일정 / 범위 / 인력</h3>
          </div>
          <div className="stack-list">
            {schedules.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.name}</strong>
                <span>{item.phase}</span>
                <div className="meta-row">
                  <span>{item.ownerName}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
            {scopeItems.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.requirementId}</strong>
                <span>{item.title}</span>
              </div>
            ))}
            {staffAssignments.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.assignee}</strong>
                <div className="meta-row">
                  <span>{item.role}</span>
                  <span>{item.approvalStatus}</span>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel">
          <div className="panel-head">
            <h3>위험 / 산출물 / 변경 요청</h3>
          </div>
          <div className="stack-list">
            {risks.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.title}</strong>
                <div className="meta-row">
                  <span>{item.owner}</span>
                  <span>{item.status}</span>
                </div>
              </div>
            ))}
            {deliverables.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.name}</strong>
                <div className="meta-row">
                  <span>{item.version}</span>
                  <span>{item.approvalStatus}</span>
                </div>
              </div>
            ))}
            {changeRequests.map((item) => (
              <div key={item.id} className="content-card compact">
                <strong>{item.title}</strong>
                <span>{item.impactAnalysis || "영향도 분석 필요"}</span>
                <div className="meta-row">
                  <span>{item.requester}</span>
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
