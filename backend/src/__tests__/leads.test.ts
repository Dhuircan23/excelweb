import { afterAll, beforeEach, describe, expect, it } from "vitest";
import request from "supertest";
import fs from "node:fs";
import path from "node:path";
import { createApp } from "../app.js";
import { prisma } from "../lib/prisma.js";

const validFields = {
  name: "Ana Torres",
  company: "Ferretería Andes",
  email: "ana@andes.cl",
  currentProcess: "Controlamos el inventario en una hoja de Excel compartida.",
};

beforeEach(async () => {
  await prisma.leadFile.deleteMany();
  await prisma.lead.deleteMany();
});

afterAll(async () => {
  await prisma.leadFile.deleteMany();
  await prisma.lead.deleteMany();
  await prisma.$disconnect();
  fs.rmSync(path.resolve("./uploads-test"), { recursive: true, force: true });
});

describe("POST /api/leads", () => {
  it("creates a lead from valid form fields and returns 201", async () => {
    const app = createApp();
    const res = await request(app).post("/api/leads").field(validFields).field("improvementCategories", JSON.stringify(["Inventario"]));

    expect(res.status).toBe(201);
    expect(res.body.id).toBeTruthy();

    const stored = await prisma.lead.findUnique({ where: { id: res.body.id } });
    expect(stored?.email).toBe("ana@andes.cl");
    expect(JSON.parse(stored!.improvementCategories)).toEqual(["Inventario"]);
  });

  it("rejects a submission missing required fields with 400", async () => {
    const app = createApp();
    const res = await request(app).post("/api/leads").field("name", "Ana");

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("VALIDATION_ERROR");
    expect(await prisma.lead.count()).toBe(0);
  });

  it("rejects an invalid email with 400", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/leads")
      .field({ ...validFields, email: "not-an-email" });

    expect(res.status).toBe(400);
  });

  it("accepts an allowed attachment and persists its metadata", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/leads")
      .field(validFields)
      .attach("files", Buffer.from("sku,stock\nSKU-1,10"), { filename: "inventario.csv", contentType: "text/csv" });

    expect(res.status).toBe(201);
    const stored = await prisma.leadFile.findMany({ where: { leadId: res.body.id } });
    expect(stored).toHaveLength(1);
    expect(stored[0]?.originalName).toBe("inventario.csv");
  });

  it("rejects a disallowed file type with 400 and persists nothing", async () => {
    const app = createApp();
    const res = await request(app)
      .post("/api/leads")
      .field(validFields)
      .attach("files", Buffer.from("MZ..."), { filename: "virus.exe", contentType: "application/x-msdownload" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("UNSUPPORTED_FILE_TYPE");
    expect(await prisma.lead.count()).toBe(0);
  });

  it("rejects a file over the size limit with 400", async () => {
    const app = createApp();
    const big = Buffer.alloc(26 * 1024 * 1024, "a"); // 26MB > 25MB limit
    const res = await request(app)
      .post("/api/leads")
      .field(validFields)
      .attach("files", big, { filename: "grande.csv", contentType: "text/csv" });

    expect(res.status).toBe(400);
    expect(res.body.error).toBe("FILE_TOO_LARGE");
  }, 15000);
});

describe("GET /api/health", () => {
  it("returns ok", async () => {
    const app = createApp();
    const res = await request(app).get("/api/health");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ status: "ok" });
  });
});
