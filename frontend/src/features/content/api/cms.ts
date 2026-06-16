import { apiDelete, apiFallbacks, apiGet, apiPatch, apiPost } from "@/lib/api-client";
import { AttachmentSummary, DocumentDetail, FolderSummary, PortalFolderContents } from "@/lib/types";

export async function listRootFolders(): Promise<FolderSummary[]> {
  return apiGet("/admin/folders", apiFallbacks.rootFolders);
}

export async function getFolderContents(folderId: string): Promise<PortalFolderContents> {
  return apiGet(`/admin/folders/${folderId}/children`, apiFallbacks.folderContents);
}

export async function createDocument(payload: {
  folderId: string;
  title: string;
  markdownBody: string;
  visibilityScope?: "PUBLIC" | "INTERNAL";
}) {
  return apiPost<DocumentDetail>("/admin/documents", payload, apiFallbacks.document);
}

export async function getDocument(documentId: string): Promise<DocumentDetail> {
  return apiGet(`/admin/documents/${documentId}`, apiFallbacks.document);
}

export async function updateDocument(
  documentId: string,
  payload: {
    title?: string;
    markdownBody?: string;
    visibilityScope?: "PUBLIC" | "INTERNAL";
    summary?: string;
    changeSummary?: string;
    expectedVersionId?: string;
  },
) {
  return apiPatch<DocumentDetail>(`/admin/documents/${documentId}`, payload, apiFallbacks.document);
}

export async function submitReview(documentId: string) {
  return apiPost<DocumentDetail>(`/admin/documents/${documentId}/submit-review`, {}, apiFallbacks.document);
}

export async function approveDocument(documentId: string) {
  return apiPost<DocumentDetail>(`/admin/documents/${documentId}/approve`, {}, apiFallbacks.document);
}

export async function publishDocument(documentId: string) {
  return apiPost<DocumentDetail>(`/admin/documents/${documentId}/publish`, {}, apiFallbacks.document);
}

export async function unpublishDocument(documentId: string) {
  return apiPost<DocumentDetail>(`/admin/documents/${documentId}/unpublish`, {}, apiFallbacks.document);
}

export async function deleteDocument(documentId: string) {
  return apiDelete<DocumentDetail>(`/admin/documents/${documentId}`, apiFallbacks.document);
}

export async function uploadAttachment(documentId: string, payload: { fileName: string; contentType?: string; linkRole?: "INLINE_IMAGE" | "REFERENCE_FILE" | "EXPORT_FILE" }) {
  return apiPost<AttachmentSummary>(`/admin/documents/${documentId}/attachments`, payload, apiFallbacks.document.attachments[0]);
}
