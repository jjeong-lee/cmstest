import { Injectable, Inject } from "@nestjs/common";
import { ChangeRequest, ProjectSchedule, SoftwareInventoryItem } from "../store/cms.types";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class GovernanceService {
  constructor(@Inject(MockCmsStoreService) private readonly store: MockCmsStoreService) {}

  listSoftwareInventory() {
    return this.store.listSoftwareInventory();
  }

  createSoftwareInventoryItem(actorId: string, payload: Record<string, unknown>) {
    return this.store.createSoftwareInventoryItem(actorId, payload as Partial<SoftwareInventoryItem>);
  }

  listDeployments() {
    return this.store.listDeployments();
  }

  listSchedules() {
    return this.store.listSchedules();
  }

  createSchedule(actorId: string, payload: Record<string, unknown>) {
    return this.store.createSchedule(actorId, payload as Partial<ProjectSchedule>);
  }

  listScopeItems() {
    return this.store.listScopeItems();
  }

  listStaffAssignments() {
    return this.store.listStaffAssignments();
  }

  listRisks() {
    return this.store.listRisks();
  }

  listDeliverables() {
    return this.store.listDeliverables();
  }

  listChangeRequests() {
    return this.store.listChangeRequests();
  }

  createChangeRequest(actorId: string, payload: Record<string, unknown>) {
    return this.store.createChangeRequest(actorId, payload as Partial<ChangeRequest>);
  }
}
