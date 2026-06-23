import { BadRequestException, ConflictException, Injectable, NotFoundException } from "@nestjs/common";
import { createHash, randomUUID } from "node:crypto";
import {
  Attachment,
  AttachmentSummary,
  AuditAction,
  AuditEvent,
  BackupRun,
  ChangeRequest,
  Deliverable,
  DeploymentRelease,
  DocumentDetail,
  DocumentRecord,
  DocumentStatus,
  DocumentSummary,
  DocumentVersion,
  Folder,
  FolderStatus,
  FolderSummary,
  PortalFolderContents,
  ProjectSchedule,
  RestoreRun,
  RiskIssue,
  ScopeItem,
  SearchResult,
  SessionUser,
  SoftwareInventoryItem,
  StaffAssignment,
  User,
  VisibilityScope,
  Workspace,
  AuthUserAccount,
} from "./cms.types";

type CreateFolderInput = {
  parentId?: string | null;
  name: string;
  status?: FolderStatus;
  sortOrder?: number;
};

type UpdateFolderInput = Partial<CreateFolderInput>;

type CreateDocumentInput = {
  folderId: string;
  title: string;
  markdownBody: string;
  visibilityScope?: VisibilityScope;
  summary?: string;
  changeSummary?: string;
};

type UpdateDocumentInput = Partial<CreateDocumentInput> & {
  expectedVersionId?: string;
};

type CreateAttachmentInput = {
  fileName: string;
  contentType?: string;
  fileSize?: number;
  linkRole?: Attachment["linkRole"];
};

type RegisterUserInput = {
  id: string;
  password: string;
  email: string;
};

@Injectable()
export class MockCmsStoreService {
  private readonly workspace: Workspace = {
    id: "workspace-cms",
    name: "Northstar Markdown CMS",
    code: "northstar-cms",
    timezone: "Asia/Seoul",
    locale: "ko-KR",
  };

  private readonly users: User[] = [];
  private readonly authUsers: AuthUserAccount[] = [];
  private readonly activeSessions = new Map<string, SessionUser>();
  private readonly folders: Folder[] = [];
  private readonly documents: DocumentRecord[] = [];
  private readonly versions: DocumentVersion[] = [];
  private readonly attachments: Attachment[] = [];
  private readonly auditEvents: AuditEvent[] = [];
  private readonly backupRuns: BackupRun[] = [];
  private readonly restoreRuns: RestoreRun[] = [];
  private readonly softwareInventory: SoftwareInventoryItem[] = [];
  private readonly deployments: DeploymentRelease[] = [];
  private readonly schedules: ProjectSchedule[] = [];
  private readonly scopeItems: ScopeItem[] = [];
  private readonly staffAssignments: StaffAssignment[] = [];
  private readonly risks: RiskIssue[] = [];
  private readonly deliverables: Deliverable[] = [];
  private readonly changeRequests: ChangeRequest[] = [];

