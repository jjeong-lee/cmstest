import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class DashboardService {
  constructor(private readonly store: MockCmsStoreService) {}

  getSummary() {
    return this.store.getDashboardSummary();
  }
}
