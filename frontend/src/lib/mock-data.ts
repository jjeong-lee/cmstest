import { Asset, ContentType, DashboardSummary, EntryDetail, ReviewTask, SessionUser } from "./types";

const now = new Date();
const iso = (offsetMinutes = 0) => new Date(now.getTime() + offsetMinutes * 60_000).toISOString();

export const mockSession: SessionUser = {
  id: "user-editor",
  email: "editor@example.com",
  displayName: "Editorial Team",
  role: "editor",
  workspaceId: "workspace-1",
  token: "editor@example.com",
};

export const mockContentTypes: ContentType[] = [
  {
    id: "type-article",
    code: "article",
    name: "Article",
    description: "뉴스와 운영 공지에 적합한 기본형 콘텐츠",
    fieldSchema: {
      bodyHint: "제목, 리드 문단, 인용문 조합",
      requiredFields: ["title", "slug", "locale", "summary", "body"],
      ctaLabel: "Read more",
    },
    isActive: true,
  },
  {
    id: "type-landing",
    code: "landing_page",
    name: "Landing Page",
    description: "캠페인과 이벤트 페이지",
    fieldSchema: {
      bodyHint: "히어로와 가치 제안 중심",
      requiredFields: ["title", "slug", "locale", "summary", "body"],
      ctaLabel: "Start now",
    },
    isActive: true,
  },
  {
    id: "type-banner",
    code: "promo_banner",
    name: "Promo Banner",
    description: "짧은 프로모션 메시지",
    fieldSchema: {
      bodyHint: "짧은 한두 개의 카피 블록",
      requiredFields: ["title", "slug", "locale", "summary", "body"],
      ctaLabel: "Explore",
    },
    isActive: true,
  },
];

export const mockAssets: Asset[] = [
  {
    id: "asset-hero",
    fileName: "campaign-hero.jpg",
    altText: "Warm studio hero composition",
    thumbnailUrl: "https://images.example.com/asset-hero/thumb.jpg",
    originalUrl: "https://images.example.com/asset-hero/original.jpg",
    dominantColor: "#d66a3d",
    status: "ready",
    width: 1080,
    height: 1440,
    references: [{ id: "entry-1", title: "Summer Studio Launch Update", status: "draft" }],
  },
  {
    id: "asset-grid",
    fileName: "workspace-grid.jpg",
    altText: "Workspace board with pinned cards",
    thumbnailUrl: "https://images.example.com/asset-grid/thumb.jpg",
    originalUrl: "https://images.example.com/asset-grid/original.jpg",
    dominantColor: "#7b6b58",
    status: "ready",
    width: 1080,
    height: 1600,
    references: [{ id: "entry-2", title: "Creator Week Landing", status: "scheduled" }],
  },
  {
    id: "asset-processing",
    fileName: "upcoming-shoot.jpg",
    altText: "Processing upload item",
    thumbnailUrl: "https://images.example.com/asset-processing/thumb.jpg",
    originalUrl: "https://images.example.com/asset-processing/original.jpg",
    dominantColor: "#bcb0a2",
    status: "processing",
    width: 1200,
    height: 1800,
    references: [],
  },
];

