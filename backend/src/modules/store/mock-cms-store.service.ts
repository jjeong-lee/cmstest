import { Injectable, NotFoundException } from "@nestjs/common";
import { randomUUID } from "node:crypto";
import {
  Asset,
  AuditAction,
  AuditEvent,
  ContentEntry,
  ContentType,
  DashboardSummary,
  EntryFilters,
  EntryRevision,
  EntryStatus,
  PublicationSchedule,
  ReviewTask,
  Role,
  SessionUser,
  Tag,
  User,
  Workspace,
} from "./cms.types";

@Injectable()
export class MockCmsStoreService {
  private readonly workspace: Workspace;
  private readonly users: User[];
  private readonly contentTypes: ContentType[];
  private readonly tags: Tag[];
  private readonly assets: Asset[];
  private readonly entries: ContentEntry[];
  private readonly revisions: EntryRevision[];
  private readonly reviewTasks: ReviewTask[];
  private readonly publicationSchedules: PublicationSchedule[];
  private readonly auditEvents: AuditEvent[];

  constructor() {
    const now = new Date().toISOString();

    this.workspace = {
      id: "workspace-1",
      name: "Northstar CMS",
      code: "northstar",
      defaultLocale: "ko-KR",
      timezone: "Asia/Seoul",
      createdAt: now,
      updatedAt: now,
    };

    this.users = [
      this.createUser("user-admin", "admin@example.com", "Platform Admin", "admin", now),
      this.createUser("user-editor", "editor@example.com", "Editorial Team", "editor", now),
      this.createUser("user-reviewer", "reviewer@example.com", "Quality Reviewer", "reviewer", now),
      this.createUser("user-publisher", "publisher@example.com", "Channel Publisher", "publisher", now),
    ];

    this.contentTypes = [
      {
        id: "type-article",
        code: "article",
        name: "Article",
        description: "뉴스, 블로그, 롱폼 아티클",
        fieldSchema: {
          bodyHint: "제목, 리드, 본문 단락, 인용문 조합",
          requiredFields: ["title", "slug", "locale", "summary", "body"],
          ctaLabel: "Read more",
        },
        isActive: true,
      },
      {
        id: "type-landing",
        code: "landing_page",
        name: "Landing Page",
        description: "캠페인 및 소개형 페이지",
        fieldSchema: {
          bodyHint: "히어로, 가치 제안, CTA 구성",
          requiredFields: ["title", "slug", "locale", "summary", "body"],
          ctaLabel: "Start now",
        },
        isActive: true,
      },
      {
        id: "type-banner",
        code: "promo_banner",
        name: "Promo Banner",
        description: "단기 프로모션 배너",
        fieldSchema: {
          bodyHint: "짧은 메시지와 CTA 중심",
          requiredFields: ["title", "slug", "locale", "summary", "body"],
          ctaLabel: "Explore",
        },
        isActive: true,
      },
    ];

    this.tags = [
      this.createTag("tag-design", "Design"),
      this.createTag("tag-launch", "Launch"),
      this.createTag("tag-notice", "Notice"),
    ];

    this.assets = [
      this.createAsset({
        id: "asset-hero",
        uploaderId: "user-editor",
        fileName: "campaign-hero.jpg",
        altText: "Warm studio hero composition",
        dominantColor: "#d66a3d",
        status: "ready",
      }),
      this.createAsset({
        id: "asset-grid",
        uploaderId: "user-publisher",
        fileName: "workspace-grid.jpg",
        altText: "Workspace board with pinned cards",
        dominantColor: "#7b6b58",
        status: "ready",
      }),
      this.createAsset({
        id: "asset-processing",
        uploaderId: "user-editor",
        fileName: "upcoming-shoot.jpg",
        altText: "Processing upload item",
        dominantColor: "#bcb0a2",
        status: "processing",
      }),
    ];

    this.entries = [];
    this.revisions = [];
    this.reviewTasks = [];
    this.publicationSchedules = [];
    this.auditEvents = [];

    const articleEntry = this.createEntry(
      {
        contentTypeId: "type-article",
        title: "Summer Studio Launch",
        slug: "summer-studio-launch",
        locale: "ko-KR",
        summary: "브랜드 스튜디오 오픈을 알리는 메인 아티클",
        seoTitle: "Summer Studio Launch",
        seoDescription: "브랜드 스튜디오 오픈 공지",
        representativeAssetId: "asset-hero",
        tagIds: ["tag-launch", "tag-notice"],
        body: [
          { id: "block-1", type: "heading", content: "새로운 스튜디오 오픈" },
          { id: "block-2", type: "paragraph", content: "운영팀이 사용할 신규 CMS 런칭과 함께 공개됩니다." },
        ],
        changeNote: "초기 초안 생성",
      },
      this.getUser("user-editor").id,
      false,
    );

    this.updateEntry(
      articleEntry.id,
      {
        title: "Summer Studio Launch Update",
        summary: "브랜드 스튜디오 오픈 일정과 준비 현황을 정리한 아티클",
        body: [
          { id: "block-1", type: "heading", content: "새로운 스튜디오 오픈 일정" },
          { id: "block-2", type: "paragraph", content: "검수 전 최신 진행 상황을 반영했습니다." },
          { id: "block-3", type: "quote", content: "이미지와 운영 효율을 중심에 둔 설계" },
        ],
        changeNote: "본문 확장 및 요약 갱신",
      },
      this.getUser("user-editor").id,
      false,
    );

    const scheduledEntry = this.createEntry(
      {
        contentTypeId: "type-landing",
        title: "Creator Week Landing",
        slug: "creator-week-landing",
        locale: "ko-KR",
        summary: "크리에이터 위크 캠페인 랜딩 페이지",
        representativeAssetId: "asset-grid",
        tagIds: ["tag-launch", "tag-design"],
        body: [
          { id: "block-4", type: "heading", content: "Creator Week" },
          { id: "block-5", type: "paragraph", content: "캠페인 일정과 참여 혜택을 정리한 랜딩 페이지입니다." },
        ],
        changeNote: "랜딩 초안 생성",
      },
      this.getUser("user-editor").id,
      false,
    );

    const reviewTask = this.submitForReview(scheduledEntry.id, "배너 카피 검토 필요", "user-editor", false);
    this.approveReview(reviewTask.id, "캠페인 문구 승인", "user-reviewer", false);
    this.schedulePublication(
      scheduledEntry.id,
      {
        publishMode: "scheduled",
        scheduledFor: new Date(Date.now() + 1000 * 60 * 45).toISOString(),
      },
      "user-publisher",
      false,
    );

    const reviewEntry = this.createEntry(
      {
        contentTypeId: "type-banner",
        title: "Urgent Service Notice",
        slug: "urgent-service-notice",
        locale: "ko-KR",
        summary: "공지 배너용 짧은 메시지 초안",
        tagIds: ["tag-notice"],
        body: [
          { id: "block-6", type: "paragraph", content: "서비스 점검 공지가 필요한 상태입니다." },
        ],
        changeNote: "배너 초안 작성",
      },
      this.getUser("user-editor").id,
      false,
    );

    this.submitForReview(reviewEntry.id, "오늘 중 검토 필요", "user-editor", false);
  }

