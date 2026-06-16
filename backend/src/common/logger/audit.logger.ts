import { Injectable } from "@nestjs/common";
import { AuditEvent } from "../../modules/store/cms.types";
import { MockCmsStoreService } from "../../modules/store/mock-cms-store.service";

@Injectable()
export class AuditLogger {
  constructor(private readonly store: MockCmsStoreService) {}

  log(event: Omit<AuditEvent, "id" | "workspaceId" | "createdAt">): AuditEvent {
    return this.store.recordAudit(event.actorId, event.entityType, event.entityId, event.action, event.metadata);
  }
}
