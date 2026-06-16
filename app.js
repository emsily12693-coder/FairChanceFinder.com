const STRIPE_CHECKOUT_URL = 'https://buy.stripe.com/5kQ8wP2B99jN7co049es000';
let jobs = [];

const $ = (selector, scope = document) => scope.querySelector(selector);
const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

function toast(message) {
  const el = document.createElement('div');
  el.className = 'toast';
  el.setAttribute('role', 'status');
  el.textContent = message;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 3200);
}

function getJobId() {
  const params = new URLSearchParams(location.search);
  return params.get('id') || location.pathname.split('/').filter(Boolean).pop();
}

async function loadJobs() {
  if (jobs.length) return jobs;
  const response = await fetch('/job-data.json');
  jobs = await response.json();
  return jobs;
}

function jobCard(job) {
  return `
    <article class="job-card">
      <div class="job-top">
        <div class="company-logo" aria-hidden="true">${job.logo}</div>
        <div>
          <h3>${job.title}</h3>
          <p>${job.company}</p>
        </div>
      </div>
      <p>${job.summary}</p>
      <div class="job-meta">
        <span class="tag">${job.location}</span>
        <span class="tag">${job.type}</span>
        <span class="tag">${job.pay}</span>
      </div>
      <div class="job-actions">
        <a class="btn btn-outline" href="/job.html?id=${encodeURIComponent(job.id)}">Details</a>
        <a class="btn btn-primary" href="${job.applyUrl}" target="_blank" rel="noopener">Apply</a>
      </div>
    </article>
  `;
}

function filterJobs() {
  const grid = $('#jobsGrid');
  if (!grid) return;
  const search = ($('#searchInput')?.value || '').trim().toLowerCase();
  const locationValue = $('#locationFilter')?.value || '';
  const type = $('#typeFilter')?.value || '';
  const filtered = jobs.filter((job) => {
    const haystack = `${job.title} ${job.company} ${job.category} ${job.summary}`.toLowerCase();
    return (!search || haystack.includes(search)) &&
      (!locationValue || job.location === locationValue) &&
      (!type || job.type === type);
  });
  grid.innerHTML = filtered.map(jobCard).join('');
  const empty = $('#noResults');
  if (empty) empty.hidden = filtered.length > 0;
}

async function initJobsPage() {
  if (!$('#jobsGrid')) return;
  await loadJobs();
  filterJobs();
  ['searchInput', 'locationFilter', 'typeFilter'].forEach((id) => {
    document.getElementById(id)?.addEventListener('input', filterJobs);
  });
}

async function initJobDetail() {
  const mount = $('#jobDetail');
  if (!mount) return;
  await loadJobs();
  const job = jobs.find((item) => item.id === getJobId()) || jobs[0];
  document.title = `${job.title} | FairChanceFinder`;
  mount.innerHTML = `
    <div class="detail-layout">
      <article class="panel">
        <p class="eyebrow">${job.company}</p>
        <h1>${job.title}</h1>
        <p class="page-subtitle">${job.location} · ${job.type} · ${job.pay}</p>
        <h2>About the Role</h2>
        <p>${job.description}</p>
        <h2>Requirements</h2>
        <ul>${job.requirements.map((item) => `<li>${item}</li>`).join('')}</ul>
        <h2>Benefits</h2>
        <ul>${job.benefits.map((item) => `<li>${item}</li>`).join('')}</ul>
      </article>
      <aside>
        <div class="panel">
          <div class="company-logo" aria-hidden="true">${job.logo}</div>
          <h2>${job.company}</h2>
          <p>${job.summary}</p>
          <button class="btn btn-primary btn-full" data-open-application="${job.id}">Apply through FairChanceFinder</button>
          <a class="btn btn-outline btn-full" href="${job.applyUrl}" target="_blank" rel="noopener" style="margin-top:10px">Company career page</a>
        </div>
      </aside>
    </div>
  `;
}

function initApplicationModal() {
  const modal = $('#applicationModal');
  if (!modal) return;
  document.addEventListener('click', (event) => {
    const opener = event.target.closest('[data-open-application]');
    if (opener) {
      $('#applicationJobId').value = opener.dataset.openApplication;
      modal.hidden = false;
    }
    if (event.target.matches('[data-close-modal]') || event.target === modal) {
      modal.hidden = true;
    }
  });
  $('#applicationForm')?.addEventListener('submit', (event) => {
    event.preventDefault();
    const application = Object.fromEntries(new FormData(event.currentTarget));
    const saved = JSON.parse(localStorage.getItem('fcf_applications') || '[]');
    saved.unshift({ ...application, submittedAt: new Date().toISOString() });
    localStorage.setItem('fcf_applications', JSON.stringify(saved.slice(0, 20)));
    modal.hidden = true;
    toast('Application saved. Use the company career page for final submission when requested.');
  });
}

function initEmployerForm() {
  const form = $('#employerForm');
  if (!form) return;
  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(form));
    localStorage.setItem('fcf_pending_employer_job', JSON.stringify(data));
    window.location.href = STRIPE_CHECKOUT_URL;
  });
}

function initNavigation() {
  $('.nav-toggle')?.addEventListener('click', () => $('.main-nav')?.classList.toggle('open'));
  const path = location.pathname.split('/').pop() || 'index.html';
  $$('.nav-link').forEach((link) => {
    const href = link.getAttribute('href');
    link.classList.toggle('active', href === path || (path === '' && href === 'index.html'));
  });
}

function initResources() {
  const filters = $$('[data-resource-filter]');
  if (!filters.length) return;
  filters.forEach((button) => {
    button.addEventListener('click', () => {
      const category = button.dataset.resourceFilter;
      filters.forEach((item) => item.classList.toggle('active', item === button));
      $$('[data-resource]').forEach((card) => {
        card.hidden = category !== 'all' && card.dataset.resource !== category;
      });
    });
  });
}

document.addEventListener('DOMContentLoaded', async () => {
  initNavigation();
  initEmployerForm();
  initApplicationModal();
  initResources();
  await initJobsPage();
  await initJobDetail();
});
