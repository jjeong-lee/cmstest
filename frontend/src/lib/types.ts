export type Role = "ADMIN" | "REVIEWER" | "OPERATOR" | "USER";
export type FolderStatus = "ACTIVE" | "INACTIVE" | "DELETED";
export type DocumentStatus = "DRAFT" | "IN_REVIEW" | "APPROVED" | "PUBLISHED" | "UNPUBLISHED" | "DELETED";
export type VisibilityScope = "PUBLIC" | "INTERNAL";
export type AttachmentStatus = "UPLOADING" | "ACTIVE" | "DELETED" | "ORPHANED" | "RESTORE_PENDING";

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  workspaceId: string;
  token: string;
}

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  error?: {
    code: string;
    type: "VALIDATION" | "AUTHORIZATION" | "NOT_FOUND" | "CONFLICT" | "SYSTEM";
    details?: Array<{ field?: string; reason: string }>;
  };
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

export interface DocumentVersion {
  id: string;
  documentId: string;
  versionNo: number;
  title: string;
  markdownBody: string;
  renderedExcerpt: string;
  status: DocumentStatus;
  changeSummary?: string;
  createdAt: string;
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
  runType: "SCHEDULED" | "MANUAL" | "PRE_RESTORE";
  status: "PENDING" | "RUNNING" | "SUCCEEDED" | "PARTIAL_FAILURE" | "FAILED";
  validationStatus: "PENDING" | "PASSED" | "FAILED";
  startedAt: string;
  completedAt: string | null;
}

export interface DeploymentRelease {
  id: string;
  releaseVersion: string;
  gitCommitSha: string;
  buildNumber: string;
  environment: string;
  status: "CREATED" | "APPROVED" | "DEPLOYED" | "ROLLED_BACK" | "FAILED";
  deployedAt?: string;
  approvedBy?: string;
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

export interface DashboardSummary {
  highlights: Array<{ key: string; label: string; value: string; tone: "accent" | "success" | "warning" | "neutral" }>;
  recentPublications: Array<{ id: string; title: string; folderPath: string; updatedAt: string; status: DocumentStatus }>;
  reviewQueue: Array<{ id: string; title: string; updatedAt: string; folderPath: string }>;
  backups: BackupRun[];
  risks: RiskIssue[];
  deployments: DeploymentRelease[];
}

export interface HealthStatus {
  status: "UP" | "DEGRADED" | "DOWN";
  checkedAt: string;
  components: Array<{ name: string; status: "UP" | "DEGRADED" | "DOWN" }>;
}

export interface SoftwareInventoryItem {
  id: string;
  componentName: string;
  componentType: "LIBRARY" | "SERVICE" | "TOOL" | "IMAGE";
  version: string;
  licenseName: string;
  licenseStatus: "APPROVED" | "CONDITIONAL" | "RESTRICTED" | "PROHIBITED";
  vulnerabilitySummary: string;
  riskLevel: "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
  notes?: string;
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
  status: "DRAFT" | "ANALYSIS_REQUIRED" | "READY_FOR_APPROVAL" | "APPROVED" | "IMPLEMENTED";
  requestedAt: string;
  approvedAt?: string;
}
