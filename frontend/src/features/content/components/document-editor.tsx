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
      <button className={tone === "primary" ? "button" : tone === "secondary" ? "button-secondary" : tone === "ghost" ? "button-ghost" : "button-danger"} type="submit">
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
          <div className="panel-head">
            <div>
              <span className="eyebrow">ADM-03 Editor</span>
              <h1 className="page-title">{document.title}</h1>
            </div>
            <div className="meta-row">
              <span className="status-badge" data-status={document.status}>
                {document.status}
              </span>
              <span>{document.folderPath.join(" / ")}</span>
            </div>
          </div>
          <div className="editor-columns">
            <section className="editor-pane">
              <h3>Markdown Editor</h3>
              <pre>{document.markdownBody}</pre>
            </section>
            <section className="preview-pane">
              <h3>Preview</h3>
              <div dangerouslySetInnerHTML={{ __html: document.renderedBody }} />
            </section>
          </div>
          <div className="tab-strip">
            <span>Attachments {document.attachments.length}</span>
            <span>PDF Import {latestVersion?.status ?? "NOT_REQUESTED"}</span>
            <span>Validation OK</span>
            <span>Version Notes {latestVersion?.changeSummary ?? "변경 메모 없음"}</span>
          </div>
        </article>

        <aside className="side-column">
          <article className="panel">
            <div className="panel-head">
              <h3>발행 / 이력 패널</h3>
              <span className="eyebrow subtle">ADM-04</span>
            </div>
            <div className="cta-column">
              <ActionForm action={`/content/${document.id}/actions/save`} label="Save" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/submit-review`} label="Submit Review" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/approve`} label="Approve" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/publish`} label="Publish" tone="primary" />
              <ActionForm action={`/content/${document.id}/actions/unpublish`} label="게시중단" tone="ghost" />
              <ActionForm action={`/content/${document.id}/actions/delete`} label="삭제" tone="danger" />
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>첨부파일</h3>
              <Link href="/attachments" className="text-link">
                Attachment Manager
              </Link>
            </div>
            <div className="stack-list">
              {document.attachments.map((attachment) => (
                <div key={attachment.id} className="content-card compact">
                  <strong>{attachment.originalFilename}</strong>
                  <div className="meta-row">
                    <span>{attachment.contentType}</span>
                    <span>{Math.round(attachment.fileSize / 1024)} KB</span>
                  </div>
                </div>
              ))}
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>버전 이력</h3>
              <span className="eyebrow subtle">Version Drawer</span>
            </div>
            <div className="stack-list">
              {document.versions.map((version) => (
                <div key={version.id} className="content-card compact">
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
