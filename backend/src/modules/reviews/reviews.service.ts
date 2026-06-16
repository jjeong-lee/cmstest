import { Injectable } from "@nestjs/common";
import { MockCmsStoreService } from "../store/mock-cms-store.service";
import { ReviewTransitionsService } from "./review-transitions.service";

@Injectable()
export class ReviewsService {
  constructor(
    private readonly store: MockCmsStoreService,
    private readonly transitions: ReviewTransitionsService,
  ) {}

  listReviewTasks(status?: string, reviewerId?: string) {
    return {
      items: this.store.listReviewTasks(status as never, reviewerId).map((task) => ({
        ...task,
        entry: {
          ...this.store.getEntry(task.entryId),
          contentType: this.store.getContentTypeById(this.store.getEntry(task.entryId).contentTypeId),
          revisions: this.store.listRevisions(task.entryId),
          representativeAsset: this.store.getEntry(task.entryId).representativeAssetId
            ? this.store.getAsset(this.store.getEntry(task.entryId).representativeAssetId as string)
            : undefined,
        },
        requestedBy: this.store.getUser(task.requestedById),
        assignedReviewer: task.assignedReviewerId ? this.store.getUser(task.assignedReviewerId) : undefined,
      })),
    };
  }

  approveReviewTask(reviewId: string, decisionNote: string | undefined, actorId: string) {
    return this.transitions.approve(reviewId, decisionNote, actorId);
  }

  rejectReviewTask(reviewId: string, decisionNote: string, actorId: string) {
    return this.transitions.reject(reviewId, decisionNote, actorId);
  }
}
