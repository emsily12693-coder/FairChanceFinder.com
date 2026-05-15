import { getStore } from '@netlify/blobs'

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set([
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'application/rtf',
  'text/rtf',
])

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function json(data: unknown, init: ResponseInit = {}) {
  return Response.json(data, {
    ...init,
    headers: {
      ...corsHeaders,
      ...(init.headers || {}),
    },
  })
}

function safeSegment(value: string) {
  return value.replace(/[^a-zA-Z0-9._-]/g, '-').slice(0, 120)
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  const store = getStore('resume-uploads')
  const url = new URL(req.url)

  if (req.method === 'GET') {
    const clientId = safeSegment(url.searchParams.get('clientId') || '')
    if (!clientId) return json({ error: 'Missing clientId' }, { status: 400 })

    const { blobs } = await store.list({ prefix: `${clientId}/` })
    const files = blobs.map((blob) => {
      const key = blob.key
      const name = key.split('/').pop()?.replace(/^[0-9a-f-]+-/, '') || 'document'
      return {
        key,
        name,
        downloadUrl: `/api/uploads/download?key=${encodeURIComponent(key)}`,
      }
    })

    return json({ files })
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, { status: 405 })
  }

  const form = await req.formData()
  const clientId = safeSegment(String(form.get('clientId') || ''))
  const file = form.get('file')

  if (!clientId) return json({ error: 'Missing clientId' }, { status: 400 })
  if (!(file instanceof File)) return json({ error: 'Missing file' }, { status: 400 })
  if (file.size > MAX_FILE_SIZE) return json({ error: 'File exceeds 5 MB limit' }, { status: 413 })
  if (!ALLOWED_TYPES.has(file.type)) return json({ error: 'Unsupported file type' }, { status: 415 })

  const id = crypto.randomUUID()
  const name = safeSegment(file.name || 'document')
  const key = `${clientId}/${id}-${name}`

  await store.set(key, await file.arrayBuffer(), {
    metadata: {
      contentType: file.type,
      name,
    },
  })

  return json({
    key,
    name,
    downloadUrl: `/api/uploads/download?key=${encodeURIComponent(key)}`,
  })
}

export const config = {
  path: '/api/uploads',
}