  private createUser(id: string, email: string, displayName: string, role: Role, now: string): User {
    return {
      id,
      workspaceId: this.workspace.id,
      email,
      displayName,
      role,
      status: "active",
      lastLoginAt: now,
      createdAt: now,
      updatedAt: now,
    };
  }

  private createTag(id: string, label: string): Tag {
    return {
      id,
      workspaceId: this.workspace.id,
      label,
      slug: label.toLowerCase(),
      createdAt: new Date().toISOString(),
    };
  }

  private createAsset(input: {
    id: string;
    uploaderId: string;
    fileName: string;
    altText: string;
    dominantColor: string;
    status: Asset["status"];
  }): Asset {
    const createdAt = new Date().toISOString();
    return {
      id: input.id,
      workspaceId: this.workspace.id,
      uploaderId: input.uploaderId,
      fileName: input.fileName,
      mimeType: "image/jpeg",
      width: 1080,
      height: 1440,
      fileSize: 324_000,
      originalUrl: `https://images.example.com/${input.id}/original.jpg`,
      thumbnailUrl: `https://images.example.com/${input.id}/thumb.jpg`,
      dominantColor: input.dominantColor,
      altText: input.altText,
      tagIds: ["tag-design"],
      status: input.status,
      createdAt,
      updatedAt: createdAt,
    };
  }

