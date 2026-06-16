import { apiFallbacks, apiGet, apiPost } from "@/lib/api-client";
import { Asset } from "@/lib/types";
import { mockAssets } from "@/lib/mock-data";

export async function listAssets(): Promise<Asset[]> {
  const response = await apiGet<{ items: Asset[] }>("/media", apiFallbacks.media);
  return response.items;
}

export async function getAsset(assetId: string): Promise<Asset> {
  return apiGet<Asset>(`/media/${assetId}`, mockAssets[0]);
}

export async function uploadAsset(payload: { fileName: string; altText: string }) {
  return apiPost("/media/upload", payload, mockAssets[0]);
}
