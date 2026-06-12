import type { Context, Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

// Streams a previously uploaded resume back to the client with its original
// content type and filename. The id is the value returned by /api/resume.

export default async (req: Request, context: Context) => {
  const id = context.params.id
  if (!id) {
    return new Response('Not found.', { status: 404 })
  }

  const store = getStore('resumes')
  const result = await store.getWithMetadata(id, { type: 'arrayBuffer' })
  if (!result || !result.data) {
    return new Response('Resume not found.', { status: 404 })
  }

  const metadata = (result.metadata || {}) as { contentType?: string; filename?: string }
  const contentType = metadata.contentType || 'application/octet-stream'
  const filename = (metadata.filename || `resume-${id}`).replace(/["\r\n]/g, '')

  return new Response(result.data, {
    headers: {
      'Content-Type': contentType,
      'Content-Disposition': `attachment; filename="${filename}"`,
      'Cache-Control': 'private, no-store',
    },
  })
}

export const config: Config = {
  path: '/api/resume/:id',
  method: 'GET',
}
