import { BadRequestException, ConflictException, Injectable } from "@nestjs/common";
import { AuditLogger } from "../../common/logger/audit.logger";
import { EntryFilters } from "../store/cms.types";
import { MockCmsStoreService } from "../store/mock-cms-store.service";
import { SlugValidator } from "./validators/slug.validator";

type EntryPayload = {
  contentTypeId: string;
  title: string;
  slug: string;
  locale: string;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  representativeAssetId?: string;
  tagIds?: string[];
  body: Array<{ id: string; type: "heading" | "paragraph" | "quote"; content: string }>;
  changeNote?: string;
};

@Injectable()
export class EntriesService {
  constructor(
    private readonly store: MockCmsStoreService,
    private readonly slugValidator: SlugValidator,
    private readonly auditLogger: AuditLogger,
  ) {}

  listEntries(filters: EntryFilters) {
    return {
      items: this.store.listEntries(filters).map((entry) => this.getEntryDetail(entry.id)),
    };
  }

  getEntry(entryId: string) {
    return this.getEntryDetail(entryId);
  }

  createEntry(payload: EntryPayload, actorId: string) {
    this.validatePayload(payload);
    this.slugValidator.ensureUniqueSlug(payload.slug, payload.locale, payload.contentTypeId);
    const entry = this.store.createEntry(payload, actorId);
    this.auditLogger.log({
      actorId,
      action: "create",
      entityType: "ContentEntry",
      entityId: entry.id,
      metadata: { title: payload.title },
    });
    return this.getEntryDetail(entry.id);
  }

  updateEntry(
    entryId: string,
    payload: Partial<EntryPayload> & { expectedRevisionId?: string },
    actorId: string,
  ) {
    const entry = this.store.getEntry(entryId);
    const latestRevisionId = entry.currentRevisionId;

    if (payload.expectedRevisionId && latestRevisionId && payload.expectedRevisionId !== latestRevisionId) {
      throw new ConflictException("A newer revision already exists for this entry");
    }

    this.slugValidator.ensureUniqueSlug(
      payload.slug ?? entry.slug,
      payload.locale ?? entry.locale,
      entry.contentTypeId,
      entryId,
    );

    const updated = this.store.updateEntry(entryId, payload, actorId);
    this.auditLogger.log({
      actorId,
      action: "update",
      entityType: "ContentEntry",
      entityId: entryId,
      metadata: { revisionId: updated.currentRevisionId },
    });
    return this.getEntryDetail(entryId);
  }

  archiveEntry(entryId: string, actorId: string) {
    this.store.archiveEntry(entryId, actorId);
  }

  submitForReview(entryId: string, submissionNote: string | undefined, actorId: string) {
    const entry = this.store.getEntry(entryId);
    if (entry.status !== "draft" && entry.status !== "rejected") {
      throw new ConflictException("Only draft or rejected entries can be submitted");
    }

    const task = this.store.submitForReview(entryId, submissionNote, actorId);
    this.auditLogger.log({
      actorId,
      action: "submit",
      entityType: "ReviewTask",
      entityId: task.id,
      metadata: { entryId },
    });
    return task;
  }

  private validatePayload(payload: Partial<EntryPayload>) {
    const requiredFields = ["contentTypeId", "title", "slug", "locale", "summary", "body"] as const;
    const missing = requiredFields.filter((field) => {
      const value = payload[field];
      if (field === "body") {
        return !Array.isArray(value) || value.length === 0;
      }
      return !value;
    });

    if (missing.length > 0) {
      throw new BadRequestException(`Missing required fields: ${missing.join(", ")}`);
    }
  }

  private getEntryDetail(entryId: string) {
    const entry = this.store.getEntry(entryId);
    const contentType = this.store.getContentTypeById(entry.contentTypeId);
    const author = this.store.getUser(entry.authorId);
    const owner = this.store.getUser(entry.ownerId);
    const revisions = this.store.listRevisions(entryId);
    const representativeAsset = entry.representativeAssetId
      ? this.store.getAsset(entry.representativeAssetId)
      : undefined;
    const reviewTasks = this.store.listReviewTasks().filter((task) => task.entryId === entryId);
    const publicationSchedule = this.store.listPublicationSchedules().find((item) => item.entryId === entryId);

    return {
      ...entry,
      contentType,
      author,
      owner,
      representativeAsset,
      tags: entry.tagIds.map((tagId) => this.store.listTags().find((tag) => tag.id === tagId)).filter(Boolean),
      revisions,
      reviewTasks,
      publicationSchedule,
    };
  }
}
