import Link from "next/link";
import { DocumentDetail, FolderSummary, PortalFolderContents, SearchResult } from "@/lib/types";

export function PortalHome({ tree, featured }: { tree: FolderSummary[]; featured: PortalFolderContents }) {
  return (
    <div className="portal-shell">
      <section className="portal-sidebar">
        <div className="panel">
          <div className="panel-head">
            <h3>폴더 트리 Folder Tree</h3>
          </div>
          <div className="tree-list">
            {tree.map((folder) => (
              <Link key={folder.id} href={`/portal/folders/${folder.id}`} className="tree-link">
                <span>{folder.name}</span>
                <span className="tree-meta">{folder.childDocumentCount}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="portal-main">
        <article className="hero-panel">
          <span className="eyebrow">POR-01 포털 홈 Portal Home</span>
          <h1 className="page-title">최근 업데이트와 자주 찾는 운영 문서를 카드 레이아웃으로 탐색합니다.</h1>
          <p className="page-copy">대형 히어로 대신 문서 카드와 경로, 수정일 요약이 중심이 되는 에디토리얼 홈 화면입니다.</p>
        </article>

        <div className="editorial-grid">
          {featured.documents.map((document, index) => (
            <Link key={document.id} href={`/portal/documents/${document.id}`} className={`content-card ${index === 0 ? "feature-card wide" : ""}`}>
              <span className="eyebrow subtle">{document.visibilityScope}</span>
              <strong>{document.title}</strong>
              <p>{document.summary}</p>
              <div className="meta-row">
                <span>{featured.breadcrumb.map((item) => item.name).join(" / ")}</span>
                <span>{new Date(document.updatedAt).toLocaleDateString("ko-KR")}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}

export function PortalFolderView({ contents }: { contents: PortalFolderContents }) {
  return (
    <div className="portal-page">
      <div className="portal-breadcrumb">
        {contents.breadcrumb.map((item, index) => (
          <span key={item.id}>
            {index > 0 ? " / " : ""}
            {item.name}
          </span>
        ))}
      </div>
      <div className="editorial-grid">
        {contents.documents.map((document) => (
          <Link key={document.id} href={`/portal/documents/${document.id}`} className="content-card feature-card">
            <strong>{document.title}</strong>
            <p>{document.summary}</p>
            <div className="meta-row">
              <span className="status-badge" data-status={document.status}>
                {document.status}
              </span>
              <span>{new Date(document.updatedAt).toLocaleString("ko-KR")}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export function PortalDocumentView({ document }: { document: DocumentDetail }) {
  return (
    <div className="portal-page">
      <div className="portal-breadcrumb">{document.folderPath.join(" / ")}</div>
      <article className="portal-document">
        <div className="panel-head">
          <div>
            <h1 className="page-title">{document.title}</h1>
            <p className="page-copy">{document.summary}</p>
          </div>
          <div className="meta-column">
            <span>수정일 {new Date(document.updatedAt).toLocaleDateString("ko-KR")}</span>
            <span>첨부 {document.attachments.length}건</span>
          </div>
        </div>
        <div className="markdown-body" dangerouslySetInnerHTML={{ __html: document.renderedBody }} />
      </article>
      <article className="panel">
        <div className="panel-head">
          <h3>첨부파일 Attachments</h3>
        </div>
        <div className="stack-list">
          {document.attachments.map((attachment) => (
            <a key={attachment.id} href={attachment.downloadUrl ?? "#"} className="content-card compact">
              <strong>{attachment.originalFilename}</strong>
              <div className="meta-row">
                <span>{attachment.contentType}</span>
                <span>{Math.round(attachment.fileSize / 1024)} KB</span>
              </div>
            </a>
          ))}
        </div>
      </article>
    </div>
  );
}

export function PortalSearchView({ query, results }: { query: string; results: { total: number; items: SearchResult[] } }) {
  return (
    <div className="portal-page">
      <section className="hero-panel compact-hero">
        <span className="eyebrow">POR-03 검색 Search</span>
        <h1 className="page-title">"{query}" 검색 결과</h1>
        <p className="page-copy">{results.total}건의 게시 문서를 찾았습니다.</p>
      </section>
      <div className="stack-list">
        {results.items.map((item) => (
          <Link key={item.documentId} href={`/portal/documents/${item.documentId}`} className="content-card">
            <strong>{item.title}</strong>
            <span>{item.folderPath}</span>
            <p>{item.summary}</p>
            <div className="meta-row">
              <span>{new Date(item.updatedAt).toLocaleString("ko-KR")}</span>
              <span>score {item.score.toFixed(1)}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