export const mockEntries: EntryDetail[] = [
  {
    id: "entry-1",
    contentTypeId: "type-article",
    contentType: mockContentTypes[0],
    title: "Summer Studio Launch Update",
    slug: "summer-studio-launch",
    locale: "ko-KR",
    status: "draft",
    summary: "브랜드 스튜디오 오픈 일정과 준비 현황을 정리한 아티클",
    seoTitle: "Summer Studio Launch",
    seoDescription: "브랜드 스튜디오 오픈 공지",
    representativeAssetId: "asset-hero",
    representativeAsset: mockAssets[0],
    tags: [
      { id: "tag-launch", label: "Launch", slug: "launch" },
      { id: "tag-notice", label: "Notice", slug: "notice" },
    ],
    author: { id: "user-editor", displayName: "Editorial Team", email: "editor@example.com" },
    owner: { id: "user-editor", displayName: "Editorial Team", email: "editor@example.com" },
    revisions: [
      {
        id: "rev-2",
        entryId: "entry-1",
        versionNumber: 2,
        editorId: "user-editor",
        title: "Summer Studio Launch Update",
        summary: "브랜드 스튜디오 오픈 일정과 준비 현황을 정리한 아티클",
        body: [
          { id: "block-1", type: "heading", content: "새로운 스튜디오 오픈 일정" },
          { id: "block-2", type: "paragraph", content: "검수 전 최신 진행 상황을 반영했습니다." },
          { id: "block-3", type: "quote", content: "이미지와 운영 효율을 중심에 둔 설계" },
        ],
        changeNote: "본문 확장 및 요약 갱신",
        createdAt: iso(-90),
      },
      {
        id: "rev-1",
        entryId: "entry-1",
        versionNumber: 1,
        editorId: "user-editor",
        title: "Summer Studio Launch",
        summary: "브랜드 스튜디오 오픈을 알리는 메인 아티클",
        body: [
          { id: "block-0", type: "heading", content: "새로운 스튜디오 오픈" },
          { id: "block-9", type: "paragraph", content: "운영팀이 사용할 신규 CMS 런칭과 함께 공개됩니다." },
        ],
        changeNote: "초기 초안 생성",
        createdAt: iso(-160),
      },
    ],
    reviewTasks: [],
    updatedAt: iso(-90),
  },
  {
    id: "entry-2",
    contentTypeId: "type-landing",
    contentType: mockContentTypes[1],
    title: "Creator Week Landing",
    slug: "creator-week-landing",
    locale: "ko-KR",
    status: "scheduled",
    summary: "크리에이터 위크 캠페인 랜딩 페이지",
    representativeAssetId: "asset-grid",
    representativeAsset: mockAssets[1],
    tags: [
      { id: "tag-launch", label: "Launch", slug: "launch" },
      { id: "tag-design", label: "Design", slug: "design" },
    ],
    author: { id: "user-editor", displayName: "Editorial Team", email: "editor@example.com" },
    owner: { id: "user-publisher", displayName: "Channel Publisher", email: "publisher@example.com" },
    revisions: [
      {
        id: "rev-3",
        entryId: "entry-2",
        versionNumber: 1,
        editorId: "user-editor",
        title: "Creator Week Landing",
        summary: "크리에이터 위크 캠페인 랜딩 페이지",
        body: [
          { id: "block-4", type: "heading", content: "Creator Week" },
          { id: "block-5", type: "paragraph", content: "캠페인 일정과 참여 혜택을 정리한 랜딩 페이지입니다." },
        ],
        changeNote: "랜딩 초안 생성",
        createdAt: iso(-220),
      },
    ],
    reviewTasks: [
      {
        id: "review-1",
        entryId: "entry-2",
        status: "approved",
        submissionNote: "배너 카피 검토 필요",
        decisionNote: "캠페인 문구 승인",
        createdAt: iso(-200),
        updatedAt: iso(-150),
      },
    ],
    publicationSchedule: {
      id: "pub-1",
      publishMode: "scheduled",
      scheduledFor: iso(45),
      status: "pending",
    },
    updatedAt: iso(-150),
  },
  {
    id: "entry-3",
    contentTypeId: "type-banner",
    contentType: mockContentTypes[2],
    title: "Urgent Service Notice",
    slug: "urgent-service-notice",
    locale: "ko-KR",
    status: "in_review",
    summary: "공지 배너용 짧은 메시지 초안",
    tags: [{ id: "tag-notice", label: "Notice", slug: "notice" }],
    author: { id: "user-editor", displayName: "Editorial Team", email: "editor@example.com" },
    owner: { id: "user-editor", displayName: "Editorial Team", email: "editor@example.com" },
    revisions: [
      {
        id: "rev-4",
        entryId: "entry-3",
        versionNumber: 1,
        editorId: "user-editor",
        title: "Urgent Service Notice",
        summary: "공지 배너용 짧은 메시지 초안",
        body: [{ id: "block-6", type: "paragraph", content: "서비스 점검 공지가 필요한 상태입니다." }],
        changeNote: "배너 초안 작성",
        createdAt: iso(-40),
      },
    ],
    reviewTasks: [
      {
        id: "review-2",
        entryId: "entry-3",
        status: "open",
        submissionNote: "오늘 중 검토 필요",
        createdAt: iso(-20),
        updatedAt: iso(-20),
      },
    ],
    updatedAt: iso(-20),
  },
];

export const mockReviewTasks: ReviewTask[] = [
  {
    id: "review-2",
    entryId: "entry-3",
    status: "open",
    submissionNote: "오늘 중 검토 필요",
    createdAt: iso(-20),
    updatedAt: iso(-20),
    entry: mockEntries[2],
    requestedBy: { displayName: "Editorial Team" },
  },
  {
    id: "review-1",
    entryId: "entry-2",
    status: "approved",
    submissionNote: "배너 카피 검토 필요",
    decisionNote: "캠페인 문구 승인",
    createdAt: iso(-200),
    updatedAt: iso(-150),
    entry: mockEntries[1],
    requestedBy: { displayName: "Editorial Team" },
    assignedReviewer: { displayName: "Quality Reviewer" },
  },
];

export const mockDashboardSummary: DashboardSummary = {
  kpis: [
    { key: "reviewQueue", label: "Review Queue", value: 1, trend: "+2 since yesterday" },
    { key: "scheduled", label: "Scheduled", value: 1, trend: "Next wave in 45m" },
    { key: "publishedToday", label: "Published Today", value: 0, trend: "Steady cadence" },
    { key: "failedUploads", label: "Failed Uploads", value: 0, trend: "All clear" },
  ],
  recentEntries: mockEntries.map((entry) => ({
    id: entry.id,
    title: entry.title,
    status: entry.status,
    updatedAt: entry.updatedAt,
    authorName: entry.author.displayName,
    contentType: entry.contentType.code,
    thumbnailUrl: entry.representativeAsset?.thumbnailUrl,
  })),
  upcomingPublications: mockEntries
    .filter((entry) => entry.publicationSchedule?.scheduledFor)
    .map((entry) => ({
      id: entry.id,
      title: entry.title,
      scheduledFor: entry.publicationSchedule!.scheduledFor!,
      status: entry.status,
    })),
  recentAssets: mockAssets.map((asset) => ({
    id: asset.id,
    fileName: asset.fileName,
    thumbnailUrl: asset.thumbnailUrl,
    altText: asset.altText,
  })),
  activity: [
    { id: "activity-1", action: "schedule", actorName: "Channel Publisher", entityLabel: "Creator Week Landing", createdAt: iso(-15) },
    { id: "activity-2", action: "approve", actorName: "Quality Reviewer", entityLabel: "Creator Week Landing", createdAt: iso(-140) },
    { id: "activity-3", action: "submit", actorName: "Editorial Team", entityLabel: "Urgent Service Notice", createdAt: iso(-20) },
  ],
};
