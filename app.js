const STRIPE_PAYMENT_LINK = "https://buy.stripe.com/bJebJ1grZbrVgMY8AFes001";
const CONTACT_PERSONAL = "empickel.93@gmail.com";
const CONTACT_BUSINESS = "EPCSR@fairchancefinder.com";

const state = { jobs: [], user: null };
let identityClient = null;

function uploadOwnerId() {
  let ownerId = localStorage.getItem("fcf_upload_owner");
  if (!ownerId) {
    ownerId = crypto.randomUUID ? crypto.randomUUID() : `${Date.now()}-${Math.random().toString(16).slice(2)}`;
    localStorage.setItem("fcf_upload_owner", ownerId);
  }
  return ownerId;
}

document.addEventListener("DOMContentLoaded", async () => {
  renderShell();
  await hydrateAuth();
  await loadJobs();
  routePage();
});

function basePrefix() {
  return location.pathname.includes("/app/") ? "../" : "";
}

function renderShell() {
  const prefix = basePrefix();
  const header = document.querySelector(".site-header");
  if (header) {
    header.innerHTML = `<div class="container header-inner"><a class="logo" href="${prefix}index.html"><img src="${prefix}assets/logo.svg" alt="FairChanceFinder logo"></a><nav class="main-nav"><a href="${prefix}index.html">Home</a><a href="${prefix}jobs.html">Jobs</a><a href="${prefix}resources.html">Resources</a><a href="${prefix}employers.html">Employers</a><a href="${prefix}about.html">About</a><details class="privacy-menu"><summary>More</summary><a href="${prefix}privacy.html">Privacy Notice</a></details></nav><nav class="portal-nav"><a href="${prefix}employer-login.html">Employer Login</a><a href="${prefix}employer-dashboard.html">Dashboard</a></nav></div>`;
  }
  const footer = document.querySelector(".site-footer");
  if (footer) {
    footer.innerHTML = `<div class="container footer-inner"><strong>FairChanceFinder</strong><span>Contact: <a href="mailto:${CONTACT_BUSINESS}">${CONTACT_BUSINESS}</a> | <a href="mailto:${CONTACT_PERSONAL}">${CONTACT_PERSONAL}</a></span><a href="${prefix}privacy.html">Privacy Notice</a></div>`;
  }
}

async function hydrateAuth() {
  try {
    identityClient = await import("/node_modules/@netlify/identity/dist/main.js");
    await identityClient.handleAuthCallback?.();
    state.user = await identityClient.getUser();
  } catch {
    const stored = localStorage.getItem("fcf_user");
    state.user = stored ? JSON.parse(stored) : null;
  }
  if (document.body.dataset.protected === "true" && !state.user) {
    location.href = "employer-login.html";
  }
}

async function loadJobs() {
  try {
    const local = await fetch(`${basePrefix()}job-data.json`).then((r) => r.json());
    const api = await fetch("/api/jobs").then((r) => (r.ok ? r.json() : [])).catch(() => []);
    state.jobs = [...api, ...local.filter((job) => !api.some((item) => String(item.id) === String(job.id)))];
  } catch {
    state.jobs = [];
  }
}

function routePage() {
  const page = document.body.dataset.page;
  if (page === "home") renderFeaturedJobs();
  if (page === "jobs" || page === "app-jobs") renderJobs();
  if (page === "job" || page === "app-job") renderJobDetail();
  if (page === "employer-login") bindLogin();
  if (page === "employer-register") bindRegister();
  if (page === "employer-dashboard") renderDashboard();
  if (page === "employer-jobs") bindEmployerJobs();
  if (page === "employer-analytics") renderAnalytics();
  if (page === "employer-settings") renderSettings();
  if (page === "app-profile") bindProfile();
  if (page === "app-resume") bindUploads();
}

function jobUrl(job) {
  const id = encodeURIComponent(job.id);
  if (location.pathname.includes("/app/")) return `job.html?id=${id}`;
  return `${basePrefix()}job.html?id=${id}`;
}

function jobCard(job, modal = false) {
  const action = modal ? `data-view-job="${job.id}" href="#"` : `href="${jobUrl(job)}"`;
  return `<a class="job-card" ${action}><span class="tag">${job.type}</span><h3>${job.title}</h3><p class="meta">${job.company} | ${job.location}</p><strong>${job.pay}</strong><p>${job.description}</p></a>`;
}

function renderFeaturedJobs() {
  const target = document.getElementById("featuredJobs");
  if (target) target.innerHTML = state.jobs.slice(0, 3).map((job) => jobCard(job)).join("");
}

