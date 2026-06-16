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
              <span className="eyebrow">ADM-03 문서 편집기</span>
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
              <h3>마크다운 편집 Markdown Editor</h3>
              <pre>{document.markdownBody}</pre>
            </section>
            <section className="preview-pane">
              <h3>미리보기 Preview</h3>
              <div dangerouslySetInnerHTML={{ __html: document.renderedBody }} />
            </section>
          </div>
          <div className="tab-strip">
            <span>첨부파일 Attachments {document.attachments.length}</span>
            <span>PDF Import {latestVersion?.status ?? "NOT_REQUESTED"}</span>
            <span>검증 Validation OK</span>
            <span>버전 메모 {latestVersion?.changeSummary ?? "변경 메모 없음"}</span>
          </div>
        </article>

        <aside className="side-column">
          <article className="panel">
            <div className="panel-head">
              <h3>발행 / 이력 패널</h3>
              <span className="eyebrow subtle">ADM-04</span>
            </div>
            <div className="cta-column">
              <ActionForm action={`/content/${document.id}/actions/save`} label="저장 Save" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/submit-review`} label="검토 요청" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/approve`} label="승인 Approve" tone="secondary" />
              <ActionForm action={`/content/${document.id}/actions/publish`} label="발행 Publish" tone="primary" />
              <ActionForm action={`/content/${document.id}/actions/unpublish`} label="게시중단" tone="ghost" />
              <ActionForm action={`/content/${document.id}/actions/delete`} label="삭제" tone="danger" />
            </div>
          </article>

          <article className="panel">
            <div className="panel-head">
              <h3>첨부파일</h3>
              <Link href="/attachments" className="text-link">
                첨부 관리 Attachment Manager
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
              <span className="eyebrow subtle">버전 패널 Version Drawer</span>
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
