import {
  BackupRun,
  ChangeRequest,
  DashboardSummary,
  Deliverable,
  DeploymentRelease,
  DocumentDetail,
  FolderSummary,
  HealthStatus,
  PortalFolderContents,
  ProjectSchedule,
  RiskIssue,
  ScopeItem,
  SearchResult,
  SessionUser,
  SoftwareInventoryItem,
  StaffAssignment,
} from "./types";

const now = new Date();
const iso = (minutes = 0) => new Date(now.getTime() + minutes * 60_000).toISOString();

export const mockSession: SessionUser = {
  id: "user-admin",
  email: "admin@example.com",
  displayName: "콘텐츠 관리자",
  role: "ADMIN",
  workspaceId: "workspace-cms",
  token: "admin@example.com",
};

export const mockRootFolders: FolderSummary[] = [
  { id: "folder-policy", parentId: null, name: "정책", status: "ACTIVE", sortOrder: 10, hasChildren: true, childDocumentCount: 0 },
  { id: "folder-notice", parentId: null, name: "공지", status: "ACTIVE", sortOrder: 20, hasChildren: false, childDocumentCount: 1 },
  { id: "folder-archive", parentId: null, name: "보관함", status: "INACTIVE", sortOrder: 30, hasChildren: false, childDocumentCount: 0 },
];

export const mockDocument: DocumentDetail = {
  id: "doc-checklist",
  folderId: "folder-ops",
  title: "배포 점검 체크리스트",
  slug: "배포-점검-체크리스트",
  summary: "운영 반영 전 확인해야 할 핵심 체크리스트",
  status: "PUBLISHED",
  visibilityScope: "PUBLIC",
  sortOrder: 10,
  updatedAt: iso(-40),
  hasUnpublishedChanges: true,
  markdownBody: "# 배포 점검 체크리스트\n\n- 서비스 상태 확인\n- 로그 확인\n- 백업 이력 점검",
  renderedBody: "<h1>배포 점검 체크리스트</h1><ul><li>서비스 상태 확인</li><li>로그 확인</li><li>백업 이력 점검</li></ul>",
  folderPath: ["정책", "운영 가이드"],
  publishedAt: iso(-120),
  attachments: [
    {
      id: "att-1",
      originalFilename: "checklist.pdf",
      contentType: "application/pdf",
      fileSize: 1280000,
      status: "ACTIVE",
      downloadUrl: "/api/v1/portal/attachments/att-1/download",
    },
  ],
  versions: [
    {
      id: "ver-2",
      documentId: "doc-checklist",
      versionNo: 2,
      title: "배포 점검 체크리스트",
      markdownBody: "# 배포 점검 체크리스트",
      renderedExcerpt: "배포 점검 체크리스트",
      status: "PUBLISHED",
      changeSummary: "발행 반영",
      createdAt: iso(-40),
    },
    {
      id: "ver-1",
      documentId: "doc-checklist",
      versionNo: 1,
      title: "배포 점검 초안",
      markdownBody: "# 배포 점검 초안",
      renderedExcerpt: "배포 점검 초안",
      status: "APPROVED",
      changeSummary: "초안 작성",
      createdAt: iso(-240),
    },
  ],
};

export const mockFolderContents: PortalFolderContents = {
  folder: { id: "folder-ops", parentId: "folder-policy", name: "운영 가이드", status: "ACTIVE", sortOrder: 10, hasChildren: false, childDocumentCount: 1 },
  breadcrumb: [
    { id: "folder-policy", parentId: null, name: "정책", status: "ACTIVE", sortOrder: 10, hasChildren: true, childDocumentCount: 0 },
    { id: "folder-ops", parentId: "folder-policy", name: "운영 가이드", status: "ACTIVE", sortOrder: 10, hasChildren: false, childDocumentCount: 1 },
  ],
  folders: [],
  documents: [mockDocument],
};

export const mockSearchResults: SearchResult[] = [
  {
    documentId: mockDocument.id,
    title: mockDocument.title,
    folderPath: mockDocument.folderPath.join(" / "),
    summary: "배포 점검 체크리스트 서비스 상태 확인 로그 확인 백업 이력 점검",
    updatedAt: mockDocument.updatedAt,
    score: 1,
  },
];