  getWorkspace(): Workspace {
    return this.workspace;
  }

  listUsers(): User[] {
    return [...this.users];
  }

  getUser(id: string): User {
    const user = this.users.find((item) => item.id === id);
    if (!user) {
      throw new NotFoundException(`User ${id} not found`);
    }
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((item) => item.email === email);
  }

  createSession(email: string): SessionUser {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`Unknown user ${email}`);
    }
    user.lastLoginAt = new Date().toISOString();
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      workspaceId: user.workspaceId,
      token: user.email,
    };
  }

  getSessionFromToken(token: string): SessionUser | undefined {
    const user = this.findUserByEmail(token);
    if (!user || user.status !== "active") {
      return undefined;
    }
    return {
      id: user.id,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      workspaceId: user.workspaceId,
      token,
    };
  }

  listContentTypes(): ContentType[] {
    return [...this.contentTypes];
  }

  getContentTypeById(id: string): ContentType {
    const contentType = this.contentTypes.find((item) => item.id === id);
    if (!contentType) {
      throw new NotFoundException(`Content type ${id} not found`);
    }
    return contentType;
  }

  listTags(): Tag[] {
    return [...this.tags];
  }

  listAssets(): Asset[] {
    return [...this.assets].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  getAsset(assetId: string): Asset {
    const asset = this.assets.find((item) => item.id === assetId);
    if (!asset) {
      throw new NotFoundException(`Asset ${assetId} not found`);
    }
    return asset;
  }

  createAssetRecord(
    payload: { fileName: string; altText: string; tagIds?: string[]; dominantColor?: string },
    actorId: string,
  ): Asset {
    const now = new Date().toISOString();
    const asset: Asset = {
      id: randomUUID(),
      workspaceId: this.workspace.id,
      uploaderId: actorId,
      fileName: payload.fileName,
      mimeType: "image/jpeg",
      width: 1200,
      height: 1600,
      fileSize: 480_000,
      originalUrl: `https://images.example.com/assets/${payload.fileName}`,
      thumbnailUrl: `https://images.example.com/assets/${payload.fileName}?thumb=1`,
      dominantColor: payload.dominantColor ?? "#d66a3d",
      altText: payload.altText,
      tagIds: payload.tagIds ?? [],
      status: "processing",
      createdAt: now,
      updatedAt: now,
    };

    this.assets.unshift(asset);
    this.recordAudit(actorId, "Asset", asset.id, "upload", { fileName: asset.fileName });
    return asset;
  }

  markAssetReady(assetId: string): Asset {
    const asset = this.getAsset(assetId);
    asset.status = "ready";
    asset.updatedAt = new Date().toISOString();
    return asset;
  }

  listEntries(filters: EntryFilters = {}): Array<ContentEntry & { contentType: ContentType["code"] }> {
    return this.entries
      .filter((entry) => {
        const contentType = this.getContentTypeById(entry.contentTypeId);
        const matchesStatus = !filters.status || entry.status === filters.status;
        const matchesType = !filters.contentType || contentType.code === filters.contentType;
        const matchesAuthor = !filters.authorId || entry.authorId === filters.authorId;
        const matchesLocale = !filters.locale || entry.locale === filters.locale;
        const matchesTag = !filters.tag || entry.tagIds.includes(filters.tag);
        const query = filters.q?.toLowerCase();
        const matchesQuery =
          !query ||
          entry.title.toLowerCase().includes(query) ||
          entry.summary.toLowerCase().includes(query) ||
          entry.slug.toLowerCase().includes(query);
        return matchesStatus && matchesType && matchesAuthor && matchesLocale && matchesTag && matchesQuery;
      })
      .map((entry) => ({ ...entry, contentType: this.getContentTypeById(entry.contentTypeId).code }))
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
  }

  getEntry(entryId: string): ContentEntry {
    const entry = this.entries.find((item) => item.id === entryId);
    if (!entry) {
      throw new NotFoundException(`Entry ${entryId} not found`);
    }
    return entry;
  }

  listRevisions(entryId: string): EntryRevision[] {
    return this.revisions
      .filter((item) => item.entryId === entryId)
      .sort((left, right) => right.versionNumber - left.versionNumber);
  }

  getRevision(revisionId: string): EntryRevision {
    const revision = this.revisions.find((item) => item.id === revisionId);
    if (!revision) {
      throw new NotFoundException(`Revision ${revisionId} not found`);
    }
    return revision;
  }

  createEntry(
    payload: {
      contentTypeId: string;
      title: string;
      slug: string;
      locale: string;
      summary: string;
      seoTitle?: string;
      seoDescription?: string;
      representativeAssetId?: string;
      tagIds?: string[];
      body: EntryRevision["body"];
      changeNote?: string;
    },
    actorId: string,
    logAudit = true,
  ): ContentEntry {
    const now = new Date().toISOString();
    const entry: ContentEntry = {
      id: randomUUID(),
      workspaceId: this.workspace.id,
      contentTypeId: payload.contentTypeId,
      authorId: actorId,
      ownerId: actorId,
      title: payload.title,
      slug: payload.slug,
      locale: payload.locale,
      status: "draft",
      summary: payload.summary,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      representativeAssetId: payload.representativeAssetId,
      tagIds: payload.tagIds ?? [],
      createdAt: now,
      updatedAt: now,
    };
    this.entries.push(entry);
    const revision = this.createRevision(entry.id, actorId, payload, 1);
    entry.currentRevisionId = revision.id;
    if (logAudit) {
      this.recordAudit(actorId, "ContentEntry", entry.id, "create", { title: entry.title });
    }
    return entry;
  }

  updateEntry(
    entryId: string,
    payload: Partial<{
      title: string;
      slug: string;
      locale: string;
      summary: string;
      seoTitle: string;
      seoDescription: string;
      representativeAssetId: string;
      tagIds: string[];
      body: EntryRevision["body"];
      changeNote: string;
    }>,
    actorId: string,
    logAudit = true,
  ): ContentEntry {
    const entry = this.getEntry(entryId);
    entry.title = payload.title ?? entry.title;
    entry.slug = payload.slug ?? entry.slug;
    entry.locale = payload.locale ?? entry.locale;
    entry.summary = payload.summary ?? entry.summary;
    entry.seoTitle = payload.seoTitle ?? entry.seoTitle;
    entry.seoDescription = payload.seoDescription ?? entry.seoDescription;
    entry.representativeAssetId = payload.representativeAssetId ?? entry.representativeAssetId;
    entry.tagIds = payload.tagIds ?? entry.tagIds;
    entry.ownerId = actorId;
    entry.updatedAt = new Date().toISOString();

    const latestRevision = this.listRevisions(entryId)[0];
    const revision = this.createRevision(
      entryId,
      actorId,
      {
        title: entry.title,
        summary: entry.summary,
        seoTitle: entry.seoTitle,
        seoDescription: entry.seoDescription,
        representativeAssetId: entry.representativeAssetId,
        tagIds: entry.tagIds,
        body: payload.body ?? latestRevision.body,
        changeNote: payload.changeNote,
      },
      latestRevision.versionNumber + 1,
    );
    entry.currentRevisionId = revision.id;
    if (logAudit) {
      this.recordAudit(actorId, "ContentEntry", entry.id, "update", { revisionId: revision.id });
    }
    return entry;
  }

  archiveEntry(entryId: string, actorId: string): void {
    const entry = this.getEntry(entryId);
    entry.status = "archived";
    entry.archivedAt = new Date().toISOString();
    entry.updatedAt = entry.archivedAt;
    this.recordAudit(actorId, "ContentEntry", entry.id, "archive", {});
  }

  submitForReview(entryId: string, submissionNote: string | undefined, actorId: string, logAudit = true): ReviewTask {
    const entry = this.getEntry(entryId);
    entry.status = "in_review";
    entry.submittedAt = new Date().toISOString();
    entry.updatedAt = entry.submittedAt;

    const task: ReviewTask = {
      id: randomUUID(),
      entryId,
      requestedById: actorId,
      status: "open",
      submissionNote,
      createdAt: entry.submittedAt,
      updatedAt: entry.submittedAt,
    };

    this.reviewTasks.unshift(task);
    if (logAudit) {
      this.recordAudit(actorId, "ReviewTask", task.id, "submit", { entryId });
    }
    return task;
  }

  listReviewTasks(status?: ReviewTask["status"], reviewerId?: string): ReviewTask[] {
    return this.reviewTasks.filter((task) => {
      const matchesStatus = !status || task.status === status;
      const matchesReviewer = !reviewerId || task.assignedReviewerId === reviewerId;
      return matchesStatus && matchesReviewer;
    });
  }

  getReviewTask(reviewId: string): ReviewTask {
    const task = this.reviewTasks.find((item) => item.id === reviewId);
    if (!task) {
      throw new NotFoundException(`Review task ${reviewId} not found`);
    }
    return task;
  }

  approveReview(reviewId: string, decisionNote: string | undefined, actorId: string, logAudit = true): ReviewTask {
    const task = this.getReviewTask(reviewId);
    task.status = "approved";
    task.assignedReviewerId = actorId;
    task.decisionNote = decisionNote;
    task.decidedAt = new Date().toISOString();
    task.updatedAt = task.decidedAt;

    const entry = this.getEntry(task.entryId);
    entry.status = "approved";
    entry.approvedAt = task.decidedAt;
    entry.updatedAt = task.decidedAt;

    if (logAudit) {
      this.recordAudit(actorId, "ReviewTask", task.id, "approve", { entryId: entry.id });
    }
    return task;
  }

  rejectReview(reviewId: string, decisionNote: string, actorId: string, logAudit = true): ReviewTask {
    const task = this.getReviewTask(reviewId);
    task.status = "rejected";
    task.assignedReviewerId = actorId;
    task.decisionNote = decisionNote;
    task.decidedAt = new Date().toISOString();
    task.updatedAt = task.decidedAt;

    const entry = this.getEntry(task.entryId);
    entry.status = "rejected";
    entry.updatedAt = task.decidedAt;

    if (logAudit) {
      this.recordAudit(actorId, "ReviewTask", task.id, "reject", { entryId: entry.id });
    }
    return task;
  }

  schedulePublication(
    entryId: string,
    payload: { publishMode: "immediate" | "scheduled"; scheduledFor?: string },
    actorId: string,
    logAudit = true,
  ): PublicationSchedule {
    const entry = this.getEntry(entryId);
    const revisionId = entry.currentRevisionId ?? this.listRevisions(entryId)[0]?.id;
    if (!revisionId) {
      throw new NotFoundException(`Entry ${entryId} has no revisions`);
    }

    const now = new Date().toISOString();
    const schedule: PublicationSchedule = {
      id: randomUUID(),
      entryId,
      targetRevisionId: revisionId,
      publishMode: payload.publishMode,
      scheduledFor: payload.scheduledFor,
      executedAt: payload.publishMode === "immediate" ? now : undefined,
      status: payload.publishMode === "immediate" ? "processed" : "pending",
      createdById: actorId,
      createdAt: now,
      updatedAt: now,
    };

    this.publicationSchedules.unshift(schedule);
    entry.status = payload.publishMode === "immediate" ? "published" : "scheduled";
    entry.publishedRevisionId = payload.publishMode === "immediate" ? revisionId : entry.publishedRevisionId;
    entry.publishedAt = payload.publishMode === "immediate" ? now : entry.publishedAt;
    entry.updatedAt = now;

    if (logAudit) {
      this.recordAudit(
        actorId,
        "PublicationSchedule",
        schedule.id,
        payload.publishMode === "immediate" ? "publish" : "schedule",
        { entryId, scheduledFor: payload.scheduledFor },
      );
    }
    return schedule;
  }

  unpublishEntry(entryId: string, reason: string | undefined, actorId: string): ContentEntry {
    const entry = this.getEntry(entryId);
    entry.status = "archived";
    entry.archivedAt = new Date().toISOString();
    entry.updatedAt = entry.archivedAt;
    this.recordAudit(actorId, "ContentEntry", entryId, "unpublish", { reason });
    return entry;
  }

  listPublicationSchedules(): PublicationSchedule[] {
    return [...this.publicationSchedules];
  }

  recordAudit(
    actorId: string,
    entityType: AuditEvent["entityType"],
    entityId: string,
    action: AuditAction,
    metadata?: Record<string, unknown>,
  ): AuditEvent {
    const event: AuditEvent = {
      id: randomUUID(),
      workspaceId: this.workspace.id,
      actorId,
      entityType,
      entityId,
      action,
      metadata,
      createdAt: new Date().toISOString(),
    };
    this.auditEvents.unshift(event);
    return event;
  }

  listAuditEvents(): AuditEvent[] {
    return [...this.auditEvents];
  }

  getDashboardSummary(): DashboardSummary {
    const reviewQueue = this.reviewTasks.filter((item) => item.status === "open").length;
    const scheduled = this.entries.filter((item) => item.status === "scheduled").length;
    const publishedToday = this.entries.filter((item) => item.publishedAt?.slice(0, 10) === new Date().toISOString().slice(0, 10)).length;
    const failedUploads = this.assets.filter((item) => item.status === "failed").length;

    return {
      kpis: [
        { key: "reviewQueue", label: "Review Queue", value: reviewQueue, trend: "+2 since yesterday" },
        { key: "scheduled", label: "Scheduled", value: scheduled, trend: "Next wave in 45m" },
        { key: "publishedToday", label: "Published Today", value: publishedToday, trend: "Steady cadence" },
        { key: "failedUploads", label: "Failed Uploads", value: failedUploads, trend: failedUploads ? "Needs attention" : "All clear" },
      ],
      recentEntries: this.listEntries({})
        .slice(0, 4)
        .map((entry) => ({
          id: entry.id,
          title: entry.title,
          status: entry.status,
          updatedAt: entry.updatedAt,
          authorName: this.getUser(entry.authorId).displayName,
          contentType: entry.contentType,
          thumbnailUrl: entry.representativeAssetId ? this.getAsset(entry.representativeAssetId).thumbnailUrl : undefined,
        })),
      upcomingPublications: this.publicationSchedules
        .filter((item) => item.publishMode === "scheduled")
        .slice(0, 4)
        .map((item) => {
          const entry = this.getEntry(item.entryId);
          return {
            id: item.id,
            title: entry.title,
            scheduledFor: item.scheduledFor ?? item.createdAt,
            status: entry.status,
          };
        }),
      recentAssets: this.listAssets()
        .slice(0, 6)
        .map((asset) => ({
          id: asset.id,
          fileName: asset.fileName,
          thumbnailUrl: asset.thumbnailUrl,
          altText: asset.altText,
        })),
      activity: this.auditEvents.slice(0, 6).map((event) => ({
        id: event.id,
        action: event.action,
        actorName: this.getUser(event.actorId).displayName,
        entityLabel: `${event.entityType} ${event.entityId.slice(0, 8)}`,
        createdAt: event.createdAt,
      })),
    };
  }

  private createRevision(
    entryId: string,
    editorId: string,
    payload: {
      title: string;
      summary: string;
      body: EntryRevision["body"];
      seoTitle?: string;
      seoDescription?: string;
      representativeAssetId?: string;
      tagIds?: string[];
      changeNote?: string;
    },
    versionNumber: number,
  ): EntryRevision {
    const revision: EntryRevision = {
      id: randomUUID(),
      entryId,
      versionNumber,
      editorId,
      title: payload.title,
      summary: payload.summary,
      body: payload.body,
      seoTitle: payload.seoTitle,
      seoDescription: payload.seoDescription,
      selectedAssetIds: [payload.representativeAssetId, ...(payload.tagIds ?? [])].filter(Boolean) as string[],
      changeNote: payload.changeNote,
      createdAt: new Date().toISOString(),
    };
    this.revisions.push(revision);
    return revision;
  }
}
