import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class AssetProcessingService {
  constructor(private readonly store: MockCmsStoreService) {}

  process(assetId: string) {
    return this.store.markAssetReady(assetId);
  }
}
