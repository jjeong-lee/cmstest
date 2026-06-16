export type Role = "ADMIN" | "REVIEWER" | "OPERATOR" | "USER";
export type UserStatus = "ACTIVE" | "INVITED" | "DISABLED";
export type FolderStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type DocumentStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "UNPUBLISHED" | "DELETED";
export type VisibilityScope = "PUBLIC" | "INTERNAL";
export type AttachmentStatus = "UPLOADING" | "ACTIVE" | "DELETED" | "ORPHANED" | "RESTORE_PENDING";
export type PdfImportStatus = "NOT_REQUESTED" | "PENDING" | "SUCCEEDED" | "UNSUPPORTED" | "FAILED";
export type BackupRunType = "SCHEDULED" | "MANUAL" | "PRE_RESTORE";
export type BackupStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "PARTIAL_FAILURE" | "FAILED";
export type ValidationStatus = "PENDING" | "PASSED" | "FAILED";
export type DeploymentStatus = "CREATED" | "APPROVED" | "DEPLOYED" | "ROLLED_BACK" | "FAILED";
export type LicenseStatus = "APPROVED" | "CONDITIONAL" | "RESTRICTED" | "PROHIBITED";
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
export type ChangeRequestStatus = "DRAFT" | "ANALYSIS_REQUIRED" | "READY_FOR_APPROVAL" | "APPROVED" | "IMPLEMENTED";
export type AuditAction =
  | "CREATE"
  | "UPDATE"
  | "DELETE"
  | "PUBLISH"
  | "UNPUBLISH"
  | "APPROVE"
  | "SUBMIT_REVIEW"
  | "DOWNLOAD"
  | "BACKUP"
  | "RESTORE"
  | "DEPLOY"
  | "IMPORT";

export interface Workspace {
  id: string;
  name: string;
  code: string;
  timezone: string;
  locale: string;
}

export interface User {
  id: string;
  workspaceId: string;
  email: string;
  displayName: string;
  role: Role;
  status: UserStatus;
  createdAt: string;
  updatedAt: string;
  lastLoginAt?: string;
}

export interface SessionUser {
  id: string;
  workspaceId: string;
  email: string;
  displayName: string;
  role: Role;
  token: string;
}

export interface Folder {
  id: string;
  parentId: string | null;
  name: string;
  slug: string;
  status: FolderStatus;
  sortOrder: number;
  depth: number;
  path: string[];
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
}

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNo: number;
  title: string;
  markdownBody: string;
  renderedExcerpt: string;
  status: DocumentStatus;
  changeSummary?: string;
  sourceType: "MANUAL" | "PDF_IMPORT" | "MIGRATION";
  pdfImportStatus: PdfImportStatus;
  createdBy: string;
  createdAt: string;
}

export interface DocumentRecord {
  id: string;
  folderId: string;
  title: string;
  slug: string;
  summary: string;
  status: DocumentStatus;
  visibilityScope: VisibilityScope;
  sortOrder: number;
  currentVersionId: string;
  publishedVersionId?: string;
  publishedAt?: string;
  publishedBy?: string;
  lastReviewedAt?: string;
  lastReviewedBy?: string;
  createdBy: string;
  updatedBy: string;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string;
  hasUnpublishedChanges: boolean;
}

export interface Attachment {
  id: string;
  documentId: string;
  storageProvider: string;
  storageBucket: string;
  storageKey: string;
  originalFilename: string;
  contentType: string;
  extension: string;
  fileSize: number;
  checksum: string;
  status: AttachmentStatus;
  virusScanStatus: "PENDING" | "PASSED" | "FAILED" | "SKIPPED";
  linkRole: "INLINE_IMAGE" | "REFERENCE_FILE" | "EXPORT_FILE";
  createdBy: string;
  createdAt: string;
  deletedAt?: string;
  url: string;
}

