var CATEGORY_ICONS = {
  warehouse: "&#128230;",
  driving: "&#128667;",
  food: "&#127869;",
  construction: "&#127959;",
  trades: "&#128295;",
  healthcare: "&#127973;"
};

var currentCategory = "all";

function renderJobs(list) {
  var grid = document.getElementById("jobsGrid");
  if (!grid) return;

  if (!list.length) {
    grid.innerHTML = '<p style="text-align:center;color:#aaa;padding:40px 0">No jobs found. Try a different search or category.</p>';
    return;
  }

  grid.innerHTML = list.map(function(job) {
    return '<a href="/job-detail.html?id=' + job.id + '" class="job-card">' +
      '<div class="job-card-header">' +
        '<span class="job-icon">' + (CATEGORY_ICONS[job.category] || '') + '</span>' +
        '<span class="fair-chance-badge">Fair Chance</span>' +
      '</div>' +
      '<h4 class="job-title">' + job.title + '</h4>' +
      '<p class="job-company">' + job.company + '</p>' +
      '<p class="job-location">' + job.location + '</p>' +
      '<div class="job-tags">' +
        '<span class="job-tag">' + job.type + '</span>' +
        '<span class="job-tag pay-tag">' + job.pay + '</span>' +
      '</div>' +
      '<span class="job-card-cta">View Details &rarr;</span>' +
    '</a>';
  }).join("");
}

function applyFilter(category) {
  currentCategory = category;
  var filtered = JOBS;
  if (category !== "all") {
    filtered = JOBS.filter(function(j) { return j.category === category; });
  }
  renderJobs(filtered);

  document.querySelectorAll(".filter-chip").forEach(function(c) {
    c.classList.toggle("active", c.dataset.category === category);
  });
}

document.addEventListener("click", function(e) {
  var target = e.target;

  if (target.matches("[data-scroll]")) {
    e.preventDefault();
    document.getElementById("jobsGrid").scrollIntoView({ behavior: "smooth" });
  }

  if (target.matches("[data-link]")) {
    e.preventDefault();
    window.location.href = target.dataset.link;
  }

  if (target.matches(".filter-chip")) {
    applyFilter(target.dataset.category);
  }

  var catCard = target.closest(".cat-card");
  if (catCard) {
    var cat = catCard.dataset.category;
    applyFilter(cat);
    document.getElementById("jobsGrid").scrollIntoView({ behavior: "smooth" });
  }
});

var searchBtn = document.getElementById("searchBtn");
var searchInput = document.getElementById("searchInput");

if (searchBtn) {
  searchBtn.addEventListener("click", function() {
    var query = searchInput.value.toLowerCase().trim();
    if (!query) {
      applyFilter(currentCategory);
      return;
    }
    var filtered = JOBS.filter(function(job) {
      return job.title.toLowerCase().indexOf(query) !== -1 ||
             job.company.toLowerCase().indexOf(query) !== -1 ||
             job.location.toLowerCase().indexOf(query) !== -1 ||
             job.category.toLowerCase().indexOf(query) !== -1;
    });
    renderJobs(filtered);
  });
}

if (searchInput) {
  searchInput.addEventListener("keydown", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchBtn.click();
    }
  });
}

renderJobs(JOBS);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').catch(function() {});
}
