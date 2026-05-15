// Compatibility script for older cached pages that still reference /app/main.js.
// The current home page owns its main behavior inline in index.html.

// --- MOCK JOB DATA (temporary, like your old version)
const JOBS = [
  { id: 1, title: "Warehouse Associate", company: "Amazon", location: "Phoenix, AZ", category: "warehouse" },
  { id: 2, title: "Delivery Driver", company: "FedEx", location: "Tempe, AZ", category: "driving" },
  { id: 3, title: "Line Cook", company: "Buffalo Wild Wings", location: "Mesa, AZ", category: "food" },
  { id: 4, title: "Construction Laborer", company: "Turner Construction", location: "Phoenix, AZ", category: "construction" }
];

// --- STATE
let currentCategory = "all";

// --- RENDER JOBS (this fills the screen)
function renderJobs(list) {
  const grid = document.getElementById("jobsGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = "<p style='text-align:center;color:#aaa'>No jobs found</p>";
    return;
  }

  grid.innerHTML = list.map(job => `
    <div style="background:#1a1a2e;padding:16px;border-radius:10px;margin:10px;">
      <h3>${job.title}</h3>
      <p>${job.company} — ${job.location}</p>
    </div>
  `).join("");
}

// --- FILTER
function applyFilter(category) {
  currentCategory = category;

  let filtered = JOBS;

  if (category !== "all") {
    filtered = JOBS.filter(j => j.category === category);
  }

  renderJobs(filtered);
}

// --- BUTTON HANDLING (this replaces onclick)
document.addEventListener("click", (e) => {

  // scroll button
  if (e.target.matches("[data-scroll]")) {
    document.getElementById("jobsGrid")?.scrollIntoView({ behavior: "smooth" });
  }

  // navigation buttons
  if (e.target.matches("[data-link]")) {
    window.location.href = e.target.dataset.link;
  }

  // filter chips
  if (e.target.matches(".filter-chip")) {
    const category = e.target.dataset.category;
    applyFilter(category);
  }

});

// --- SEARCH BUTTON
document.getElementById("searchBtn")?.addEventListener("click", () => {
  const query = document.getElementById("searchInput")?.value.toLowerCase() || "";

  const filtered = JOBS.filter(job =>
    job.title.toLowerCase().includes(query) ||
    job.company.toLowerCase().includes(query)
  );

  renderJobs(filtered);
});

// --- INITIAL LOAD
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", () => renderJobs(JOBS));
} else {
  renderJobs(JOBS);
}
