import { getStore } from '@netlify/blobs';

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const ALLOWED_TYPES = new Map([
  ['application/pdf', 'pdf'],
  ['application/msword', 'doc'],
  ['application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'docx'],
  ['text/plain', 'txt'],
  ['application/rtf', 'rtf'],
  ['text/rtf', 'rtf']
]);

const json = (body, status = 200) =>
  new Response(JSON.stringify(body), {
    status,
    headers: {
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'GET,POST,OPTIONS',
      'access-control-allow-headers': 'content-type'
    }
  });

const corsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET,POST,OPTIONS',
  'access-control-allow-headers': 'content-type'
};

const clean = (value) => String(value || '').replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120);

export default async (request) => {
  if (request.method === 'OPTIONS') return json({});

  const url = new URL(request.url);
  const store = getStore({ name: 'resume-uploads', consistency: 'strong' });
  const indexStore = getStore({ name: 'resume-upload-index', consistency: 'strong' });

  if (request.method === 'GET') {
    const key = url.searchParams.get('key');
    if (key) {
      const clientId = clean(url.searchParams.get('clientId'));
      if (!clientId || !key.startsWith(`clients/${clientId}/`)) return json({ error: 'File not found' }, 404);

      const file = await store.get(key, { type: 'blob' });
      if (!file) return json({ error: 'File not found' }, 404);

      const filename = clean(url.searchParams.get('filename')) || 'resume';
      return new Response(file.stream(), {
        headers: {
          'content-type': file.type || 'application/octet-stream',
          'content-disposition': `attachment; filename="${filename}"`,
          'cache-control': 'private, max-age=0',
          ...corsHeaders
        }
      });
    }

    const clientId = clean(url.searchParams.get('clientId'));
    if (!clientId) return json({ error: 'Missing clientId' }, 400);

    const files = ((await indexStore.get(`clients/${clientId}.json`, { type: 'json' })) || []).map((file) => ({
      ...file,
      downloadUrl: `/api/uploads?clientId=${encodeURIComponent(clientId)}&key=${encodeURIComponent(file.key)}&filename=${encodeURIComponent(file.name)}`
    }));
    return json({ files });
  }

  if (request.method !== 'POST') return json({ error: 'Method not allowed' }, 405);

  const form = await request.formData();
  const clientId = clean(form.get('clientId'));
  const file = form.get('file');

  if (!clientId) return json({ error: 'Missing clientId' }, 400);
  if (!file || typeof file.arrayBuffer !== 'function') return json({ error: 'Missing file' }, 400);
  if (file.size > MAX_FILE_SIZE) return json({ error: 'Files must be 5 MB or smaller' }, 413);
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: 'Upload a PDF, Word document, RTF, or text file' }, 415);

  const originalName = clean(file.name || `resume.${ALLOWED_TYPES.get(file.type)}`);
  const key = `clients/${clientId}/${Date.now()}-${originalName}`;
  await store.set(key, file);

  const existing = (await indexStore.get(`clients/${clientId}.json`, { type: 'json' })) || [];
  const record = {
    key,
    name: originalName,
    size: file.size,
    type: file.type,
    uploadedAt: new Date().toISOString(),
    downloadUrl: `/api/uploads?clientId=${encodeURIComponent(clientId)}&key=${encodeURIComponent(key)}&filename=${encodeURIComponent(originalName)}`
  };
  await indexStore.setJSON(`clients/${clientId}.json`, [record, ...existing].slice(0, 12));

  return json({ file: record }, 201);
};