  constructor() {
    const now = new Date().toISOString();
    this.users.push(
      this.createUser("user-admin", "admin@example.com", "콘텐츠 관리자", "ADMIN", now),
      this.createUser("user-auth-admin", "basic@example.com", "콘텐츠 관리자", "ADMIN", now),
      this.createUser("user-reviewer", "reviewer@example.com", "검수 담당자", "REVIEWER", now),
      this.createUser("user-operator", "operator@example.com", "운영 담당자", "OPERATOR", now),
      this.createUser("user-portal", "user@example.com", "포털 사용자", "USER", now),
    );
    this.authUsers.push(this.createAuthUser("admin", "basic@example.com", "ADMIN", "admin1234", now));

    const policy = this.seedFolder({ name: "정책", status: "ACTIVE", sortOrder: 10 }, "user-admin");
    const operations = this.seedFolder({ parentId: policy.id, name: "운영 가이드", status: "ACTIVE", sortOrder: 10 }, "user-admin");
    const notices = this.seedFolder({ name: "공지", status: "ACTIVE", sortOrder: 20 }, "user-admin");
    const archive = this.seedFolder({ name: "보관함", status: "INACTIVE", sortOrder: 30 }, "user-admin");

    const publishedDoc = this.seedDocument(
      {
        folderId: operations.id,
        title: "배포 점검 체크리스트",
        markdownBody: [
          "# 배포 점검 체크리스트",
          "",
          "| 항목 | 확인 내용 |",
          "| --- | --- |",
          "| 상태 | 헬스 체크와 로그를 확인합니다. |",
          "",
          "```bash",
          "curl /api/v1/ops/health",
          "```",
          "",
          "- 서비스 상태 확인",
          "- 로그 확인",
          "- 백업 이력 점검",
        ].join("\n"),
        visibilityScope: "PUBLIC",
        summary: "운영 반영 전 확인해야 할 핵심 체크리스트",
      },
      "user-admin",
    );
    this.submitReview(publishedDoc.id, "운영팀 검토 요청", "user-admin");
    this.approveDocument(publishedDoc.id, "검토 승인", "user-reviewer");
    this.publishDocument(publishedDoc.id, "user-admin");

    const draftDoc = this.seedDocument(
      {
        folderId: notices.id,
        title: "주간 공지 템플릿",
        markdownBody: "# 주간 공지 템플릿\n\n운영 공지를 이 양식으로 작성합니다.",
        visibilityScope: "INTERNAL",
        summary: "내부 공지 작성용 템플릿",
      },
      "user-admin",
    );

    this.createAttachment(
      publishedDoc.id,
      { fileName: "checklist.pdf", contentType: "application/pdf", fileSize: 1_280_000, linkRole: "REFERENCE_FILE" },
      "user-admin",
    );
    this.createAttachment(
      draftDoc.id,
      { fileName: "weekly-template.png", contentType: "image/png", fileSize: 240_000, linkRole: "INLINE_IMAGE" },
      "user-admin",
    );

    this.backupRuns.push({
      id: randomUUID(),
      runType: "SCHEDULED",
      status: "SUCCEEDED",
      validationStatus: "PASSED",
      startedAt: this.shiftMinutes(-240),
      completedAt: this.shiftMinutes(-236),
      databaseArtifactUri: "s3://cms-backups/2026-06-16/db.sql.gz",
      fileArtifactUri: "s3://cms-backups/2026-06-16/assets.tar.gz",
      retentionExpiresAt: this.shiftDays(14),
      triggeredBy: "user-operator",
    });
    this.backupRuns.push({
      id: randomUUID(),
      runType: "MANUAL",
      status: "PARTIAL_FAILURE",
      validationStatus: "FAILED",
      startedAt: this.shiftMinutes(-75),
      completedAt: this.shiftMinutes(-70),
      databaseArtifactUri: "s3://cms-backups/2026-06-16/manual-db.sql.gz",
      fileArtifactUri: "s3://cms-backups/2026-06-16/manual-assets.tar.gz",
      retentionExpiresAt: this.shiftDays(7),
      triggeredBy: "user-operator",
    });

    this.softwareInventory.push(
      {
        id: randomUUID(),
        componentName: "Next.js",
        componentType: "LIBRARY",
        version: "15.0.0",
        licenseName: "MIT",
        licenseStatus: "APPROVED",
        vulnerabilitySummary: "Known issues monitored, no blocking CVE",
        riskLevel: "LOW",
        approvedBy: "운영위원회",
        approvedAt: this.shiftDays(-5),
      },
      {
        id: randomUUID(),
        componentName: "Object Storage Adapter",
        componentType: "SERVICE",
        version: "1.2.0",
        licenseName: "Commercial",
        licenseStatus: "CONDITIONAL",
        vulnerabilitySummary: "서명 URL 만료시간 점검 필요",
        riskLevel: "MEDIUM",
        notes: "운영 반영 전 점검 항목 포함",
      },
    );

    this.deployments.push(
      {
        id: randomUUID(),
        releaseVersion: "2026.06.16-rc1",
        gitCommitSha: "7f2c1d9",
        buildNumber: "build-248",
        environment: "staging",
        status: "DEPLOYED",
        deployedAt: this.shiftMinutes(-90),
        approvedBy: "운영 담당자",
      },
      {
        id: randomUUID(),
        releaseVersion: "2026.06.14",
        gitCommitSha: "9cd410a",
        buildNumber: "build-244",
        environment: "production",
        status: "APPROVED",
        approvedBy: "운영위원회",
      },
    );

    this.schedules.push(
      {
        id: randomUUID(),
        name: "1차 운영 전환",
        phase: "전환",
        ownerName: "콘텐츠 관리자",
        plannedStartDate: "2026-06-20",
        plannedEndDate: "2026-06-24",
        status: "AT_RISK",
        mitigationPlan: "백업 검증 자동화 선행",
      },
      {
        id: randomUUID(),
        name: "포털 검색 고도화",
        phase: "개선",
        ownerName: "운영 담당자",
        plannedStartDate: "2026-06-27",
        plannedEndDate: "2026-07-02",
        status: "ON_TRACK",
      },
    );

    this.scopeItems.push(
      { id: randomUUID(), requirementId: "FR-001", title: "제목/본문 검색", status: "IN_SCOPE" },
      { id: randomUUID(), requirementId: "FR-025", title: "백업/복구", status: "IN_SCOPE" },
      { id: randomUUID(), requirementId: "CR-009", title: "외부 PM 도구 연동", status: "OUT_OF_SCOPE", note: "v2 후보" },
    );

    this.staffAssignments.push(
      {
        id: randomUUID(),
        role: "ADMIN",
        assignee: "콘텐츠 관리자",
        startDate: "2026-06-10",
        endDate: "2026-07-31",
        approvalStatus: "APPROVED",
      },
      {
        id: randomUUID(),
        role: "OPERATOR",
        assignee: "운영 담당자",
        startDate: "2026-06-10",
        endDate: "2026-07-31",
        approvalStatus: "PENDING",
      },
    );

    this.risks.push(
      {
        id: randomUUID(),
        title: "손상 PDF 업로드 증가",
        cause: "외부 공급 문서 품질 편차",
        impact: "변환 실패 및 운영 문의 증가",
        owner: "운영 담당자",
        dueDate: "2026-06-22",
        status: "MITIGATING",
      },
      {
        id: randomUUID(),
        title: "배포 승인 지연",
        cause: "영향도 분석 누락",
        impact: "운영 전환 일정 지연",
        owner: "콘텐츠 관리자",
        dueDate: "2026-06-21",
        status: "OPEN",
      },
    );

    this.deliverables.push(
      {
        id: randomUUID(),
        name: "운영 가이드",
        version: "v0.9",
        dueDate: "2026-06-19",
        approvalStatus: "PENDING",
        linkedRequirements: ["FR-025", "FR-032"],
      },
      {
        id: randomUUID(),
        name: "OpenAPI 계약",
        version: "v0.1",
        dueDate: "2026-06-18",
        approvalStatus: "APPROVED",
        linkedRequirements: ["FR-022"],
      },
    );

    this.changeRequests.push(
      {
        id: randomUUID(),
        title: "검색 요약 노출 방식 조정",
        requester: "포털 운영팀",
        impactAnalysis: "UI 밀도 증가, API 변경 없음",
        status: "READY_FOR_APPROVAL",
        requestedAt: this.shiftDays(-2),
      },
      {
        id: randomUUID(),
        title: "PDF 변환 스캔본 OCR 도입",
        requester: "운영위원회",
        impactAnalysis: "",
        status: "ANALYSIS_REQUIRED",
        requestedAt: this.shiftDays(-1),
      },
    );

    this.seedAudit("user-admin", "Folder", policy.id, "CREATE", { name: policy.name });
    this.seedAudit("user-admin", "Folder", operations.id, "CREATE", { name: operations.name });
    this.seedAudit("user-admin", "Document", publishedDoc.id, "PUBLISH", { title: publishedDoc.title });
  }

  getWorkspace(): Workspace {
    return this.workspace;
  }

  listUsers(): User[] {
    return [...this.users];
  }

  getUser(userId: string): User {
    const user = this.users.find((item) => item.id === userId);
    if (!user) {
      throw new NotFoundException(`User ${userId} not found`);
    }
    return user;
  }

  findUserByEmail(email: string): User | undefined {
    return this.users.find((item) => item.email === email);
  }

