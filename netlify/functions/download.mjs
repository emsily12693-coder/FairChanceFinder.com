import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "GET") {
    return json({ error: "Method not allowed" }, 405);
  }

  const url = new URL(req.url);
  const key = url.searchParams.get("key");
  const userId = url.searchParams.get("userId");

  if (!key || !userId) {
    return json({ error: "Missing file key or userId" }, 400);
  }

  if (!key.startsWith(userId + "/")) {
    return json({ error: "Unauthorized" }, 403);
  }

  const store = getStore("resumes");

  const result = await store.getWithMetadata(key, { type: "arrayBuffer" });

  if (!result || !result.data) {
    return json({ error: "File not found" }, 404);
  }

  const filename = (result.metadata && result.metadata.filename) || "download";
  const contentType = (result.metadata && result.metadata.contentType) || "application/octet-stream";

  return new Response(result.data, {
    status: 200,
    headers: {
      ...corsHeaders(),
      "Content-Type": contentType,
      "Content-Disposition": 'attachment; filename="' + filename + '"',
      "Cache-Control": "private, max-age=3600"
    }
  });
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type"
  };
}

function json(payload, status) {
  return new Response(JSON.stringify(payload), {
    status,
    headers: {
      ...corsHeaders(),
      "Content-Type": "application/json"
    }
  });
}

export const config = {
  path: "/api/download"
};