export const mockBackups: BackupRun[] = [
  { id: "backup-1", runType: "MANUAL", status: "SUCCEEDED", validationStatus: "PASSED", startedAt: iso(-70), completedAt: iso(-68) },
  { id: "backup-2", runType: "SCHEDULED", status: "PARTIAL_FAILURE", validationStatus: "FAILED", startedAt: iso(-300), completedAt: iso(-296) },
];

export const mockDeployments: DeploymentRelease[] = [
  {
    id: "dep-1",
    releaseVersion: "2026.06.16-rc1",
    gitCommitSha: "7f2c1d9",
    buildNumber: "build-248",
    environment: "staging",
    status: "DEPLOYED",
    deployedAt: iso(-90),
    approvedBy: "운영 담당자",
  },
];

export const mockRisks: RiskIssue[] = [
  {
    id: "risk-1",
    title: "손상 PDF 업로드 증가",
    cause: "외부 공급 문서 품질 편차",
    impact: "변환 실패 증가",
    owner: "운영 담당자",
    dueDate: "2026-06-22",
    status: "MITIGATING",
  },
];

export const mockDashboardSummary: DashboardSummary = {
  highlights: [
    { key: "published", label: "최근 게시 문서", value: "1", tone: "accent" },
    { key: "review", label: "검토 대기", value: "0", tone: "warning" },
    { key: "backup", label: "최근 백업", value: "SUCCEEDED", tone: "success" },
    { key: "risk", label: "오픈 리스크", value: "1", tone: "neutral" },
  ],
  recentPublications: [
    {
      id: mockDocument.id,
      title: mockDocument.title,
      folderPath: mockDocument.folderPath.join(" / "),
      updatedAt: mockDocument.updatedAt,
      status: mockDocument.status,
    },
  ],
  reviewQueue: [],
  backups: mockBackups,
  risks: mockRisks,
  deployments: mockDeployments,
};

export const mockHealth: HealthStatus = {
  status: "DEGRADED",
  checkedAt: iso(-10),
  components: [
    { name: "application", status: "UP" },
    { name: "postgresql", status: "UP" },
    { name: "object-storage", status: "UP" },
  ],
};

export const mockSoftwareInventory: SoftwareInventoryItem[] = [
  {
    id: "sw-1",
    componentName: "Next.js",
    componentType: "LIBRARY",
    version: "15.0.0",
    licenseName: "MIT",
    licenseStatus: "APPROVED",
    vulnerabilitySummary: "Known issues monitored, no blocking CVE",
    riskLevel: "LOW",
  },
];

export const mockSchedules: ProjectSchedule[] = [
  {
    id: "sch-1",
    name: "1차 운영 전환",
    phase: "전환",
    ownerName: "콘텐츠 관리자",
    plannedStartDate: "2026-06-20",
    plannedEndDate: "2026-06-24",
    status: "AT_RISK",
    mitigationPlan: "백업 검증 자동화 선행",
  },
];

export const mockScopeItems: ScopeItem[] = [
  { id: "scope-1", requirementId: "FR-001", title: "제목/본문 검색", status: "IN_SCOPE" },
  { id: "scope-2", requirementId: "CR-009", title: "외부 PM 도구 연동", status: "OUT_OF_SCOPE", note: "v2 후보" },
];

export const mockStaffAssignments: StaffAssignment[] = [
  { id: "staff-1", role: "ADMIN", assignee: "콘텐츠 관리자", startDate: "2026-06-10", endDate: "2026-07-31", approvalStatus: "APPROVED" },
];

export const mockDeliverables: Deliverable[] = [
  { id: "del-1", name: "운영 가이드", version: "v0.9", dueDate: "2026-06-19", approvalStatus: "PENDING", linkedRequirements: ["FR-025", "FR-032"] },
];

export const mockChangeRequests: ChangeRequest[] = [
  {
    id: "cr-1",
    title: "검색 요약 노출 방식 조정",
    requester: "포털 운영팀",
    impactAnalysis: "UI 밀도 증가, API 변경 없음",
    status: "READY_FOR_APPROVAL",
    requestedAt: iso(-500),
  },
];