  registerUser(input: RegisterUserInput): SessionUser {
    const username = input.id.trim();
    const email = input.email.trim().toLowerCase();
    const password = input.password.trim();

    if (!username || !password || !email) {
      throw new BadRequestException("id, password, and email are required");
    }

    if (this.authUsers.some((item) => item.username === username)) {
      throw new ConflictException(`User id ${username} already exists`);
    }

    if (this.authUsers.some((item) => item.email === email)) {
      throw new ConflictException(`User email ${email} already exists`);
    }

    if (this.users.some((item) => item.email === email)) {
      throw new ConflictException(`User email ${email} already exists`);
    }

    const now = new Date().toISOString();
    const authUser = this.createAuthUser(username, email, "USER", password, now);
    const profile = this.createUser(`user-auth-${username}`, email, username, "USER", now);
    this.authUsers.push(authUser);
    this.users.push(profile);
    return this.createAuthSession(authUser);
  }

  authenticateUser(identifier: string, password: string): SessionUser {
    const normalizedIdentifier = identifier.trim().toLowerCase();
    const authUser = this.authUsers.find(
      (item) => item.username.toLowerCase() === normalizedIdentifier || item.email.toLowerCase() === normalizedIdentifier,
    );
    if (!authUser || authUser.passwordHash !== this.hashPassword(password)) {
      throw new BadRequestException("Invalid credentials");
    }

    authUser.lastLoginAt = new Date().toISOString();
    authUser.updatedAt = authUser.lastLoginAt;
    return this.createAuthSession(authUser);
  }

  createSession(email: string): SessionUser {
    const user = this.findUserByEmail(email);
    if (!user) {
      throw new NotFoundException(`Unknown user ${email}`);
    }
    user.lastLoginAt = new Date().toISOString();
    return this.toSession(user);
  }

  getSessionFromToken(token: string): SessionUser | undefined {
    const authSession = this.activeSessions.get(token);
    if (authSession) {
      return authSession;
    }

    const user = this.findUserByEmail(token);
    if (!user || user.status !== "ACTIVE") {
      return undefined;
    }
    return this.toSession(user);
  }

  listRootFolders(): FolderSummary[] {
    return this.folders
      .filter((folder) => folder.parentId === null && folder.status !== "DELETED")
      .sort(this.bySortOrder)
      .map((folder) => this.toFolderSummary(folder));
  }

  createFolder(input: CreateFolderInput, actorId: string): FolderSummary {
    const parent = input.parentId ? this.getFolder(input.parentId) : null;
    this.assertFolderNameUnique(input.name, input.parentId ?? null);
    const folder = this.seedFolder(
      {
        parentId: parent?.id ?? null,
        name: input.name,
        status: input.status ?? "ACTIVE",
        sortOrder: input.sortOrder ?? this.nextFolderSortOrder(parent?.id ?? null),
      },
      actorId,
    );
    this.recordAudit(actorId, "Folder", folder.id, "CREATE", { name: folder.name });
    return this.toFolderSummary(folder);
  }

  updateFolder(folderId: string, input: UpdateFolderInput, actorId: string): FolderSummary {
    const folder = this.getFolder(folderId);
    if (folder.status === "DELETED") {
      throw new ConflictException("Deleted folder cannot be updated");
    }
    const nextName = input.name ?? folder.name;
    const nextParentId = input.parentId === undefined ? folder.parentId : input.parentId;
    if (nextParentId === folder.id) {
      throw new BadRequestException("Folder cannot be its own parent");
    }
    this.assertFolderNameUnique(nextName, nextParentId ?? null, folder.id);
    folder.parentId = nextParentId ?? null;
    folder.name = nextName;
    folder.slug = slugify(nextName);
    folder.status = input.status ?? folder.status;
    folder.sortOrder = input.sortOrder ?? folder.sortOrder;
    folder.updatedBy = actorId;
    folder.updatedAt = new Date().toISOString();
    this.refreshFolderPaths();
    this.recordAudit(actorId, "Folder", folder.id, "UPDATE", { name: folder.name, status: folder.status });
    return this.toFolderSummary(folder);
  }

  deleteFolder(folderId: string, actorId: string): FolderSummary {
    const folder = this.getFolder(folderId);
    const activeChildren = this.folders.some((item) => item.parentId === folderId && item.status !== "DELETED");
    const activeDocuments = this.documents.some((item) => item.folderId === folderId && item.status !== "DELETED");
    if (activeChildren || activeDocuments) {
      throw new ConflictException("폴더에 하위 항목이 남아 있어 삭제할 수 없습니다.");
    }
    folder.status = "DELETED";
    folder.deletedAt = new Date().toISOString();
    folder.updatedAt = folder.deletedAt;
    folder.updatedBy = actorId;
    this.recordAudit(actorId, "Folder", folder.id, "DELETE", { name: folder.name });
    return this.toFolderSummary(folder);
  }

  listFolderChildren(folderId: string): PortalFolderContents {
    const folder = this.getFolder(folderId);
    return {
      folder: this.toFolderSummary(folder),
      breadcrumb: this.getFolderAncestors(folderId).map((item) => this.toFolderSummary(item)),
      folders: this.folders
        .filter((item) => item.parentId === folderId && item.status !== "DELETED")
        .sort(this.bySortOrder)
        .map((item) => this.toFolderSummary(item)),
      documents: this.documents
        .filter((item) => item.folderId === folderId && item.status !== "DELETED")
        .sort(this.bySortOrder)
        .map((item) => this.toDocumentSummary(item)),
    };
  }

  reorderFolderChildren(folderId: string, items: Array<{ id: string; sortOrder: number }>, actorId: string): PortalFolderContents {
    this.getFolder(folderId);
    items.forEach((item) => {
      const folder = this.folders.find((candidate) => candidate.id === item.id && candidate.parentId === folderId);
      if (folder) {
        folder.sortOrder = item.sortOrder;
        folder.updatedAt = new Date().toISOString();
        folder.updatedBy = actorId;
        return;
      }
      const document = this.documents.find((candidate) => candidate.id === item.id && candidate.folderId === folderId);
      if (document) {
        document.sortOrder = item.sortOrder;
        document.updatedAt = new Date().toISOString();
        document.updatedBy = actorId;
      }
    });
    this.recordAudit(actorId, "Folder", folderId, "UPDATE", { reordered: items.length });
    return this.listFolderChildren(folderId);
  }

