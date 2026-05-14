import { getStore } from "@netlify/blobs";

export default async (req) => {
  const url = new URL(req.url);
  const userId = url.searchParams.get("userId");

  if (!userId) {
    return new Response(JSON.stringify({ error: "Missing userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  if (req.method === "DELETE") {
    const key = url.searchParams.get("key");
    if (!key) {
      return new Response(JSON.stringify({ error: "Missing file key" }), {
        status: 400,
        headers: { "Content-Type": "application/json" }
      });
    }

    if (!key.startsWith(userId + "/")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" }
      });
    }

    const store = getStore("resumes");
    await store.delete(key);

    return new Response(JSON.stringify({ deleted: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" }
    });
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

  return new Response(JSON.stringify({ files: files }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/api/files"
};
