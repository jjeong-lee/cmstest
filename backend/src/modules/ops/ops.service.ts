import { Injectable, Inject } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class OpsService {
  constructor(@Inject(MockCmsStoreService) private readonly store: MockCmsStoreService) {}

  getHealth() {
    return this.store.getHealthStatus();
  }

  listBackups() {
    return this.store.listBackups();
  }

  startBackup(actorId: string) {
    return this.store.startBackup(actorId);
  }

  restoreBackup(backupRunId: string, actorId: string) {
    return this.store.restoreBackup(backupRunId, actorId);
  }
}