  createDocument(input: CreateDocumentInput, actorId: string): DocumentDetail {
    const folder = this.getFolder(input.folderId);
    if (folder.status === "DELETED") {
      throw new ConflictException("삭제된 폴더에는 문서를 만들 수 없습니다.");
    }
    const now = new Date().toISOString();
    const documentId = randomUUID();
    const versionId = randomUUID();
    const status: DocumentStatus = "DRAFT";
    const title = input.title.trim();
    const markdownBody = input.markdownBody.trim();
    const summary = (input.summary ?? summarizeMarkdown(markdownBody)).trim();
    const record: DocumentRecord = {
      id: documentId,
      folderId: folder.id,
      title,
      slug: slugify(title),
      summary,
      status,
      visibilityScope: input.visibilityScope ?? "INTERNAL",
      sortOrder: this.nextDocumentSortOrder(folder.id),
      currentVersionId: versionId,
      createdBy: actorId,
      updatedBy: actorId,
      createdAt: now,
      updatedAt: now,
      hasUnpublishedChanges: false,
    };
    const version: DocumentVersion = {
      id: versionId,
      documentId,
      versionNo: 1,
      title,
      markdownBody,
      renderedExcerpt: summarizeMarkdown(markdownBody),
      status,
      changeSummary: input.changeSummary,
      sourceType: "MANUAL",
      pdfImportStatus: "NOT_REQUESTED",
      createdBy: actorId,
      createdAt: now,
    };
    this.documents.push(record);
    this.versions.push(version);
    this.recordAudit(actorId, "Document", documentId, "CREATE", { title });
    return this.getDocumentDetail(documentId);
  }

  updateDocument(documentId: string, input: UpdateDocumentInput, actorId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    const currentVersion = this.getVersion(record.currentVersionId);
    if (input.expectedVersionId && input.expectedVersionId !== currentVersion.id) {
      throw new ConflictException("최신 버전이 이미 존재합니다. 다시 불러온 뒤 저장하세요.");
    }
    const targetFolder = input.folderId ? this.getFolder(input.folderId) : this.getFolder(record.folderId);
    const nextTitle = input.title?.trim() || record.title;
    const nextBody = input.markdownBody?.trim() || currentVersion.markdownBody;
    const now = new Date().toISOString();
    const nextStatus = record.status === "PUBLISHED" ? "PUBLISHED" : "DRAFT";
    const newVersion: DocumentVersion = {
      id: randomUUID(),
      documentId,
      versionNo: this.listVersions(documentId).length + 1,
      title: nextTitle,
      markdownBody: nextBody,
      renderedExcerpt: summarizeMarkdown(nextBody),
      status: nextStatus,
      changeSummary: input.changeSummary,
      sourceType: "MANUAL",
      pdfImportStatus: "NOT_REQUESTED",
      createdBy: actorId,
      createdAt: now,
    };
    this.versions.push(newVersion);
    record.folderId = targetFolder.id;
    record.title = nextTitle;
    record.slug = slugify(nextTitle);
    record.summary = (input.summary ?? summarizeMarkdown(nextBody)).trim();
    record.visibilityScope = input.visibilityScope ?? record.visibilityScope;
    record.currentVersionId = newVersion.id;
    record.updatedAt = now;
    record.updatedBy = actorId;
    record.hasUnpublishedChanges = record.status === "PUBLISHED";
    if (record.status !== "PUBLISHED") {
      record.status = "DRAFT";
    }
    this.recordAudit(actorId, "Document", documentId, "UPDATE", { versionId: newVersion.id });
    return this.getDocumentDetail(documentId);
  }

  getDocumentDetail(documentId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    const version = this.getVersion(record.currentVersionId);
    return {
      ...this.toDocumentSummary(record),
      markdownBody: version.markdownBody,
      renderedBody: renderMarkdownToHtml(version.markdownBody),
      folderPath: this.getFolder(record.folderId).path,
      publishedAt: record.publishedAt ?? null,
      attachments: this.listAttachmentSummaries(documentId),
      versions: this.listVersions(documentId),
    };
  }

  getDocument(documentId: string): DocumentRecord {
    const record = this.documents.find((item) => item.id === documentId);
    if (!record) {
      throw new NotFoundException(`Document ${documentId} not found`);
    }
    return record;
  }

  deleteDocument(documentId: string, actorId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    record.status = "DELETED";
    record.deletedAt = new Date().toISOString();
    record.updatedAt = record.deletedAt;
    record.updatedBy = actorId;
    record.hasUnpublishedChanges = false;
    this.attachments
      .filter((item) => item.documentId === documentId && item.status !== "DELETED")
      .forEach((attachment) => {
        attachment.status = "DELETED";
        attachment.deletedAt = record.deletedAt;
      });
    this.recordAudit(actorId, "Document", documentId, "DELETE", { title: record.title });
    return this.getDocumentDetail(documentId);
  }

  submitReview(documentId: string, comment: string | undefined, actorId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    if (record.status !== "DRAFT" && !(record.status === "PUBLISHED" && record.hasUnpublishedChanges)) {
      throw new ConflictException("검토 요청은 초안 상태에서만 가능합니다.");
    }
    record.status = "IN_REVIEW";
    record.updatedAt = new Date().toISOString();
    record.updatedBy = actorId;
    this.recordAudit(actorId, "Document", documentId, "SUBMIT_REVIEW", { comment });
    return this.getDocumentDetail(documentId);
  }

  approveDocument(documentId: string, comment: string | undefined, actorId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    if (record.status !== "IN_REVIEW") {
      throw new ConflictException("검토 중 문서만 승인할 수 있습니다.");
    }
    record.status = "APPROVED";
    record.lastReviewedAt = new Date().toISOString();
    record.lastReviewedBy = actorId;
    record.updatedAt = record.lastReviewedAt;
    this.recordAudit(actorId, "Document", documentId, "APPROVE", { comment });
    return this.getDocumentDetail(documentId);
  }

  publishDocument(documentId: string, actorId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    if (record.status !== "APPROVED" && !(record.status === "PUBLISHED" && record.hasUnpublishedChanges)) {
      throw new ConflictException("승인된 문서만 발행할 수 있습니다.");
    }
    record.status = "PUBLISHED";
    record.publishedVersionId = record.currentVersionId;
    record.publishedAt = new Date().toISOString();
    record.publishedBy = actorId;
    record.updatedAt = record.publishedAt;
    record.updatedBy = actorId;
    record.hasUnpublishedChanges = false;
    this.recordAudit(actorId, "Document", documentId, "PUBLISH", { versionId: record.currentVersionId });
    return this.getDocumentDetail(documentId);
  }

