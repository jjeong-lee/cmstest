import { apiFallbacks, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { mockEntries } from "@/lib/mock-data";
import { ContentType, EntryDetail } from "@/lib/types";

export async function listContentTypes(): Promise<ContentType[]> {
  const response = await apiGet<{ items: ContentType[] }>("/content-types", apiFallbacks.contentTypes);
  return response.items;
}

export async function listEntries(): Promise<EntryDetail[]> {
  const response = await apiGet<{ items: EntryDetail[] }>("/entries", apiFallbacks.entries);
  return response.items;
}

export async function getEntry(entryId: string): Promise<EntryDetail> {
  return apiGet<EntryDetail>(`/entries/${entryId}`, mockEntries.find((entry) => entry.id === entryId) ?? mockEntries[0]);
}

export async function createEntry(payload: Record<string, unknown>): Promise<EntryDetail> {
  return apiPost<EntryDetail>("/entries", payload, mockEntries[0]);
}

export async function updateEntry(entryId: string, payload: Record<string, unknown>): Promise<EntryDetail> {
  return apiPatch<EntryDetail>(`/entries/${entryId}`, payload, mockEntries[0]);
}

export async function listRevisions(entryId: string) {
  const entry = await getEntry(entryId);
  return { items: entry.revisions };
}

export async function submitForReview(entryId: string, submissionNote?: string) {
  return apiPost(`/entries/${entryId}/submit`, { submissionNote }, { id: "mock-review", status: "open" });
}
