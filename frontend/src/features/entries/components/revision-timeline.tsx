import { EntryRevision } from "@/lib/types";

function formatDate(value: string) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(value));
}

export function RevisionTimeline({ revisions }: { revisions: EntryRevision[] }) {
  return (
    <div className="panel">
      <h3>Revision Timeline</h3>
      <div className="timeline">
        {revisions.map((revision) => (
          <div key={revision.id} className="timeline-item">
            <strong>v{revision.versionNumber}</strong>
            <span className="muted">{revision.changeNote ?? "Saved draft"}</span>
            <span className="muted">{formatDate(revision.createdAt)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
