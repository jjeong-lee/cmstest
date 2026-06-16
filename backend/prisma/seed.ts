import { PrismaClient, Role } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const workspace = await prisma.workspace.upsert({
    where: { code: "northstar" },
    update: {},
    create: {
      code: "northstar",
      name: "Northstar CMS",
      defaultLocale: "ko-KR",
      timezone: "Asia/Seoul",
    },
  });

  const users = [
    ["admin@example.com", "Platform Admin", Role.admin],
    ["editor@example.com", "Editorial Team", Role.editor],
    ["reviewer@example.com", "Quality Reviewer", Role.reviewer],
    ["publisher@example.com", "Channel Publisher", Role.publisher],
  ] as const;

  for (const [email, displayName, role] of users) {
    await prisma.user.upsert({
      where: { workspaceId_email: { workspaceId: workspace.id, email } },
      update: { displayName, role, status: "active" },
      create: {
        workspaceId: workspace.id,
        email,
        displayName,
        role,
        status: "active",
      },
    });
  }

  const contentTypes = [
    {
      code: "article",
      name: "Article",
      description: "뉴스 및 블로그 아티클",
      fieldSchema: {
        requiredFields: ["title", "slug", "locale", "summary", "body"],
        bodyHint: "Heading + paragraph blocks",
      },
    },
    {
      code: "landing_page",
      name: "Landing Page",
      description: "캠페인 랜딩 페이지",
      fieldSchema: {
        requiredFields: ["title", "slug", "locale", "summary", "body"],
        bodyHint: "Hero + value proposition blocks",
      },
    },
    {
      code: "promo_banner",
      name: "Promo Banner",
      description: "프로모션 배너",
      fieldSchema: {
        requiredFields: ["title", "slug", "locale", "summary", "body"],
        bodyHint: "Short form promo block",
      },
    },
  ];

  for (const contentType of contentTypes) {
    await prisma.contentType.upsert({
      where: { code: contentType.code },
      update: contentType,
      create: contentType,
    });
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
