import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" }
    });
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file || !userId) {
    return new Response(JSON.stringify({ error: "Missing file or userId" }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return new Response(JSON.stringify({ error: "File too large. Maximum size is 10 MB." }), {
      status: 413,
      headers: { "Content-Type": "application/json" }
    });
  }

  const ALLOWED_TYPES = [
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/plain",
    "image/jpeg",
    "image/png"
  ];

  if (!ALLOWED_TYPES.includes(file.type)) {
    return new Response(JSON.stringify({ error: "File type not allowed. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG." }), {
      status: 400,
      headers: { "Content-Type": "application/json" }
    });
  }

  const store = getStore("resumes");
  const key = userId + "/" + Date.now() + "-" + file.name.replace(/[^a-zA-Z0-9._-]/g, "_");

  await store.set(key, await file.arrayBuffer(), {
    metadata: {
      filename: file.name,
      contentType: file.type,
      size: String(file.size),
      uploadedAt: new Date().toISOString()
    }
  });

  return new Response(JSON.stringify({
    key: key,
    filename: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString()
  }), {
    status: 200,
    headers: { "Content-Type": "application/json" }
  });
};

export const config = {
  path: "/api/upload"
};
