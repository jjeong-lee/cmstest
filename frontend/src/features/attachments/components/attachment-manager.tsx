import { DocumentDetail } from "@/lib/types";

export function AttachmentManager({ document }: { document: DocumentDetail }) {
  return (
    <div className="page-shell">
      <section className="panel panel-hero compact-hero">
        <div className="split-head workspace-header">
          <div>
            <span className="eyebrow">Attachment manager</span>
            <h1 className="page-title">첨부파일 메타데이터와 연결 상태를 한 테이블에서 관리합니다.</h1>
            <p className="page-copy">레퍼런스 관리자 화면처럼 상단 요약 카드와 하단 데이터 테이블 중심으로 구조를 바꿨습니다.</p>
          </div>
          <div className="hero-actions compact-actions">
            <span className="button-ghost">연결 문서 {document.title}</span>
          </div>
        </div>
        <div className="stats-grid compact-stats">
          <article className="stat-card tone-accent compact-stat">
            <span className="stat-label">첨부 수</span>
            <strong className="stat-value">{document.attachments.length}</strong>
          </article>
          <article className="stat-card tone-success compact-stat">
            <span className="stat-label">활성 파일</span>
            <strong className="stat-value">
              {document.attachments.filter((item) => item.status === "ACTIVE").length}
            </strong>
          </article>
          <article className="stat-card tone-neutral compact-stat">
            <span className="stat-label">연결 문서</span>
            <strong className="stat-value small-value">1</strong>
          </article>
        </div>
      </section>

      <section className="panel section-panel">
        <div className="section-heading">
          <div>
            <span className="section-kicker">Files</span>
            <h3>{document.title}</h3>
          </div>
          <span className="table-caption">파일명, 형식, 크기, 상태를 비교할 수 있는 관리자용 표입니다.</span>
        </div>
        <div className="table-shell">
          <table className="data-table">
            <thead>
              <tr>
                <th>파일명</th>
                <th>형식</th>
                <th>크기</th>
                <th>상태</th>
                <th>다운로드</th>
              </tr>
            </thead>
            <tbody>
              {document.attachments.map((attachment) => (
                <tr key={attachment.id}>
                  <td>
                    <div className="table-primary-link static-link">
                      <strong>{attachment.originalFilename}</strong>
                      <span>{document.title} 문서에 연결됨</span>
                    </div>
                  </td>
                  <td>{attachment.contentType}</td>
                  <td>{Math.round(attachment.fileSize / 1024)} KB</td>
                  <td>
                    <span className="status-badge" data-status={attachment.status}>
                      {attachment.status}
                    </span>
                  </td>
                  <td>{attachment.downloadUrl ? "사용 가능" : "없음"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}