  unpublishDocument(documentId: string, actorId: string, reason?: string): DocumentDetail {
    const record = this.getDocument(documentId);
    if (record.status !== "PUBLISHED") {
      throw new ConflictException("발행된 문서만 게시중단할 수 있습니다.");
    }
    record.status = "UNPUBLISHED";
    record.updatedAt = new Date().toISOString();
    record.updatedBy = actorId;
    this.recordAudit(actorId, "Document", documentId, "UNPUBLISH", { reason });
    return this.getDocumentDetail(documentId);
  }

  createAttachment(documentId: string, input: CreateAttachmentInput, actorId: string): AttachmentSummary {
    const record = this.getDocument(documentId);
    if (record.status === "DELETED") {
      throw new ConflictException("삭제된 문서에는 첨부파일을 추가할 수 없습니다.");
    }
    const now = new Date().toISOString();
    const extension = input.fileName.includes(".") ? input.fileName.split(".").pop() ?? "bin" : "bin";
    const contentType = input.contentType ?? guessContentType(extension);
    const attachment: Attachment = {
      id: randomUUID(),
      documentId,
      storageProvider: "mock-s3",
      storageBucket: "cms-assets",
      storageKey: `${documentId}/${randomUUID()}-${input.fileName}`,
      originalFilename: input.fileName,
      contentType,
      extension,
      fileSize: input.fileSize ?? 128_000,
      checksum: createHash("sha1").update(`${documentId}:${input.fileName}:${now}`).digest("hex"),
      status: extension === "pdf" && input.fileName.toLowerCase().includes("encrypted") ? "ORPHANED" : "ACTIVE",
      virusScanStatus: "PASSED",
      linkRole: input.linkRole ?? "REFERENCE_FILE",
      createdBy: actorId,
      createdAt: now,
      url: `https://download.example.com/assets/${documentId}/${encodeURIComponent(input.fileName)}`,
    };
    this.attachments.push(attachment);
    this.recordAudit(actorId, "Attachment", attachment.id, "CREATE", { documentId, fileName: attachment.originalFilename });
    return this.toAttachmentSummary(attachment);
  }

  deleteAttachment(attachmentId: string, actorId: string): AttachmentSummary {
    const attachment = this.getAttachment(attachmentId);
    attachment.status = "DELETED";
    attachment.deletedAt = new Date().toISOString();
    this.recordAudit(actorId, "Attachment", attachment.id, "DELETE", { fileName: attachment.originalFilename });
    return this.toAttachmentSummary(attachment);
  }

  getAttachmentRedirect(attachmentId: string, actorId?: string): string {
    const attachment = this.getAttachment(attachmentId);
    if (attachment.status !== "ACTIVE") {
      throw new ConflictException("다운로드할 수 없는 첨부파일입니다.");
    }
    if (actorId) {
      this.recordAudit(actorId, "Attachment", attachment.id, "DOWNLOAD", { documentId: attachment.documentId });
    }
    return attachment.url;
  }

  getPortalTree(): FolderSummary[] {
    return this.folders
      .filter((folder) => folder.parentId === null && this.isPortalFolderVisible(folder))
      .sort(this.bySortOrder)
      .map((folder) => this.toFolderSummary(folder));
  }

  getPortalFolder(folderId: string): PortalFolderContents {
    const folder = this.getFolder(folderId);
    if (!this.isPortalFolderVisible(folder)) {
      throw new NotFoundException("포털에서 접근할 수 없는 폴더입니다.");
    }
    return {
      folder: this.toFolderSummary(folder),
      breadcrumb: this.getFolderAncestors(folderId)
        .filter((item) => this.isPortalFolderVisible(item))
        .map((item) => this.toFolderSummary(item)),
      folders: this.folders
        .filter((item) => item.parentId === folderId && this.isPortalFolderVisible(item))
        .sort(this.bySortOrder)
        .map((item) => this.toFolderSummary(item)),
      documents: this.documents
        .filter((item) => item.folderId === folderId && this.isPortalDocumentVisible(item))
        .sort(this.bySortOrder)
        .map((item) => this.toDocumentSummary(item)),
    };
  }

  getPortalDocument(documentId: string): DocumentDetail {
    const record = this.getDocument(documentId);
    if (!this.isPortalDocumentVisible(record)) {
      throw new NotFoundException("포털에서 접근할 수 없는 문서입니다.");
    }
    const publishedVersion = record.publishedVersionId ? this.getVersion(record.publishedVersionId) : this.getVersion(record.currentVersionId);
    return {
      ...this.toDocumentSummary(record),
      markdownBody: publishedVersion.markdownBody,
      renderedBody: renderMarkdownToHtml(publishedVersion.markdownBody),
      folderPath: this.getFolder(record.folderId).path,
      publishedAt: record.publishedAt ?? null,
      attachments: this.listAttachmentSummaries(documentId).filter((item) => item.status === "ACTIVE"),
      versions: [],
    };
  }

  searchDocuments(query: string, page = 1, size = 20): { total: number; items: SearchResult[] } {
    const normalized = query.trim().toLowerCase();
    if (!normalized) {
      throw new BadRequestException("검색어를 입력하세요.");
    }
    if (normalized.length > 100) {
      throw new BadRequestException("검색어는 100자 이하로 입력하세요.");
    }
    const results = this.documents
      .filter((record) => this.isPortalDocumentVisible(record))
      .map((record) => {
        const publishedVersion = record.publishedVersionId ? this.getVersion(record.publishedVersionId) : this.getVersion(record.currentVersionId);
        const haystack = `${record.title}\n${publishedVersion.markdownBody}`.toLowerCase();
        const titleMatch = record.title.toLowerCase().includes(normalized);
        const bodyMatch = haystack.includes(normalized);
        if (!titleMatch && !bodyMatch) {
          return null;
        }
        return {
          documentId: record.id,
          title: record.title,
          folderPath: this.getFolder(record.folderId).path.join(" / "),
          summary: summarizeSearchHit(publishedVersion.markdownBody, normalized),
          updatedAt: record.updatedAt,
          score: titleMatch ? 1 : 0.6,
        } satisfies SearchResult;
      })
      .filter((item): item is SearchResult => Boolean(item))
      .sort((left, right) => right.score - left.score || right.updatedAt.localeCompare(left.updatedAt));
    const start = (Math.max(page, 1) - 1) * size;
    return {
      total: results.length,
      items: results.slice(start, start + size),
    };
  }

