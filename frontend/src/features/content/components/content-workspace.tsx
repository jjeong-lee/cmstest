import Link from "next/link";
import { FolderSummary, PortalFolderContents } from "@/lib/types";

function FolderNode({ folder, activeId }: { folder: FolderSummary; activeId?: string }) {
  return (
    <Link href={`/content?folderId=${folder.id}`} className="tree-link" data-active={folder.id === activeId}>
      <span className="tree-name">{folder.name}</span>
      <span className="tree-meta">{folder.childDocumentCount}</span>
    </Link>
  );
}

export function ContentWorkspace({
  rootFolders,
  contents,
}: {
  rootFolders: FolderSummary[];
  contents: PortalFolderContents;
}) {
  return (
    <div className="page-shell">
      <section className="workspace-layout">
        <aside className="panel folder-panel">
          <div className="section-heading">
            <div>
              <span className="section-kicker">Structure</span>
              <h3>폴더 탐색</h3>
            </div>
            <span className="eyebrow subtle">{rootFolders.length} roots</span>
          </div>
          <div className="tree-list">
            {rootFolders.map((folder) => (
              <FolderNode key={folder.id} folder={folder} activeId={contents.folder.id} />
            ))}
            {contents.folder.parentId && <FolderNode folder={contents.folder} activeId={contents.folder.id} />}
          </div>
        </aside>

        <section className="workspace-main">
          <article className="panel panel-hero compact-hero">
            <div className="split-head workspace-header">
              <div>
                <span className="eyebrow">Content workspace</span>
                <h1 className="page-title">{contents.folder.name}</h1>
                <p className="page-copy">{contents.breadcrumb.map((item) => item.name).join(" / ")}</p>
              </div>
              <div className="hero-actions compact-actions">
                <Link href={`/content/${contents.documents[0]?.id ?? ""}`} className="button">
                  최근 문서 열기
                </Link>
                <span className="button-ghost">상태, 담당자, 최근 수정 기준 정렬</span>
              </div>
            </div>
            <div className="stats-grid compact-stats">
              <article className="stat-card tone-neutral compact-stat">
                <span className="stat-label">하위 폴더</span>
                <strong className="stat-value">{contents.folders.length}</strong>
              </article>
              <article className="stat-card tone-accent compact-stat">
                <span className="stat-label">문서 수</span>
                <strong className="stat-value">{contents.documents.length}</strong>
              </article>
              <article className="stat-card tone-success compact-stat">
                <span className="stat-label">활성 상태</span>
                <strong className="stat-value small-value">{contents.folder.status}</strong>
              </article>
            </div>
          </article>

          {contents.folders.length > 0 && (
            <article className="panel section-panel">
              <div className="section-heading">
                <div>
                  <span className="section-kicker">Folders</span>
                  <h3>하위 폴더</h3>
                </div>
              </div>
              <div className="folder-card-grid">
                {contents.folders.map((folder) => (
                  <Link key={folder.id} href={`/content?folderId=${folder.id}`} className="content-card folder-card">
                    <span className="eyebrow subtle">Folder</span>
                    <strong>{folder.name}</strong>
                    <p>하위 문서 {folder.childDocumentCount}건</p>
                    <div className="meta-row">
                      <span className="status-badge" data-status={folder.status}>
                        {folder.status}
                      </span>
                      <span>{folder.hasChildren ? "하위 폴더 있음" : "말단 폴더"}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </article>
          )}

          <article className="panel section-panel">
            <div className="section-heading">
              <div>
                <span className="section-kicker">Documents</span>
                <h3>문서 목록</h3>
              </div>
              <span className="table-caption">폴더별 주요 메타데이터를 한 줄로 비교합니다.</span>
            </div>
            <div className="table-shell">
              <table className="data-table workspace-table">
                <thead>
                  <tr>
                    <th>문서</th>
                    <th>가시성</th>
                    <th>상태</th>
                    <th>최근 수정</th>
                    <th>변경 여부</th>
                  </tr>
                </thead>
                <tbody>
                  {contents.documents.map((document) => (
                    <tr key={document.id}>
                      <td>
                        <Link href={`/content/${document.id}`} className="table-primary-link">
                          <strong>{document.title}</strong>
                          <span>{document.summary}</span>
                        </Link>
                      </td>
                      <td>{document.visibilityScope}</td>
                      <td>
                        <span className="status-badge" data-status={document.status}>
                          {document.status}
                        </span>
                      </td>
                      <td>{new Date(document.updatedAt).toLocaleString("ko-KR")}</td>
                      <td>{document.hasUnpublishedChanges ? "미발행 변경 있음" : "게시 버전 동기화"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </article>
        </section>
      </section>
    </div>
  );
}
