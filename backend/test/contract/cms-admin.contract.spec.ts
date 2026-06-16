import { Test } from "@nestjs/testing";
import request from "supertest";
import { describe, expect, it, beforeAll, afterAll } from "vitest";
import { INestApplication } from "@nestjs/common";
import { AppModule } from "../../src/app.module";

describe("CMS Admin API contract smoke", () => {
  let app: INestApplication;
  let token = "editor@example.com";

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

  it("logs in a demo user", async () => {
    const response = await request(app.getHttpServer())
      .post("/api/v1/auth/login")
      .send({ email: "editor@example.com" })
      .expect(200);

    expect(response.body.user.email).toBe("editor@example.com");
    token = response.body.token;
  });

  it("returns dashboard summary for authenticated users", async () => {
    const response = await request(app.getHttpServer())
      .get("/api/v1/dashboard/summary")
      .set("Authorization", `Bearer ${token}`)
      .expect(200);

    expect(response.body.kpis).toHaveLength(4);
    expect(response.body.recentEntries.length).toBeGreaterThan(0);
  });

  it("creates and submits a new entry", async () => {
    const createResponse = await request(app.getHttpServer())
      .post("/api/v1/entries")
      .set("Authorization", `Bearer ${token}`)
      .send({
        contentTypeId: "type-article",
        title: "Contract Test Entry",
        slug: "contract-test-entry",
        locale: "ko-KR",
        summary: "Contract smoke flow",
        body: [{ id: "body-1", type: "paragraph", content: "Contract smoke body" }],
      })
      .expect(201);

    const entryId = createResponse.body.id;
    expect(entryId).toBeTruthy();

    const submitResponse = await request(app.getHttpServer())
      .post(`/api/v1/entries/${entryId}/submit`)
      .set("Authorization", `Bearer ${token}`)
      .send({ submissionNote: "Please review" })
      .expect(201);

    expect(submitResponse.body.status).toBe("open");
  });
});
