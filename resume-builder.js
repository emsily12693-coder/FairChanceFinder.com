const resumeFields = ['fullName', 'headline', 'city', 'phone', 'email', 'summary', 'skills', 'experience', 'education'];
const clientIdKey = 'fcf_client_id';

function ensureClientId() {
  let id = localStorage.getItem(clientIdKey);
  if (!id) {
    id = crypto.randomUUID ? crypto.randomUUID() : `client-${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem(clientIdKey, id);
  }
  return id;
}

function buildResumeText() {
  const data = Object.fromEntries(resumeFields.map((id) => [id, document.getElementById(id)?.value.trim() || '']));
  return `${data.fullName || 'Your Name'}
${data.headline || 'Reliable fair-chance candidate'} · ${data.city || 'Phoenix Valley'}
${data.phone || ''} ${data.email || ''}

SUMMARY
${data.summary || 'Dependable worker with strong attendance, a team mindset, and readiness to contribute.'}

SKILLS
${data.skills || 'Customer service, warehouse safety, communication, reliability'}

EXPERIENCE
${data.experience || 'Add recent work, volunteer, training, or program experience here.'}

EDUCATION AND TRAINING
${data.education || 'Add GED, high school, certifications, or training programs here.'}
`;
}

function updatePreview() {
  const preview = document.getElementById('resumePreview');
  if (preview) preview.textContent = buildResumeText();
}

function downloadResume() {
  const blob = new Blob([buildResumeText()], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'fairchancefinder-resume.txt';
  link.click();
  URL.revokeObjectURL(url);
}

async function loadUploads() {
  const list = document.getElementById('uploadedFiles');
  if (!list) return;
  const response = await fetch(`/api/uploads?clientId=${encodeURIComponent(ensureClientId())}`);
  const data = await response.json();
  list.innerHTML = (data.files || []).map((file) => `<div class="file-row"><span>${file.name}</span><a class="btn btn-outline" href="${file.downloadUrl}">Download</a></div>`).join('') || '<p class="footer-text">No uploaded files yet.</p>';
}

async function uploadResume(event) {
  event.preventDefault();
  const input = document.getElementById('resumeFile');
  if (!input?.files?.[0]) return;
  const form = new FormData();
  form.append('clientId', ensureClientId());
  form.append('file', input.files[0]);
  const response = await fetch('/api/uploads', { method: 'POST', body: form });
  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: 'Upload failed' }));
    alert(error.error || 'Upload failed');
    return;
  }
  input.value = '';
  await loadUploads();
}

document.addEventListener('DOMContentLoaded', () => {
  resumeFields.forEach((id) => document.getElementById(id)?.addEventListener('input', updatePreview));
  document.getElementById('downloadResume')?.addEventListener('click', downloadResume);
  document.getElementById('uploadForm')?.addEventListener('submit', uploadResume);
  updatePreview();
  loadUploads();
});
