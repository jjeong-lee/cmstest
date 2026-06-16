import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { AuditLogger } from "../../common/logger/audit.logger";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class PublicationService {
  constructor(
    private readonly store: MockCmsStoreService,
    private readonly auditLogger: AuditLogger,
  ) {}

  publish(entryId: string, actorId: string) {
    const entry = this.store.getEntry(entryId);
    if (entry.status !== "approved") {
      throw new ConflictException("Only approved entries can be published");
    }

    const schedule = this.store.schedulePublication(entryId, { publishMode: "immediate" }, actorId);
    this.auditLogger.log({
      actorId,
      action: "publish",
      entityType: "PublicationSchedule",
      entityId: schedule.id,
      metadata: { entryId },
    });
    return schedule;
  }

  schedule(entryId: string, scheduledFor: string, actorId: string) {
    const entry = this.store.getEntry(entryId);
    if (entry.status !== "approved") {
      throw new ConflictException("Only approved entries can be scheduled");
    }

    if (new Date(scheduledFor).getTime() <= Date.now()) {
      throw new BadRequestException("Scheduled publication must be in the future");
    }

    const schedule = this.store.schedulePublication(entryId, { publishMode: "scheduled", scheduledFor }, actorId);
    this.auditLogger.log({
      actorId,
      action: "schedule",
      entityType: "PublicationSchedule",
      entityId: schedule.id,
      metadata: { entryId, scheduledFor },
    });
    return schedule;
  }

  unpublish(entryId: string, reason: string | undefined, actorId: string) {
    const entry = this.store.getEntry(entryId);
    if (entry.status !== "published" && entry.status !== "scheduled") {
      throw new ConflictException("Only published or scheduled entries can be unpublished");
    }

    const result = this.store.unpublishEntry(entryId, reason, actorId);
    this.auditLogger.log({
      actorId,
      action: "unpublish",
      entityType: "ContentEntry",
      entityId: entryId,
      metadata: { reason },
    });
    return result;
  }
}
