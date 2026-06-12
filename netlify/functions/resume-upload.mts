import type { Context, Config } from '@netlify/functions'
import { getStore } from '@netlify/blobs'

// Accepts a single resume/document upload (multipart/form-data, field name "resume"),
// stores it in the persistent "resumes" Blobs store, and returns a reference the
// client can save alongside a job application and use later to download the file.

const MAX_BYTES = 5 * 1024 * 1024 // 5 MB

const ALLOWED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'text/plain',
  'image/jpeg',
  'image/png',
]

export default async (req: Request, _context: Context) => {
  let form: FormData
  try {
    form = await req.formData()
  } catch {
    return Response.json({ error: 'Expected multipart/form-data.' }, { status: 400 })
  }

  const file = form.get('resume')
  if (!(file instanceof File)) {
    return Response.json({ error: 'Missing resume file.' }, { status: 400 })
  }
  if (file.size === 0) {
    return Response.json({ error: 'The uploaded file is empty.' }, { status: 400 })
  }
  if (file.size > MAX_BYTES) {
    return Response.json({ error: 'File exceeds the 5 MB limit.' }, { status: 413 })
  }

  const contentType = file.type || 'application/octet-stream'
  if (!ALLOWED_TYPES.includes(contentType)) {
    return Response.json(
      { error: 'Unsupported file type. Use PDF, Word, text, JPG, or PNG.' },
      { status: 415 },
    )
  }

  const id = crypto.randomUUID()
  const store = getStore('resumes')
  const buffer = await file.arrayBuffer()
  await store.set(id, buffer, {
    metadata: { contentType, filename: file.name },
  })

  return Response.json({
    id,
    filename: file.name,
    contentType,
    size: file.size,
    url: `/api/resume/${id}`,
  })
}

export const config: Config = {
  path: '/api/resume',
  method: 'POST',
}
