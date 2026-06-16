import type { Config } from "@netlify/functions";
import { getStore } from "@netlify/blobs";

const allowed = new Set(["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document", "application/rtf", "text/plain"]);
const headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET,POST,OPTIONS",
  "access-control-allow-headers": "content-type",
};

function cleanOwnerId(value: string | null) {
  return (value || "").replace(/[^a-z0-9._-]/gi, "").slice(0, 80);
}

function cleanName(value: string) {
  return value.replace(/[^a-z0-9._-]/gi, "_").slice(0, 120);
}

export default async (req: Request) => {
  const store = getStore({ name: "resume-uploads", consistency: "strong" });
  const url = new URL(req.url);
  if (req.method === "OPTIONS") return new Response(null, { status: 204, headers });
  if (req.method === "GET" && url.searchParams.get("key")) {
    const ownerId = cleanOwnerId(url.searchParams.get("ownerId"));
    const key = url.searchParams.get("key") || "";
    if (!ownerId || !key.startsWith(`resumes/${ownerId}/`)) return new Response("Not found", { status: 404, headers });
    const result = await store.getWithMetadata(key, { type: "arrayBuffer" });
    if (!result) return new Response("Not found", { status: 404, headers });
    const contentType = String(result.metadata?.contentType || "application/octet-stream");
    const fileName = cleanName(String(result.metadata?.fileName || key.split("/").pop() || "resume"));
    return new Response(result.data, { headers: { ...headers, "content-type": contentType, "content-disposition": `attachment; filename="${fileName}"` } });
  }
  if (req.method === "GET") {
    const ownerId = cleanOwnerId(url.searchParams.get("ownerId"));
    if (!ownerId) return Response.json([], { headers });
    const list = await store.list({ prefix: `resumes/${ownerId}/` });
    return Response.json(list.blobs.map((blob) => ({ key: blob.key, name: blob.key.split("/").pop() })), { headers });
  }
  if (req.method === "POST") {
    const data = await req.formData();
    const ownerId = cleanOwnerId(String(data.get("ownerId") || ""));
    const file = data.get("file");
    if (!ownerId) return new Response("Missing upload owner", { status: 400, headers });
    if (!(file instanceof File)) return new Response("Missing file", { status: 400, headers });
    if (!allowed.has(file.type)) return new Response("Unsupported file type", { status: 415, headers });
    if (file.size > 5 * 1024 * 1024) return new Response("File too large", { status: 413, headers });
    const key = `resumes/${ownerId}/${Date.now()}-${cleanName(file.name)}`;
    await store.set(key, await file.arrayBuffer(), {
      metadata: {
        contentType: file.type,
        fileName: cleanName(file.name),
      },
    });
    return Response.json({ key, name: file.name }, { status: 201, headers });
  }
  return new Response("Method not allowed", { status: 405, headers });
};

export const config: Config = { path: "/api/uploads" };