function renderJobs() {
  const list = document.getElementById("jobList");
  const search = document.getElementById("jobSearch");
  const type = document.getElementById("jobType");
  const draw = () => {
    const q = (search?.value || "").toLowerCase();
    const t = type?.value || "";
    const jobs = state.jobs.filter((job) => (!t || job.type === t) && `${job.title} ${job.company} ${job.location}`.toLowerCase().includes(q));
    list.innerHTML = jobs.map((job) => jobCard(job, document.body.dataset.page === "jobs")).join("") || "<p>No matching jobs found.</p>";
    document.querySelectorAll("[data-view-job]").forEach((link) => link.addEventListener("click", openJobChoice));
  };
  search?.addEventListener("input", draw);
  type?.addEventListener("change", draw);
  draw();
}

async function openJobChoice(event) {
  event.preventDefault();
  const id = event.currentTarget.dataset.viewJob;
  await track(id, "click");
  const modal = document.getElementById("jobChoiceModal");
  if (!modal) {
    location.href = `job.html?id=${encodeURIComponent(id)}`;
    return;
  }
  modal.innerHTML = `<div class="modal-card"><h2>View this job</h2><a class="btn btn-primary" href="job.html?id=${id}">Continue on Web</a><a class="btn btn-secondary" href="app/job.html?id=${id}">Open App</a><a class="btn btn-outline" href="app/index.html">Download App</a><button class="btn btn-outline" data-close-modal>Close</button></div>`;
  modal.setAttribute("aria-hidden", "false");
  modal.querySelector("[data-close-modal]").addEventListener("click", () => modal.setAttribute("aria-hidden", "true"));
}

async function renderJobDetail() {
  const id = new URLSearchParams(location.search).get("id") || "101";
  const job = state.jobs.find((item) => String(item.id) === String(id));
  if (!job) return;
  await track(id, "impression");
  text("jobTitle", job.title);
  text("jobMeta", `${job.company} | ${job.location} | ${job.pay}`);
  text("jobDescription", job.description);
  list("jobResponsibilities", job.responsibilities || []);
  list("jobQualifications", job.qualifications || []);
  const summary = document.getElementById("jobSummary");
  if (summary) summary.innerHTML = `<p><strong>Company:</strong> ${job.company}</p><p><strong>Location:</strong> ${job.location}</p><p><strong>Type:</strong> ${job.type}</p><p><strong>Pay:</strong> ${job.pay}</p>`;
  const external = document.getElementById("externalApply");
  if (external) {
    if (job.applyUrl) {
      external.href = job.applyUrl;
      external.removeAttribute("aria-disabled");
    } else {
      external.removeAttribute("href");
      external.setAttribute("aria-disabled", "true");
      external.textContent = "Employer site unavailable";
    }
  }
  document.getElementById("platformApply")?.addEventListener("click", async () => {
    await track(id, "apply");
    const applicantName = localStorage.getItem("profileName") || "FairChanceFinder applicant";
    const applicantEmail = localStorage.getItem("profileEmail") || CONTACT_PERSONAL;
    const resumeKey = localStorage.getItem("latestResumeKey") || "";
    const response = await fetch("/api/applications", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ jobId: id, applicantName, applicantEmail, resumeKey }),
    }).catch(() => null);
    alert(response?.ok ? "Application submitted through FairChanceFinder." : "Application could not be submitted. Upload a resume in the app, save your profile, and try again.");
  });
  external?.addEventListener("click", () => track(id, "apply"));
}

function text(id, value) { const el = document.getElementById(id); if (el) el.textContent = value || ""; }
function list(id, items) { const el = document.getElementById(id); if (el) el.innerHTML = items.map((item) => `<li>${item}</li>`).join(""); }
async function track(jobId, eventType) { fetch("/api/analytics", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jobId, eventType }) }).catch(() => {}); }

function bindLogin() {
  document.getElementById("loginForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      state.user = identityClient ? await identityClient.login(data.email, data.password) : null;
      if (!state.user) {
        localStorage.setItem("fcf_user", JSON.stringify({ email: data.email, name: data.email.split("@")[0] }));
      }
      location.href = "employer-dashboard.html";
    } catch (error) {
      text("authMessage", error.message || "Unable to log in.");
    }
  });
}

function bindRegister() {
  document.getElementById("registerForm")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const data = Object.fromEntries(new FormData(event.currentTarget));
    try {
      state.user = identityClient ? await identityClient.signup(data.email, data.password, { full_name: data.name }) : null;
      if (!state.user || !state.user.emailVerified) text("authMessage", "Check your email to confirm your account.");
      if (state.user?.emailVerified) location.href = "employer-dashboard.html";
      if (!identityClient) {
        localStorage.setItem("fcf_user", JSON.stringify({ email: data.email, name: data.name }));
        location.href = "employer-dashboard.html";
      }
    } catch (error) {
      text("authMessage", error.message || "Unable to create account.");
    }
  });
}

