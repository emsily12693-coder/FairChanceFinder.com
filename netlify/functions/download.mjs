import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const key = url.searchParams.get("key");

  if (!key) {
    return new Response(JSON.stringify({ error: "Missing file key" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const store = getStore("resumes");

  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });

  if (!result || !result.data) {
    return new Response(JSON.stringify({ error: "File not found" }), {
      status: 404,
      headers: { "Content-Type": "application/json" }
    });
  }

  const filename = (result.metadata && result.metadata.filename) || "download";
  const contentType = (result.metadata && result.metadata.contentType) || "application/octet-stream";

  return new Response(result.data, {
    status: 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": 'attachment; filename="' + filename + '"',
      "Cache-Control": "private, max-age=3600"
    }
  });
};

export const config = {
  path: "/api/download"
};