  getHealthStatus() {
    return {
      status: this.backupRuns.some((item) => item.status === "PARTIAL_FAILURE") ? "DEGRADED" : "UP",
      checkedAt: new Date().toISOString(),
      components: [
        { name: "application", status: "UP" },
        { name: "postgresql", status: "UP" },
        { name: "object-storage", status: "UP" },
      ],
    };
  }

  listBackups(): BackupRun[] {
    return [...this.backupRuns].sort((left, right) => right.startedAt.localeCompare(left.startedAt));
  }

  startBackup(actorId: string): BackupRun {
    const now = new Date().toISOString();
    const run: BackupRun = {
      id: randomUUID(),
      runType: "MANUAL",
      status: "RUNNING",
      validationStatus: "PENDING",
      startedAt: now,
      completedAt: null,
      databaseArtifactUri: `s3://cms-backups/${now}/db.sql.gz`,
      fileArtifactUri: `s3://cms-backups/${now}/assets.tar.gz`,
      retentionExpiresAt: this.shiftDays(14),
      triggeredBy: actorId,
    };
    this.backupRuns.unshift(run);
    run.status = "SUCCEEDED";
    run.validationStatus = "PASSED";
    run.completedAt = this.shiftMinutes(2);
    this.recordAudit(actorId, "BackupRun", run.id, "BACKUP", { runType: run.runType });
    return run;
  }

  restoreBackup(backupRunId: string, actorId: string): RestoreRun {
    const backup = this.backupRuns.find((item) => item.id === backupRunId);
    if (!backup) {
      throw new NotFoundException(`Backup ${backupRunId} not found`);
    }
    const restore: RestoreRun = {
      id: randomUUID(),
      backupRunId,
      status: "SUCCEEDED",
      targetEnvironment: "staging",
      validationReport: "문서, 첨부파일, 감사기록 참조 정합성 확인 완료",
      triggeredBy: actorId,
      startedAt: new Date().toISOString(),
      completedAt: this.shiftMinutes(3),
    };
    this.restoreRuns.unshift(restore);
    this.recordAudit(actorId, "RestoreRun", restore.id, "RESTORE", { backupRunId });
    return restore;
  }

  listSoftwareInventory(): SoftwareInventoryItem[] {
    return [...this.softwareInventory];
  }

  createSoftwareInventoryItem(actorId: string, input: Partial<SoftwareInventoryItem>): SoftwareInventoryItem {
    const item: SoftwareInventoryItem = {
      id: randomUUID(),
      componentName: input.componentName ?? "신규 구성요소",
      componentType: input.componentType ?? "LIBRARY",
      version: input.version ?? "0.1.0",
      licenseName: input.licenseName ?? "Unknown",
      licenseStatus: input.licenseStatus ?? "CONDITIONAL",
      vulnerabilitySummary: input.vulnerabilitySummary ?? "검토 필요",
      riskLevel: input.riskLevel ?? "MEDIUM",
      approvedBy: input.approvedBy,
      approvedAt: input.approvedAt,
      notes: input.notes,
    };
    this.softwareInventory.unshift(item);
    this.recordAudit(actorId, "SoftwareInventoryItem", item.id, "CREATE", { componentName: item.componentName });
    return item;
  }

  listDeployments(): DeploymentRelease[] {
    return [...this.deployments];
  }

  listSchedules(): ProjectSchedule[] {
    return [...this.schedules];
  }

  createSchedule(actorId: string, input: Partial<ProjectSchedule>): ProjectSchedule {
    const item: ProjectSchedule = {
      id: randomUUID(),
      name: input.name ?? "신규 일정",
      phase: input.phase ?? "계획",
      ownerName: input.ownerName ?? "미정",
      plannedStartDate: input.plannedStartDate ?? new Date().toISOString().slice(0, 10),
      plannedEndDate: input.plannedEndDate ?? this.shiftDays(7).slice(0, 10),
      status: input.status ?? "ON_TRACK",
      mitigationPlan: input.mitigationPlan,
    };
    this.schedules.unshift(item);
    this.recordAudit(actorId, "ProjectSchedule", item.id, "CREATE", { name: item.name });
    return item;
  }

  listScopeItems(): ScopeItem[] {
    return [...this.scopeItems];
  }

  listStaffAssignments(): StaffAssignment[] {
    return [...this.staffAssignments];
  }

  listRisks(): RiskIssue[] {
    return [...this.risks];
  }

  listDeliverables(): Deliverable[] {
    return [...this.deliverables];
  }

  listChangeRequests(): ChangeRequest[] {
    return [...this.changeRequests];
  }

  createChangeRequest(actorId: string, input: Partial<ChangeRequest>): ChangeRequest {
    const impactAnalysis = input.impactAnalysis ?? "";
    const status = impactAnalysis.trim() ? "READY_FOR_APPROVAL" : "ANALYSIS_REQUIRED";
    const item: ChangeRequest = {
      id: randomUUID(),
      title: input.title ?? "신규 변경 요청",
      requester: input.requester ?? this.getUser(actorId).displayName,
      impactAnalysis,
      status,
      requestedAt: new Date().toISOString(),
      approvedAt: status === "READY_FOR_APPROVAL" && input.status === "APPROVED" ? new Date().toISOString() : undefined,
    };
    this.changeRequests.unshift(item);
    this.recordAudit(actorId, "ChangeRequest", item.id, "CREATE", { title: item.title, status: item.status });
    return item;
  }

  listAuditEvents(): AuditEvent[] {
    return [...this.auditEvents].sort((left, right) => right.createdAt.localeCompare(left.createdAt));
  }

