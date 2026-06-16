import { Injectable } from "@nestjs/common";
import { EntryFilters } from "../store/cms.types";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class EntryQueryService {
  constructor(private readonly store: MockCmsStoreService) {}

  listEntries(filters: EntryFilters) {
    return this.store.listEntries(filters).map((entry) => ({
      ...entry,
      author: this.store.getUser(entry.authorId),
      representativeAsset: entry.representativeAssetId
        ? this.store.getAsset(entry.representativeAssetId)
        : undefined,
      revisionsCount: this.store.listRevisions(entry.id).length,
    }));
  }
}
