import type { Config } from "@netlify/functions";
import { getUser } from "@netlify/identity";
import { eq } from "drizzle-orm";
import { db } from "../../db/index.js";
import { jobs } from "../../db/schema.js";

export default async (req: Request, context: any) => {
  const id = context.params?.id;
  if (req.method === "GET") {
    return Response.json(await db.select().from(jobs));
  }
  const user = await getUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  if (req.method === "POST") {
    const body = await req.json();
    const [job] = await db.insert(jobs).values(normalize(body)).returning();
    return Response.json(job, { status: 201 });
  }
  if (req.method === "PUT" && id) {
    const body = await req.json();
    const [job] = await db.update(jobs).set(normalize(body)).where(eq(jobs.id, Number(id))).returning();
    return Response.json(job);
  }
  if (req.method === "DELETE" && id) {
    await db.delete(jobs).where(eq(jobs.id, Number(id)));
    return new Response(null, { status: 204 });
  }
  return new Response("Method not allowed", { status: 405 });
};

function normalize(body: any) {
  return {
    title: body.title,
    company: body.company,
    location: body.location,
    type: body.type,
    pay: body.pay,
    description: body.description,
    applyUrl: body.applyUrl,
    responsibilities: body.responsibilities || [],
    qualifications: body.qualifications || [],
  };
}

export const config: Config = { path: ["/api/jobs", "/api/jobs/:id"] };
