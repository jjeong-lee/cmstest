import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class RevisionsService {
  constructor(private readonly store: MockCmsStoreService) {}

  listEntryRevisions(entryId: string) {
    return { items: this.store.listRevisions(entryId) };
  }
}
