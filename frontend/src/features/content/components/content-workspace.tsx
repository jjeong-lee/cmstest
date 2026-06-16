import Link from "next/link";
import { FolderSummary, PortalFolderContents } from "@/lib/types";

function FolderNode({ folder, activeId }: { folder: FolderSummary; activeId?: string }) {
  return (
    <Link href={`/content?folderId=${folder.id}`} className="tree-link" data-active={folder.id === activeId}>
      <span>{folder.name}</span>
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
          <div className="panel-head">
            <h3>폴더 트리 Folder Tree</h3>
            <span className="eyebrow subtle">ADM-02</span>
          </div>
          <div className="tree-list">
            {rootFolders.map((folder) => (
              <FolderNode key={folder.id} folder={folder} activeId={contents.folder.id} />
            ))}
            {contents.folder.parentId && <FolderNode folder={contents.folder} activeId={contents.folder.id} />}
          </div>
        </aside>

        <section className="workspace-main">
          <article className="hero-panel compact-hero">
            <div className="split-head">
              <div>
                <span className="eyebrow">현재 폴더 Current Folder</span>
                <h1 className="page-title">{contents.folder.name}</h1>
                <p className="page-copy">{contents.breadcrumb.map((item) => item.name).join(" / ")}</p>
              </div>
              <div className="cta-row">
                <Link href={`/content/${contents.documents[0]?.id ?? ""}`} className="button">
                  최근 문서 열기
                </Link>
                <span className="button-ghost">상태 / 담당 / 정렬</span>
              </div>
            </div>
          </article>

          <div className="editorial-grid">
            {contents.folders.map((folder) => (
              <Link key={folder.id} href={`/content?folderId=${folder.id}`} className="content-card">
                <span className="eyebrow subtle">폴더 Folder</span>
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
            {contents.documents.map((document) => (
              <Link key={document.id} href={`/content/${document.id}`} className="content-card feature-card">
                <div className="meta-row">
                  <span className="eyebrow subtle">{document.visibilityScope}</span>
                  <span className="status-badge" data-status={document.status}>
                    {document.status}
                  </span>
                </div>
                <strong>{document.title}</strong>
                <p>{document.summary}</p>
                <div className="meta-row">
                  <span>{new Date(document.updatedAt).toLocaleString("ko-KR")}</span>
                  <span>{document.hasUnpublishedChanges ? "미발행 변경 있음" : "게시 버전 동기화"}</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </section>
    </div>
  );
}
