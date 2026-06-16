import { Injectable } from "@nestjs/common";
import { AssetProcessingService } from "./asset-processing.service";
import { ObjectStorageAdapter } from "./object-storage.adapter";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class MediaService {
  constructor(
    private readonly store: MockCmsStoreService,
    private readonly objectStorage: ObjectStorageAdapter,
    private readonly assetProcessing: AssetProcessingService,
  ) {}

  listAssets() {
    return {
      items: this.store.listAssets().map((asset) => ({
        ...asset,
        originalUrl: this.objectStorage.getSignedAssetUrl(`${asset.id}/original`),
        thumbnailUrl: this.objectStorage.getSignedAssetUrl(`${asset.id}/thumb`),
        references: this.store
          .listEntries({})
          .filter((entry) => entry.representativeAssetId === asset.id)
          .map((entry) => ({ id: entry.id, title: entry.title, status: entry.status })),
      })),
    };
  }

  getAsset(assetId: string) {
    const asset = this.store.getAsset(assetId);
    return {
      ...asset,
      originalUrl: this.objectStorage.getSignedAssetUrl(`${asset.id}/original`),
      thumbnailUrl: this.objectStorage.getSignedAssetUrl(`${asset.id}/thumb`),
      references: this.store
        .listEntries({})
        .filter((entry) => entry.representativeAssetId === asset.id)
        .map((entry) => ({ id: entry.id, title: entry.title, status: entry.status })),
    };
  }

  uploadAsset(body: { fileName: string; altText: string; tagIds?: string[]; dominantColor?: string }, actorId: string) {
    const asset = this.store.createAssetRecord(body, actorId);
    this.assetProcessing.process(asset.id);
    return this.getAsset(asset.id);
  }
}
