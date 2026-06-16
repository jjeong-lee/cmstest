import { DocumentDetail } from "@/lib/types";

export function AttachmentManager({ document }: { document: DocumentDetail }) {
  return (
    <div className="page-shell">
      <section className="hero-panel compact-hero">
        <span className="eyebrow">ADM-05 Attachments</span>
        <h1 className="page-title">첨부파일 메타데이터와 연결 상태를 관리합니다.</h1>
        <p className="page-copy">파일명, 형식, 크기, 다운로드 가능 여부를 문서 연결 상태와 함께 확인합니다.</p>
      </section>
      <section className="panel">
        <div className="panel-head">
          <h3>{document.title}</h3>
          <span className="eyebrow subtle">{document.attachments.length} files</span>
        </div>
        <div className="stack-list">
          {document.attachments.map((attachment) => (
            <div key={attachment.id} className="content-card">
              <strong>{attachment.originalFilename}</strong>
              <div className="meta-row">
                <span>{attachment.contentType}</span>
                <span>{Math.round(attachment.fileSize / 1024)} KB</span>
                <span className="status-badge" data-status={attachment.status}>
                  {attachment.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
