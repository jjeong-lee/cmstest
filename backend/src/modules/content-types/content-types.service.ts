import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class ContentTypesService {
  constructor(private readonly store: MockCmsStoreService) {}

  listContentTypes() {
    return { items: this.store.listContentTypes() };
  }
}
