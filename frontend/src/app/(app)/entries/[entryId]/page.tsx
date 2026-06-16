import { getEntry, listContentTypes } from "@/features/entries/api/entries";
import { EntryEditorForm } from "@/features/entries/components/entry-editor-form";
import { RevisionTimeline } from "@/features/entries/components/revision-timeline";
import { listAssets } from "@/features/media/api/media";

export default async function EntryDetailPage({ params }: { params: Promise<{ entryId: string }> }) {
  const { entryId } = await params;
  const [entry, contentTypes, assets] = await Promise.all([
    getEntry(entryId),
    listContentTypes(),
    listAssets(),
  ]);

  return (
    <div className="page-shell">
      <EntryEditorForm entry={entry} contentTypes={contentTypes} assets={assets} />
      <RevisionTimeline revisions={entry.revisions} />
    </div>
  );
}
