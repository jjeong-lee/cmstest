import { listEntries } from "@/features/entries/api/entries";
import { EntriesList } from "@/features/entries/components/entries-list";

export default async function EntriesPage() {
  const entries = await listEntries();
  return <EntriesList entries={entries} />;
}