  getDashboardSummary() {
    const publishedCount = this.documents.filter((item) => this.isPortalDocumentVisible(item)).length;
    const reviewQueue = this.documents.filter((item) => item.status === "IN_REVIEW");
    return {
      highlights: [
        { key: "published", label: "최근 게시 문서", value: String(publishedCount), tone: "accent" as const },
        { key: "review", label: "검토 대기", value: String(reviewQueue.length), tone: "warning" as const },
        {
          key: "backup",
          label: "최근 백업",
          value: this.backupRuns[0]?.status ?? "NONE",
          tone: this.backupRuns[0]?.status === "SUCCEEDED" ? ("success" as const) : ("warning" as const),
        },
        { key: "risk", label: "오픈 리스크", value: String(this.risks.filter((item) => item.status !== "CLOSED").length), tone: "neutral" as const },
      ],
      recentPublications: this.documents
        .filter((item) => item.publishedAt)
        .sort((left, right) => (right.publishedAt ?? "").localeCompare(left.publishedAt ?? ""))
        .slice(0, 4)
        .map((item) => ({
          id: item.id,
          title: item.title,
          folderPath: this.getFolder(item.folderId).path.join(" / "),
          updatedAt: item.updatedAt,
          status: item.status,
        })),
      reviewQueue: reviewQueue.map((item) => ({
        id: item.id,
        title: item.title,
        updatedAt: item.updatedAt,
        folderPath: this.getFolder(item.folderId).path.join(" / "),
      })),
      backups: this.listBackups().slice(0, 3),
      risks: this.listRisks().slice(0, 3),
      deployments: this.listDeployments().slice(0, 3),
    };
  }

