import { listContentTypes } from "@/features/entries/api/entries";
import { EntryEditorForm } from "@/features/entries/components/entry-editor-form";
import { listAssets } from "@/features/media/api/media";

export default async function NewEntryPage() {
  const [contentTypes, assets] = await Promise.all([listContentTypes(), listAssets()]);
  return <EntryEditorForm contentTypes={contentTypes} assets={assets} />;
}
