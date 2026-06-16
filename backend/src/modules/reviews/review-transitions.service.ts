import { ConflictException, Injectable } from "@nestjs/common";
import { AuditLogger } from "../../common/logger/audit.logger";
import { MockCmsStoreService } from "../store/mock-cms-store.service";

@Injectable()
export class ReviewTransitionsService {
  constructor(
    private readonly store: MockCmsStoreService,
    private readonly auditLogger: AuditLogger,
  ) {}

  approve(reviewId: string, decisionNote: string | undefined, actorId: string) {
    const task = this.store.getReviewTask(reviewId);
    if (task.status !== "open") {
      throw new ConflictException("Only open review tasks can be approved");
    }

    const approved = this.store.approveReview(reviewId, decisionNote, actorId);
    this.auditLogger.log({
      actorId,
      action: "approve",
      entityType: "ReviewTask",
      entityId: reviewId,
      metadata: { entryId: approved.entryId, decisionNote },
    });
    return approved;
  }

  reject(reviewId: string, decisionNote: string, actorId: string) {
    const task = this.store.getReviewTask(reviewId);
    if (task.status !== "open") {
      throw new ConflictException("Only open review tasks can be rejected");
    }

    const rejected = this.store.rejectReview(reviewId, decisionNote, actorId);
    this.auditLogger.log({
      actorId,
      action: "reject",
      entityType: "ReviewTask",
      entityId: reviewId,
      metadata: { entryId: rejected.entryId, decisionNote },
    });
    return rejected;
  }
}
