import { ReactNode } from "react";
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

function RegistryColumn({
  kicker,
  title,
  children,
}: {
  kicker: string;
  title: string;
  children: ReactNode;
}) {
  return (
    <article className="panel section-panel">
      <div className="section-heading">
        <div>
          <span className="section-kicker">{kicker}</span>
          <h3>{title}</h3>
        </div>
      </div>
      <div className="activity-list">{children}</div>
    </article>
  );
}

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
      <section className="panel panel-hero compact-hero">
        <div className="split-head workspace-header">
          <div>
            <span className="eyebrow">Governance registry</span>
            <h1 className="page-title">일정, 범위, 인력, 위험, 산출물, 변경 요청을 관리자 레지스터 뷰로 정리했습니다.</h1>
            <p className="page-copy">레퍼런스 대시보드처럼 모듈형 패널을 사용해 운영 데이터군을 주제별로 분리했습니다.</p>
          </div>
          <div className="hero-actions compact-actions">
            <span className="button-ghost">레지스터 3개 영역</span>
          </div>
        </div>
      </section>

      <section className="stats-grid compact-stats">
        <article className="stat-card tone-accent compact-stat">
          <span className="stat-label">배포 항목</span>
          <strong className="stat-value">{deployments.length}</strong>
        </article>
        <article className="stat-card tone-success compact-stat">
          <span className="stat-label">일정 항목</span>
          <strong className="stat-value">{schedules.length}</strong>
        </article>
        <article className="stat-card tone-warning compact-stat">
          <span className="stat-label">변경 요청</span>
          <strong className="stat-value">{changeRequests.length}</strong>
        </article>
      </section>

      <section className="detail-grid governance-grid">
        <RegistryColumn kicker="Inventory" title="소프트웨어 / 배포">
          {softwareInventory.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.componentName}</strong>
                <p>
                  {item.version} · {item.licenseStatus}
                </p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.riskLevel}</span>
                <span>{item.componentType}</span>
              </div>
            </div>
          ))}
          {deployments.map((item) => (
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
        </RegistryColumn>

        <RegistryColumn kicker="Planning" title="일정 / 범위 / 인력">
          {schedules.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.name}</strong>
                <p>{item.phase}</p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.ownerName}</span>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
          {scopeItems.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.requirementId}</strong>
                <p>{item.title}</p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.status}</span>
                <span>{item.note ?? "메모 없음"}</span>
              </div>
            </div>
          ))}
          {staffAssignments.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.assignee}</strong>
                <p>{item.role}</p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.approvalStatus}</span>
                <span>
                  {item.startDate} → {item.endDate}
                </span>
              </div>
            </div>
          ))}
        </RegistryColumn>

        <RegistryColumn kicker="Controls" title="위험 / 산출물 / 변경 요청">
          {risks.map((item) => (
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
          {deliverables.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.name}</strong>
                <p>{item.version}</p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.approvalStatus}</span>
                <span>{item.dueDate}</span>
              </div>
            </div>
          ))}
          {changeRequests.map((item) => (
            <div key={item.id} className="activity-item static-item">
              <div>
                <strong>{item.title}</strong>
                <p>{item.impactAnalysis || "영향도 분석 필요"}</p>
              </div>
              <div className="activity-meta align-end">
                <span>{item.requester}</span>
                <span>{item.status}</span>
              </div>
            </div>
          ))}
        </RegistryColumn>
      </section>
    </div>
  );
}
