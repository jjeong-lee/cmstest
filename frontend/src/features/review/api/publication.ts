import { apiPost } from "@/lib/api-client";

export async function publishEntry(entryId: string) {
  return apiPost(`/publication/${entryId}/publish`, {}, { status: "processed" });
}

export async function schedulePublication(entryId: string, scheduledFor: string) {
  return apiPost(`/publication/${entryId}/schedule`, { scheduledFor }, { status: "pending", scheduledFor });
}

export async function unpublishEntry(entryId: string, reason?: string) {
  return apiPost(`/publication/${entryId}/unpublish`, { reason }, { status: "archived" });
}
