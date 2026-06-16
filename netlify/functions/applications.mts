import type { Config } from "@netlify/functions";
import { db } from "../../db/index.js";
import { applications } from "../../db/schema.js";

const headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

export default async (req: Request) => {
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });

  if (req.method === "GET") {
    return Response.json(await db.select().from(applications), { headers });
  }

  if (req.method === "POST") {
    const body = await req.json();
    const applicantName = String(body.applicantName || "").trim();
    const applicantEmail = String(body.applicantEmail || "").trim();
    const jobId = String(body.jobId || "").trim();
    const resumeKey = body.resumeKey ? String(body.resumeKey) : null;

    if (!jobId || !applicantName || !applicantEmail) {
      return new Response("Missing required application details", { status: 400, headers });
    }

    const [application] = await db.insert(applications).values({
      jobId,
      applicantName,
      applicantEmail,
      resumeKey,
    }).returning();

    return Response.json(application, { status: 201, headers });
  }

  return new Response("Method not allowed", { status: 405, headers });
};

export const config: Config = { path: "/api/applications" };
