import { apiFallbacks, apiGet } from "@/lib/api-client";
import { DocumentDetail, FolderSummary, PortalFolderContents, SearchResult } from "@/lib/types";

export async function getPortalTree(): Promise<FolderSummary[]> {
  return apiGet("/portal/tree", apiFallbacks.rootFolders.filter((item) => item.status === "ACTIVE"));
}

export async function getPortalFolder(folderId: string): Promise<PortalFolderContents> {
  return apiGet(`/portal/folders/${folderId}`, apiFallbacks.folderContents);
}

export async function getPortalDocument(documentId: string): Promise<DocumentDetail> {
  return apiGet(`/portal/documents/${documentId}`, apiFallbacks.document);
}

export async function searchPortalDocuments(query: string): Promise<{ total: number; items: SearchResult[] }> {
  return apiGet(`/portal/search?q=${encodeURIComponent(query)}`, apiFallbacks.search);
}
