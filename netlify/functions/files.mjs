import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "GET" && req.method !== "DELETE") {
    return json({ error: "Method not allowed" }, 405);
  }

  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return json({ error: "Missing userId" }, 400);
  }

  if (req.method === "DELETE") {
    const key = url.searchParams.get("key");
    if (!key) {
      return json({ error: "Missing file key" }, 400);
    }

    if (!key.startsWith(userId + "/")) {
      return json({ error: "Unauthorized" }, 403);
    }

    const store = getStore("resumes");
    await store.delete(key);

    return json({ deleted: true }, 200);
  }

  const store = getStore("resumes");
  const result = await store.list({ prefix: userId + "/" });

  var files = [];
  if (result && result.blobs) {
    for (var i = 0; i < result.blobs.length; i++) {
      var blob = result.blobs[i];
      var meta = await store.getMetadata(blob.key);
      files.push({
        key: blob.key,
        filename: (meta && meta.metadata && meta.metadata.filename) || blob.key.split("/").pop(),
        contentType: meta && meta.metadata && meta.metadata.contentType,
        size: meta && meta.metadata && meta.metadata.size,
        uploadedAt: meta && meta.metadata && meta.metadata.uploadedAt
      });
    }
  }

  return json({ files: files }, 200);
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, DELETE, OPTIONS",
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
  path: "/api/files"
};