  recordAudit(actorId: string, entityType: string, entityId: string, action: AuditAction, metadata?: Record<string, unknown>): AuditEvent {
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

  private createUser(id: string, email: string, displayName: string, role: User["role"], now: string): User {
    return {
      id,
      workspaceId: this.workspace.id,
      email,
      displayName,
      role,
      status: "ACTIVE",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };
  }

  private createAuthUser(
    username: string,
    email: string,
    role: "ADMIN" | "USER",
    password: string,
    now: string,
  ): AuthUserAccount {
    return {
      id: `auth-${username}`,
      username,
      email,
      passwordHash: this.hashPassword(password),
      role,
      createdAt: now,
      updatedAt: now,
      lastLoginAt: now,
    };
  }

  private createAuthSession(user: AuthUserAccount): SessionUser {
    const token = `session-${randomUUID()}`;
    const matchedProfile = this.findUserByEmail(user.email);
    const session = matchedProfile
      ? { ...this.toSession(matchedProfile), token }
      : {
          id: user.id,
          workspaceId: this.workspace.id,
          email: user.email,
          displayName: user.username,
          role: user.role,
          token,
        };
    this.activeSessions.set(token, session);
    return session;
  }

  private hashPassword(password: string): string {
    return createHash("sha256").update(password).digest("hex");
  }

  private toSession(user: User): SessionUser {
    return {
      id: user.id,
      workspaceId: user.workspaceId,
      email: user.email,
      displayName: user.displayName,
      role: user.role,
      token: user.email,
    };
  }

  private seedFolder(
    input: CreateFolderInput & { status: FolderStatus; sortOrder: number },
    actorId: string,
  ): Folder {
    const now = new Date().toISOString();
    const parent = input.parentId ? this.folders.find((item) => item.id === input.parentId) ?? null : null;
    const folder: Folder = {
      id: randomUUID(),
      parentId: input.parentId ?? null,
      name: input.name,
      slug: slugify(input.name),
      status: input.status,
      sortOrder: input.sortOrder,
      depth: parent ? parent.depth + 1 : 0,
      path: parent ? [...parent.path, input.name] : [input.name],
      createdBy: actorId,
      updatedBy: actorId,
      createdAt: now,
      updatedAt: now,
    };
    this.folders.push(folder);
    return folder;
  }

  private seedDocument(input: CreateDocumentInput, actorId: string): DocumentDetail {
    return this.createDocument(input, actorId);
  }

  private seedAudit(actorId: string, entityType: string, entityId: string, action: AuditAction, metadata?: Record<string, unknown>) {
    this.auditEvents.push({
      id: randomUUID(),
      workspaceId: this.workspace.id,
      actorId,
      entityType,
      entityId,
      action,
      metadata,
      createdAt: new Date().toISOString(),
    });
  }

  private getFolder(folderId: string): Folder {
    const folder = this.folders.find((item) => item.id === folderId);
    if (!folder) {
      throw new NotFoundException(`Folder ${folderId} not found`);
    }
    return folder;
  }

  private getAttachment(attachmentId: string): Attachment {
    const attachment = this.attachments.find((item) => item.id === attachmentId);
    if (!attachment) {
      throw new NotFoundException(`Attachment ${attachmentId} not found`);
    }
    return attachment;
  }

  private getVersion(versionId: string): DocumentVersion {
    const version = this.versions.find((item) => item.id === versionId);
    if (!version) {
      throw new NotFoundException(`Version ${versionId} not found`);
    }
    return version;
  }

  private listVersions(documentId: string): DocumentVersion[] {
    return this.versions
      .filter((item) => item.documentId === documentId)
      .sort((left, right) => right.versionNo - left.versionNo);
  }

  private listAttachmentSummaries(documentId: string): AttachmentSummary[] {
    return this.attachments
      .filter((item) => item.documentId === documentId)
      .map((item) => this.toAttachmentSummary(item));
  }

  private toFolderSummary(folder: Folder): FolderSummary {
    return {
      id: folder.id,
      parentId: folder.parentId,
      name: folder.name,
      status: folder.status,
      sortOrder: folder.sortOrder,
      hasChildren: this.folders.some((item) => item.parentId === folder.id && item.status !== "DELETED"),
      childDocumentCount: this.documents.filter((item) => item.folderId === folder.id && item.status !== "DELETED").length,
    };
  }

  private toAttachmentSummary(attachment: Attachment): AttachmentSummary {
    return {
      id: attachment.id,
      originalFilename: attachment.originalFilename,
      contentType: attachment.contentType,
      fileSize: attachment.fileSize,
      status: attachment.status,
      downloadUrl: attachment.status === "ACTIVE" ? `/api/v1/portal/attachments/${attachment.id}/download` : null,
    };
  }

  private toDocumentSummary(record: DocumentRecord): DocumentSummary {
    return {
      id: record.id,
      folderId: record.folderId,
      title: record.title,
      slug: record.slug,
      summary: record.summary,
      status: record.status,
      visibilityScope: record.visibilityScope,
      sortOrder: record.sortOrder,
      updatedAt: record.updatedAt,
      hasUnpublishedChanges: record.hasUnpublishedChanges,
    };
  }

  private assertFolderNameUnique(name: string, parentId: string | null, excludeId?: string) {
    const normalized = name.trim().toLowerCase();
    const duplicate = this.folders.find(
      (item) =>
        item.id !== excludeId &&
        item.parentId === parentId &&
        item.status !== "DELETED" &&
        item.name.trim().toLowerCase() === normalized,
    );
    if (duplicate) {
      throw new ConflictException("같은 위치에 동일한 이름의 폴더가 이미 존재합니다.");
    }
  }

  private refreshFolderPaths() {
    const walk = (folder: Folder, parent: Folder | null) => {
      folder.depth = parent ? parent.depth + 1 : 0;
      folder.path = parent ? [...parent.path, folder.name] : [folder.name];
      this.folders
        .filter((item) => item.parentId === folder.id)
        .forEach((child) => walk(child, folder));
    };
    this.folders
      .filter((item) => item.parentId === null)
      .forEach((root) => walk(root, null));
  }

  private getFolderAncestors(folderId: string): Folder[] {
    const folder = this.getFolder(folderId);
    const chain: Folder[] = [];
    let current: Folder | undefined = folder;
    while (current) {
      const node: Folder = current;
      chain.unshift(node);
      current = node.parentId ? this.folders.find((item) => item.id === node.parentId) : undefined;
    }
    return chain;
  }

  private nextFolderSortOrder(parentId: string | null): number {
    const siblings = this.folders.filter((item) => item.parentId === parentId && item.status !== "DELETED");
    return (siblings.at(-1)?.sortOrder ?? 0) + 10;
  }

  private nextDocumentSortOrder(folderId: string): number {
    const siblings = this.documents.filter((item) => item.folderId === folderId && item.status !== "DELETED");
    return (siblings.at(-1)?.sortOrder ?? 0) + 10;
  }

  private isPortalFolderVisible(folder: Folder): boolean {
    return folder.status === "ACTIVE";
  }

  private isPortalDocumentVisible(record: DocumentRecord): boolean {
    const folder = this.getFolder(record.folderId);
    return record.status === "PUBLISHED" && record.visibilityScope === "PUBLIC" && folder.status === "ACTIVE";
  }

  private shiftMinutes(offset: number): string {
    return new Date(Date.now() + offset * 60_000).toISOString();
  }

  private shiftDays(offset: number): string {
    return new Date(Date.now() + offset * 24 * 60_000 * 60).toISOString();
  }

  private readonly bySortOrder = <T extends { sortOrder: number }>(left: T, right: T) => left.sortOrder - right.sortOrder;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9가-힣\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-");
}

function summarizeMarkdown(markdown: string): string {
  return markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/[#>*_`|[\]-]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 140);
}

function summarizeSearchHit(markdown: string, query: string): string {
  const plain = summarizeMarkdown(markdown);
  const index = plain.toLowerCase().indexOf(query.toLowerCase());
  if (index < 0) {
    return plain.slice(0, 120);
  }
  const start = Math.max(0, index - 30);
  const end = Math.min(plain.length, index + query.length + 60);
  return plain.slice(start, end);
}

function guessContentType(extension: string): string {
  switch (extension.toLowerCase()) {
    case "pdf":
      return "application/pdf";
    case "png":
      return "image/png";
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "md":
      return "text/markdown";
    default:
      return "application/octet-stream";
  }
}

function renderMarkdownToHtml(markdown: string): string {
  const lines = markdown.split("\n");
  const html: string[] = [];
  let inList = false;
  let inCode = false;
  let tableBuffer: string[][] = [];

  const flushList = () => {
    if (inList) {
      html.push("</ul>");
      inList = false;
    }
  };

  const flushTable = () => {
    if (tableBuffer.length > 0) {
      const [header, ...rows] = tableBuffer;
      html.push("<table><thead><tr>");
      header.forEach((cell) => html.push(`<th>${escapeHtml(cell)}</th>`));
      html.push("</tr></thead><tbody>");
      rows.forEach((row) => {
        html.push("<tr>");
        row.forEach((cell) => html.push(`<td>${escapeHtml(cell)}</td>`));
        html.push("</tr>");
      });
      html.push("</tbody></table>");
      tableBuffer = [];
    }
  };

  lines.forEach((rawLine) => {
    const line = rawLine.trimEnd();
    if (line.startsWith("```")) {
      flushList();
      flushTable();
      if (!inCode) {
        html.push("<pre><code>");
        inCode = true;
      } else {
        html.push("</code></pre>");
        inCode = false;
      }
      return;
    }

    if (inCode) {
      html.push(`${escapeHtml(line)}\n`);
      return;
    }

    if (line.startsWith("|") && line.endsWith("|")) {
      flushList();
      const cells = line
        .split("|")
        .slice(1, -1)
        .map((cell) => cell.trim());
      if (!cells.every((cell) => /^-+$/.test(cell.replace(/:/g, "")))) {
        tableBuffer.push(cells);
      }
      return;
    }

    flushTable();

    if (!line) {
      flushList();
      html.push("<br />");
      return;
    }

    if (line.startsWith("- ")) {
      if (!inList) {
        html.push("<ul>");
        inList = true;
      }
      html.push(`<li>${inlineMarkdown(line.slice(2))}</li>`);
      return;
    }

    flushList();

    if (line.startsWith("# ")) {
      html.push(`<h1>${inlineMarkdown(line.slice(2))}</h1>`);
      return;
    }
    if (line.startsWith("## ")) {
      html.push(`<h2>${inlineMarkdown(line.slice(3))}</h2>`);
      return;
    }
    if (line.startsWith("> ")) {
      html.push(`<blockquote>${inlineMarkdown(line.slice(2))}</blockquote>`);
      return;
    }
    html.push(`<p>${inlineMarkdown(line)}</p>`);
  });

  flushList();
  flushTable();
  if (inCode) {
    html.push("</code></pre>");
  }
  return html.join("");
}

function inlineMarkdown(value: string): string {
  return escapeHtml(value)
    .replace(/!\[([^\]]*)\]\(([^)]+)\)/g, '<span class="md-image">$1 ($2)</span>')
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
