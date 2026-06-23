import { INestApplication } from "@nestjs/common";
import { Test } from "@nestjs/testing";
import request from "supertest";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { AppModule } from "../../src/app.module";

describe("CMS API contract smoke", () => {
  let app: INestApplication;
  let adminToken = "admin@example.com";
  let reviewerToken = "reviewer@example.com";
  let registeredUserToken = "";
  let folderId = "";
  let documentId = "";

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.setGlobalPrefix("api/v1");
    await app.init();
  });

  afterAll(async () => {
    await app?.close();
  });

  it("logs in admin and reviewer demo users", async () => {
    const adminResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "admin@example.com" })
      .expect(200);

    const reviewerResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "reviewer@example.com" })
      .expect(200);

    expect(adminResponse.body.user.role).toBe("ADMIN");
    expect(reviewerResponse.body.user.role).toBe("REVIEWER");
    adminToken = adminResponse.body.token;
    reviewerToken = reviewerResponse.body.token;
  });

  it("registers a user account and logs in with the seeded admin credentials", async () => {
    const signUpResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/signup")
      .send({
        id: "writer01",
        password: "writerpass1234",
        passwordConfirm: "writerpass1234",
        email: "writer01@example.com",
      })
      .expect(201);

    expect(signUpResponse.body.user.email).toBe("writer01@example.com");
    expect(signUpResponse.body.user.role).toBe("USER");

    const adminLoginResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ id: "admin", password: "admin1234" })
      .expect(200);

    expect(adminLoginResponse.body.user.email).toBe("basic@example.com");
    expect(adminLoginResponse.body.user.role).toBe("ADMIN");
    adminToken = adminLoginResponse.body.token;

    const userLoginResponse = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ id: "writer01", password: "writerpass1234" })
      .expect(200);

    expect(userLoginResponse.body.user.email).toBe("writer01@example.com");
    expect(userLoginResponse.body.user.role).toBe("USER");
    registeredUserToken = userLoginResponse.body.token;
  });

  it("rejects protected admin resources for signed-in user accounts without admin role", async () => {
    await request(app.getHttpServer())
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${registeredUserToken}`)
      .expect(403);
  });

  it("returns dashboard summary for authenticated admin users", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/admin/dashboard")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.highlights.length).toBeGreaterThan(0);
  });

  it("creates a folder and document, then approves and publishes it", async () => {
    const folderResponse = await request(app.getHttpServer())
      .post("/api/v1/admin/folders")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({ name: "계약 테스트 폴더", status: "ACTIVE" })
      .expect(201);

    folderId = folderResponse.body.data.id;

    const createDocumentResponse = await request(app.getHttpServer())
      .post("/api/v1/admin/documents")
      .set("Authorization", `Bearer ${adminToken}`)
      .send({
        folderId,
        title: "계약 테스트 문서",
        markdownBody: "# 계약 테스트\n\n포털 검색과 발행 흐름을 확인합니다.",
        visibilityScope: "PUBLIC",
      })
      .expect(201);

    documentId = createDocumentResponse.body.data.id;

    await request(app.getHttpServer())
      .post(`/api/v1/admin/documents/${documentId}/submit-review`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({})
      .expect(200);

    const approveResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/documents/${documentId}/approve`)
      .set("Authorization", `Bearer ${reviewerToken}`)
      .send({ comment: "승인" })
      .expect(200);

    expect(approveResponse.body.data.status).toBe("APPROVED");

    const publishResponse = await request(app.getHttpServer())
      .post(`/api/v1/admin/documents/${documentId}/publish`)
      .set("Authorization", `Bearer ${adminToken}`)
      .send({})
      .expect(200);

    expect(publishResponse.body.data.status).toBe("PUBLISHED");
  });

  it("shows published documents in portal search", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/portal/search")
      .query({ q: "계약" })
      .expect(200);

    expect(response.body.success).toBe(true);
    expect(response.body.data.items.some((item: { documentId: string }) => item.documentId === documentId)).toBe(true);
  });

  it("returns ops health and backup list", async () => {
    const healthResponse = await request(app.getHttpServer()).get("/api/v1/ops/health").expect(200);
    expect(healthResponse.body.status).toMatch(/UP|DEGRADED|DOWN/);

    const backupsResponse = await request(app.getHttpServer())
      .get("/api/v1/admin/backups")
      .set("Authorization", `Bearer ${adminToken}`)
      .expect(200);

    expect(backupsResponse.body.data.length).toBeGreaterThan(0);
  });
});
