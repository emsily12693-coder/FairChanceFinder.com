import { getStore } from "@netlify/blobs";

export default async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 204, headers: corsHeaders() });
  }

  if (req.method !== "POST") {
    return json({ error: "Method not allowed" }, 405);
  }

  const formData = await req.formData();
  const file = formData.get("file");
  const userId = formData.get("userId");

  if (!file || !userId) {
    return json({ error: "Missing file or userId" }, 400);
  }

  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return json({ error: "File too large. Maximum size is 10 MB." }, 413);
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
    return json({ error: "File type not allowed. Please upload PDF, DOC, DOCX, TXT, JPG, or PNG." }, 400);
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

  return json({
    key: key,
    filename: file.name,
    size: file.size,
    uploadedAt: new Date().toISOString()
  }, 200);
};

function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
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
  path: "/api/upload"
};
