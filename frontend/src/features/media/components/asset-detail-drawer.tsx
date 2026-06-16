import { Asset } from "@/lib/types";

export function AssetDetailDrawer({ asset }: { asset?: Asset }) {
  if (!asset) {
    return (
      <aside className="detail-drawer sticky">
        <div className="empty-state">
          <strong>Select an asset</strong>
          <p className="muted">우측 드로어에서 alt text, 사용처, 상태를 확인할 수 있습니다.</p>
        </div>
      </aside>
    );
  }

  return (
    <aside className="detail-drawer sticky">
      <span className="eyebrow">{asset.status}</span>
      <h3>{asset.fileName}</h3>
      <p className="muted">{asset.altText}</p>
      <div
        className="asset-thumb"
        style={{
          minHeight: "240px",
          backgroundImage: `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.2)), url(${asset.thumbnailUrl})`,
        }}
      />
      <div className="asset-refs">
        <strong>Usage References</strong>
        {asset.references?.length ? (
          asset.references.map((reference) => (
            <div key={reference.id} className="timeline-item">
              <span className="status-badge" data-status={reference.status}>
                {reference.status}
              </span>
              <strong>{reference.title}</strong>
            </div>
          ))
        ) : (
          <span className="muted">No linked entries yet.</span>
        )}
      </div>
    </aside>
  );
}
