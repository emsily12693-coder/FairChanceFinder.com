import type { Config } from "@netlify/functions";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { jobAnalytics } from "../../db/schema.js";

export default async (req: Request) => {
  if (req.method === "GET") {
    const rows = await db.select().from(jobAnalytics);
    return Response.json(rows.map((row) => ({ ...row, conversionRate: row.impressions ? Math.round((row.applyClicks / row.impressions) * 100) : 0 })));
  }
  if (req.method === "POST") {
    const { jobId, eventType } = await req.json();
    const key = String(jobId);
    const [existing] = await db.select().from(jobAnalytics).where(eq(jobAnalytics.jobId, key));
    const values = {
      jobId: key,
      impressions: existing?.impressions || 0,
      clicks: existing?.clicks || 0,
      applyClicks: existing?.applyClicks || 0,
    };
    if (eventType === "impression") values.impressions += 1;
    if (eventType === "click") values.clicks += 1;
    if (eventType === "apply") values.applyClicks += 1;
    if (existing) {
      const [row] = await db.update(jobAnalytics).set(values).where(eq(jobAnalytics.jobId, key)).returning();
      return Response.json(row);
    }
    const [row] = await db.insert(jobAnalytics).values(values).returning();
    return Response.json(row, { status: 201 });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/analytics" };
