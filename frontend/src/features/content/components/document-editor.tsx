import Link from "next/link";
import { DocumentDetail } from "@/lib/types";

function ActionForm({
  action,
  label,
  tone = "secondary",
}: {
  action: string;
  label: string;
  tone?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <form action={action} method="post">
      <button
        className={
          tone === "primary"
            ? "button action-button"
            : tone === "secondary"
              ? "button-secondary action-button"
              : tone === "ghost"
                ? "button-ghost action-button"
                : "button-danger action-button"
        }
        type="submit"
      >
        {label}
      </button>
    </form>
  );
}

export function DocumentEditor({ document }: { document: DocumentDetail }) {
  const latestVersion = document.versions[0];

  return (
    <div className="page-shell">
      <section className="editor-layout">
        <article className="panel editor-surface">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Document editor</span>
              <h1 className="page-title">{document.title}</h1>
              <p className="page-copy">{document.summary}</p>
            </div>
            <div className="meta-column">
              <span className="status-badge" data-status={document.status}>
                {document.status}
              </span>
              <span>{document.folderPath.join(" / ")}</span>
              <span>수정일 {new Date(document.updatedAt).toLocaleString("ko-KR")}</span>
            </div>
          </div>

          <div className="stats-grid compact-stats editor-overview-grid">
            <article className="stat-card tone-accent compact-stat">
              <span className="stat-label">최신 버전</span>
              <strong className="stat-value small-value">v{latestVersion?.versionNo ?? 0}</strong>
            </article>
            <article className="stat-card tone-success compact-stat">
              <span className="stat-label">첨부파일</span>
              <strong className="stat-value">{document.attachments.length}</strong>
            </article>
            <article className="stat-card tone-warning compact-stat">
              <span className="stat-label">발행 상태</span>
              <strong className="stat-value small-value">{document.publishedAt ? "게시됨" : "미게시"}</strong>
            </article>
          </div>

          <div className="editor-columns">
            <section className="editor-pane">
              <div className="pane-toolbar">
                <strong>Markdown</strong>
                <span>원문 편집 영역</span>
              </div>
              <pre>{document.markdownBody}</pre>
            </section>
            <section className="preview-pane">
              <div className="pane-toolbar">
                <strong>Preview</strong>
                <span>렌더링 결과</span>
              </div>
              <div className="markdown-body" dangerouslySetInnerHTML={{ __html: document.renderedBody }} />
            </section>
          </div>

          <div className="tab-strip info-strip">
            <span>첨부파일 {document.attachments.length}</span>
            <span>PDF Import {latestVersion?.status ?? "NOT_REQUESTED"}</span>
            <span>검증 Validation OK</span>
            <span>버전 메모 {latestVersion?.changeSummary ?? "변경 메모 없음"}</span>
          </div>
        </article>

        <aside className="side-column">
          <article className="panel section-panel">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Workflow</span>
                <h3>문서 액션</h3>
              </div>
            </div>
            <div className="action-grid">
              <ActionForm action={`/content/${document.id}/actions/save`} label="저장 Save" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/submit-review`} label="검토 요청" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/approve`} label="승인 Approve" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/publish`} label="발행 Publish" tone="primary" />
              <ActionForm action={`/content/${document.id}/actions/unpublish`} label="게시중단" tone="ghost" />
              <ActionForm action={`/content/${document.id}/actions/delete`} label="삭제" tone="danger" />
            </div>
          </article>

          <article className="panel section-panel">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Assets</span>
                <h3>첨부파일</h3>
              </div>
              <Link href="/attachments" className="text-link">
                첨부 관리
              </Link>
            </div>
            <div className="stack-list">
              {document.attachments.map((attachment) => (
                <div key={attachment.id} className="content-card compact asset-card">
                  <strong>{attachment.originalFilename}</strong>
                  <div className="meta-row">
                    <span>{attachment.contentType}</span>
                    <span>{Math.round(attachment.fileSize / 1024)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel section-panel">
            <div className="section-heading">
              <div>
                <span className="section-kicker">History</span>
                <h3>버전 이력</h3>
              </div>
            </div>
            <div className="stack-list">
              {document.versions.map((version) => (
                <div key={version.id} className="content-card compact history-card">
                  <div className="meta-row">
                    <strong>v{version.versionNo}</strong>
                    <span className="status-badge" data-status={version.status}>
                      {version.status}
                    </span>
                  </div>
                  <span>{version.changeSummary ?? "요약 없음"}</span>
                  <span>{new Date(version.createdAt).toLocaleString("ko-KR")}</span>
                </div>
              ))}
            </div>
          </article>
        </aside>
      </section>
    </div>
  );
}
