import { getStore } from '@netlify/blobs'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
}

function safeKey(value: string) {
  return value
    .split('/')
    .map((part) => part.replace(/[^a-zA-Z0-9._-]/g, '-'))
    .join('/')
}

export default async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 204, headers: corsHeaders })
  }

  if (req.method !== 'GET') {
    return Response.json({ error: 'Method not allowed' }, { status: 405, headers: corsHeaders })
  }

  const key = safeKey(new URL(req.url).searchParams.get('key') || '')
  if (!key || !key.includes('/')) {
    return Response.json({ error: 'Missing file key' }, { status: 400, headers: corsHeaders })
  }

  const store = getStore('resume-uploads')
  const result = await store.getWithMetadata(key, { type: 'arrayBuffer' })

  if (!result) {
    return Response.json({ error: 'File not found' }, { status: 404, headers: corsHeaders })
  }

  const name = result.metadata?.name || key.split('/').pop() || 'document'
  const contentType = result.metadata?.contentType || 'application/octet-stream'

  return new Response(result.data as ArrayBuffer, {
    status: 200,
    headers: {
      ...corsHeaders,
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${String(name).replace(/"/g, '')}"`,
      'Cache-Control': 'private, max-age=300',
    },
  })
}

export const config = {
  path: '/api/uploads/download',
}