function renderDashboard() {
  text("employerWelcome", `Signed in as ${state.user?.email || ""}`);
  fetch("/api/jobs").then((r) => r.json()).then((jobs) => text("dashJobCount", `${jobs.length} active listings`)).catch(() => {});
  fetch("/api/analytics").then((r) => r.json()).then((rows) => text("dashApplyCount", `${rows.reduce((sum, row) => sum + Number(row.applyClicks || 0), 0)} apply clicks`)).catch(() => {});
}

function bindEmployerJobs() {
  const form = document.getElementById("jobForm");
  const draw = async () => {
    const jobs = await fetch("/api/jobs").then((r) => r.json()).catch(() => []);
    document.getElementById("employerJobs").innerHTML = jobs.map((job) => `<article class="job-card"><h3>${job.title}</h3><p>${job.company} | ${job.location}</p><button class="btn btn-outline" data-edit="${job.id}">Edit</button><button class="btn btn-secondary" data-delete="${job.id}">Delete</button></article>`).join("") || "<p>No jobs posted yet.</p>";
    document.querySelectorAll("[data-delete]").forEach((btn) => btn.addEventListener("click", async () => { await fetch(`/api/jobs/${btn.dataset.delete}`, { method: "DELETE" }); draw(); }));
    document.querySelectorAll("[data-edit]").forEach((btn) => btn.addEventListener("click", () => {
      const job = jobs.find((item) => String(item.id) === String(btn.dataset.edit));
      Object.entries(job).forEach(([key, value]) => { if (form.elements[key]) form.elements[key].value = value; });
    }));
  };
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const payload = Object.fromEntries(new FormData(form));
    await fetch(payload.id ? `/api/jobs/${payload.id}` : "/api/jobs", { method: payload.id ? "PUT" : "POST", headers: { "content-type": "application/json" }, body: JSON.stringify(payload) });
    location.href = STRIPE_PAYMENT_LINK;
  });
  draw();
}

function renderAnalytics() {
  fetch("/api/analytics").then((r) => r.json()).then((rows) => {
    document.getElementById("analyticsTable").innerHTML = `<table class="table"><thead><tr><th>Job</th><th>Impressions</th><th>Clicks</th><th>Apply clicks</th><th>Conversion</th></tr></thead><tbody>${rows.map((row) => `<tr><td>${row.jobId}</td><td>${row.impressions}</td><td>${row.clicks}</td><td>${row.applyClicks}</td><td>${row.conversionRate}%</td></tr>`).join("")}</tbody></table>`;
  });
}

function renderSettings() {
  text("settingsEmail", `Signed in as ${state.user?.email || ""}`);
  document.getElementById("logoutButton")?.addEventListener("click", async () => {
    if (identityClient) await identityClient.logout();
    localStorage.removeItem("fcf_user");
    location.href = "employer-login.html";
  });
}

function bindProfile() {
  ["profileName", "profileEmail"].forEach((id) => { const el = document.getElementById(id); if (el) el.value = localStorage.getItem(id) || ""; });
  document.getElementById("saveProfile")?.addEventListener("click", () => { ["profileName", "profileEmail"].forEach((id) => localStorage.setItem(id, document.getElementById(id).value)); alert("Profile saved."); });
}

function bindUploads() {
  const form = document.getElementById("uploadForm");
  const listUploads = async () => {
    const ownerId = uploadOwnerId();
    const files = await fetch(`/api/uploads?ownerId=${encodeURIComponent(ownerId)}`).then((r) => r.json()).catch(() => []);
    document.getElementById("uploadList").innerHTML = files.map((file) => `<a class="job-card" href="/api/uploads?ownerId=${encodeURIComponent(ownerId)}&key=${encodeURIComponent(file.key)}" download>Download ${file.name}</a>`).join("") || "<p>No uploaded resumes yet.</p>";
  };
  form?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const file = document.getElementById("resumeFile").files[0];
    if (!file) return;
    const body = new FormData();
    body.append("file", file);
    body.append("ownerId", uploadOwnerId());
    const uploaded = await fetch("/api/uploads", { method: "POST", body }).then((r) => r.ok ? r.json() : null).catch(() => null);
    if (uploaded?.key) localStorage.setItem("latestResumeKey", uploaded.key);
    listUploads();
  });
  listUploads();
}
