import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const allowed = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/rtf", "text/plain"]);

export default async (req: Request) => {
  const store = getStore({ name: "resume-uploads", consistency: "strong" });
  const url = new URL(req.url);
  if (req.method === "GET" && url.searchParams.get("key")) {
    const key = url.searchParams.get("key") || "";
    const file = await store.get(key, { type: "arrayBuffer" });
    if (!file) return new Response("Not found", { status: 404 });
    return new Response(file, { headers: { "content-type": "application/octet-stream", "content-disposition": `attachment; filename="${key.split("/").pop()}"` } });
  }
  if (req.method === "GET") {
    const list = await store.list();
    return Response.json(list.blobs.map((blob) => ({ key: blob.key, name: blob.key.split("/").pop() })));
  }
  if (req.method === "POST") {
    const data = await req.formData();
    const file = data.get("file");
    if (!(file instanceof File)) return new Response("Missing file", { status: 400 });
    if (!allowed.has(file.type)) return new Response("Unsupported file type", { status: 415 });
    if (file.size > 5 * 1024 * 1024) return new Response("File too large", { status: 413 });
    const key = `resumes/${Date.now()}-${file.name.replace(/[^a-z0-9._-]/gi, "_")}`;
    await store.set(key, await file.arrayBuffer());
    return Response.json({ key, name: file.name }, { status: 201 });
  }
  return new Response("Method not allowed", { status: 405 });
};

export const config: Config = { path: "/api/uploads" };
