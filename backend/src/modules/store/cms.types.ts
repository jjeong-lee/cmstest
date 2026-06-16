export type Role = "admin" | "editor" | "reviewer" | "publisher";
export type UserStatus = "active" | "invited" | "disabled";
export type EntryStatus =
  | "draft"
  | "in_review"
  | "approved"
  | "scheduled"
  | "published"
  | "archived"
  | "rejected";
export type ReviewStatus = "open" | "approved" | "rejected" | "cancelled";
export type AssetStatus = "processing" | "ready" | "failed" | "archived";
export type PublishMode = "immediate" | "scheduled";
export type PublicationStatus = "pending" | "processed" | "failed" | "cancelled";
export type AuditAction =
  | "create"
  | "update"
  | "submit"
  | "approve"
  | "reject"
  | "schedule"
  | "publish"
  | "unpublish"
  | "upload"
  | "archive";

export interface Workspace {
  id: string;
  name: string;
  code: string;
  defaultLocale: string;
  timezone: string;
  createdAt: string;
  updatedAt: string;
}

export interface User {
  id: string;
  workspaceId: string;
  email: string;
  displayName: string;
  role: Role;
  status: UserStatus;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface SessionUser {
  id: string;
  email: string;
  displayName: string;
  role: Role;
  workspaceId: string;
  token: string;
}

export interface ContentType {
  id: string;
  code: "article" | "landing_page" | "promo_banner";
  name: string;
  description: string;
  fieldSchema: {
    bodyHint: string;
    requiredFields: string[];
    ctaLabel?: string;
  };
  isActive: boolean;
}

export interface Tag {
  id: string;
  workspaceId: string;
  label: string;
  slug: string;
  createdAt: string;
}

export interface Asset {
  id: string;
  workspaceId: string;
  uploaderId: string;
  fileName: string;
  mimeType: string;
  width: number;
  height: number;
  fileSize: number;
  originalUrl: string;
  thumbnailUrl: string;
  dominantColor?: string;
  altText: string;
  tagIds: string[];
  status: AssetStatus;
  createdAt: string;
  updatedAt: string;
}

export interface EntryRevision {
  id: string;
  entryId: string;
  versionNumber: number;
  editorId: string;
  title: string;
  summary: string;
  body: Array<{ id: string; type: "heading" | "paragraph" | "quote"; content: string }>;
  seoTitle?: string;
  seoDescription?: string;
  selectedAssetIds: string[];
  changeNote?: string;
  createdAt: string;
}

export interface ContentEntry {
  id: string;
  workspaceId: string;
  contentTypeId: string;
  currentRevisionId?: string;
  publishedRevisionId?: string;
  authorId: string;
  ownerId: string;
  title: string;
  slug: string;
  locale: string;
  status: EntryStatus;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  representativeAssetId?: string;
  tagIds: string[];
  submittedAt?: string;
  approvedAt?: string;
  publishedAt?: string;
  archivedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ReviewTask {
  id: string;
  entryId: string;
  requestedById: string;
  assignedReviewerId?: string;
  status: ReviewStatus;
  submissionNote?: string;
  decisionNote?: string;
  decidedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PublicationSchedule {
  id: string;
  entryId: string;
  targetRevisionId: string;
  publishMode: PublishMode;
  scheduledFor?: string;
  executedAt?: string;
  status: PublicationStatus;
  createdById: string;
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuditEvent {
  id: string;
  workspaceId: string;
  actorId: string;
  entityType: "ContentEntry" | "EntryRevision" | "ReviewTask" | "Asset" | "PublicationSchedule";
  entityId: string;
  action: AuditAction;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface EntryFilters {
  status?: EntryStatus;
  contentType?: ContentType["code"];
  authorId?: string;
  tag?: string;
  locale?: string;
  q?: string;
}

export interface DashboardSummary {
  kpis: Array<{
    key: string;
    label: string;
    value: number;
    trend: string;
  }>;
  recentEntries: Array<{
    id: string;
    title: string;
    status: EntryStatus;
    updatedAt: string;
    authorName: string;
    contentType: string;
    thumbnailUrl?: string;
  }>;
  upcomingPublications: Array<{
    id: string;
    title: string;
    scheduledFor: string;
    status: EntryStatus;
  }>;
  recentAssets: Array<{
    id: string;
    fileName: string;
    thumbnailUrl: string;
    altText: string;
  }>;
  activity: Array<{
    id: string;
    action: AuditAction;
    actorName: string;
    entityLabel: string;
    createdAt: string;
  }>;
}
