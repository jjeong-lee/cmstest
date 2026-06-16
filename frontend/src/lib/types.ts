export type Role = "admin" | "editor" | "reviewer" | "publisher";
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

export interface Asset {
  id: string;
  fileName: string;
  altText: string;
  thumbnailUrl: string;
  originalUrl: string;
  dominantColor?: string;
  status: AssetStatus;
  width: number;
  height: number;
  references?: Array<{ id: string; title: string; status: EntryStatus }>;
}

export interface RevisionBlock {
  id: string;
  type: "heading" | "paragraph" | "quote";
  content: string;
}

export interface EntryRevision {
  id: string;
  entryId: string;
  versionNumber: number;
  editorId: string;
  title: string;
  summary: string;
  body: RevisionBlock[];
  changeNote?: string;
  createdAt: string;
}

export interface EntryDetail {
  id: string;
  contentTypeId: string;
  contentType: ContentType;
  title: string;
  slug: string;
  locale: string;
  status: EntryStatus;
  summary: string;
  seoTitle?: string;
  seoDescription?: string;
  representativeAssetId?: string;
  representativeAsset?: Asset;
  tags: Array<{ id: string; label: string; slug: string }>;
  author: { id: string; displayName: string; email: string };
  owner: { id: string; displayName: string; email: string };
  revisions: EntryRevision[];
  reviewTasks: ReviewTask[];
  publicationSchedule?: PublicationSchedule;
  updatedAt: string;
}

export interface ReviewTask {
  id: string;
  entryId: string;
  status: ReviewStatus;
  submissionNote?: string;
  decisionNote?: string;
  createdAt: string;
  updatedAt: string;
  entry?: EntryDetail;
  requestedBy?: { displayName: string };
  assignedReviewer?: { displayName: string };
}

export interface PublicationSchedule {
  id: string;
  publishMode: "immediate" | "scheduled";
  scheduledFor?: string;
  status: "pending" | "processed" | "failed" | "cancelled";
}

export interface DashboardSummary {
  kpis: Array<{ key: string; label: string; value: number; trend: string }>;
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
    action: string;
    actorName: string;
    entityLabel: string;
    createdAt: string;
  }>;
}