export interface AuditEvent {
  id: string;
  workspaceId: string;
  actorId: string;
  entityType: string;
  entityId: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface SearchResult {
  documentId: string;
  title: string;
  folderPath: string;
  summary: string;
  updatedAt: string;
  score: number;
}

export interface BackupRun {
  id: string;
  runType: BackupRunType;
  status: BackupStatus;
  validationStatus: ValidationStatus;
  startedAt: string;
  completedAt: string | null;
  databaseArtifactUri: string;
  fileArtifactUri: string;
  retentionExpiresAt: string;
  triggeredBy: string;
}

export interface RestoreRun {
  id: string;
  backupRunId: string;
  status: BackupStatus;
  targetEnvironment: string;
  validationReport: string;
  triggeredBy: string;
  startedAt: string;
  completedAt: string | null;
}

export interface SoftwareInventoryItem {
  id: string;
  componentName: string;
  componentType: "LIBRARY" | "SERVICE" | "TOOL" | "IMAGE";
  version: string;
  licenseName: string;
  licenseStatus: LicenseStatus;
  vulnerabilitySummary: string;
  riskLevel: RiskLevel;
  approvedBy?: string;
  approvedAt?: string;
  notes?: string;
}

export interface DeploymentRelease {
  id: string;
  releaseVersion: string;
  gitCommitSha: string;
  buildNumber: string;
  environment: string;
  status: DeploymentStatus;
  deployedAt?: string;
  approvedBy?: string;
  rollbackOfReleaseId?: string;
}

export interface ProjectSchedule {
  id: string;
  name: string;
  phase: string;
  ownerName: string;
  plannedStartDate: string;
  plannedEndDate: string;
  status: "ON_TRACK" | "AT_RISK" | "DELAYED";
  mitigationPlan?: string;
}

export interface ScopeItem {
  id: string;
  requirementId: string;
  title: string;
  status: "IN_SCOPE" | "OUT_OF_SCOPE" | "CHANGED";
  note?: string;
}

export interface StaffAssignment {
  id: string;
  role: string;
  assignee: string;
  startDate: string;
  endDate: string;
  approvalStatus: "PENDING" | "APPROVED";
}

export interface RiskIssue {
  id: string;
  title: string;
  cause: string;
  impact: string;
  owner: string;
  dueDate: string;
  status: "OPEN" | "MITIGATING" | "CLOSED";
}

export interface Deliverable {
  id: string;
  name: string;
  version: string;
  dueDate: string;
  approvalStatus: "PENDING" | "APPROVED" | "REJECTED";
  linkedRequirements: string[];
}

export interface ChangeRequest {
  id: string;
  title: string;
  requester: string;
  impactAnalysis: string;
  status: ChangeRequestStatus;
  requestedAt: string;
  approvedAt?: string;
}

export interface FolderSummary {
  id: string;
  parentId: string | null;
  name: string;
  status: FolderStatus;
  sortOrder: number;
  hasChildren: boolean;
  childDocumentCount: number;
}

export interface AttachmentSummary {
  id: string;
  originalFilename: string;
  contentType: string;
  fileSize: number;
  status: AttachmentStatus;
  downloadUrl: string | null;
}

export interface DocumentSummary {
  id: string;
  folderId: string;
  title: string;
  slug: string;
  summary: string;
  status: DocumentStatus;
  visibilityScope: VisibilityScope;
  sortOrder: number;
  updatedAt: string;
  hasUnpublishedChanges: boolean;
}

export interface DocumentDetail extends DocumentSummary {
  markdownBody: string;
  renderedBody: string;
  folderPath: string[];
  publishedAt: string | null;
  attachments: AttachmentSummary[];
  versions: DocumentVersion[];
}

export interface PortalFolderContents {
  folder: FolderSummary;
  breadcrumb: FolderSummary[];
  folders: FolderSummary[];
  documents: DocumentSummary[];
}

export interface DashboardSummary {
  highlights: Array<{ key: string; label: string; value: string; tone: "accent" | "success" | "warning" | "neutral" }>;
  recentPublications: Array<{ id: string; title: string; folderPath: string; updatedAt: string; status: DocumentStatus }>;
  reviewQueue: Array<{ id: string; title: string; updatedAt: string; folderPath: string }>;
  backups: BackupRun[];
  risks: RiskIssue[];
  deployments: DeploymentRelease[];
}
