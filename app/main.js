var JOBS = [
  {
    id: 1,
    title: "Warehouse Associate",
    company: "Amazon",
    location: "Phoenix, AZ",
    category: "warehouse",
    type: "Full-Time",
    pay: "$17-$21/hr",
    description: "Join Amazon's fulfillment team in Phoenix. Responsibilities include picking, packing, and shipping orders in a fast-paced warehouse environment. No prior experience required.",
    requirements: ["Must be 18+", "Able to lift up to 50 lbs", "Able to stand for full shift", "Background-friendly employer"],
    fairChance: true,
    posted: "2 days ago"
  },
  {
    id: 2,
    title: "Delivery Driver",
    company: "FedEx Ground",
    location: "Tempe, AZ",
    category: "driving",
    type: "Full-Time",
    pay: "$19-$24/hr",
    description: "Deliver packages in the greater Phoenix area. Operate a delivery vehicle along designated routes. FedEx Ground partners with fair-chance hiring initiatives.",
    requirements: ["Valid AZ driver's license", "Clean driving record (2 years)", "Must pass DOT physical", "Background-friendly employer"],
    fairChance: true,
    posted: "3 days ago"
  },
  {
    id: 3,
    title: "Line Cook",
    company: "Buffalo Wild Wings",
    location: "Mesa, AZ",
    category: "food",
    type: "Full-Time",
    pay: "$15-$18/hr",
    description: "Prepare food items according to recipes and standards. Work in a team-oriented kitchen environment. Flexible scheduling with meal discounts.",
    requirements: ["Food handler's card (or willing to obtain)", "Able to work evenings/weekends", "Team player", "Fair-chance employer"],
    fairChance: true,
    posted: "1 day ago"
  },
  {
    id: 4,
    title: "Construction Laborer",
    company: "Turner Construction",
    location: "Phoenix, AZ",
    category: "construction",
    type: "Full-Time",
    pay: "$18-$25/hr",
    description: "Assist with general construction tasks on commercial building projects. Opportunities for skill development and career advancement in the trades.",
    requirements: ["Must be 18+", "Able to work outdoors in heat", "Steel-toe boots required", "Fair-chance employer"],
    fairChance: true,
    posted: "5 days ago"
  },
  {
    id: 5,
    title: "Forklift Operator",
    company: "Sysco",
    location: "Phoenix, AZ",
    category: "warehouse",
    type: "Full-Time",
    pay: "$20-$26/hr",
    description: "Operate forklifts and pallet jacks to move products in a food distribution warehouse. Temperature-controlled environment with consistent schedules.",
    requirements: ["Forklift certification (or willing to train)", "Must be 18+", "Able to work in cooler/freezer", "Background-friendly employer"],
    fairChance: true,
    posted: "1 day ago"
  },
  {
    id: 6,
    title: "HVAC Technician Helper",
    company: "Comfort Systems USA",
    location: "Scottsdale, AZ",
    category: "trades",
    type: "Full-Time",
    pay: "$16-$22/hr",
    description: "Assist licensed HVAC technicians with installation and repair of heating and cooling systems. Great entry point into a high-demand trade.",
    requirements: ["Basic mechanical aptitude", "Able to work in attics and tight spaces", "Valid driver's license", "Fair-chance employer"],
    fairChance: true,
    posted: "4 days ago"
  },
  {
    id: 7,
    title: "Home Health Aide",
    company: "Bayada Home Health Care",
    location: "Phoenix, AZ",
    category: "healthcare",
    type: "Part-Time",
    pay: "$14-$18/hr",
    description: "Provide in-home care and support to elderly and disabled clients. Assist with daily living activities, light housekeeping, and companionship.",
    requirements: ["Must pass state caregiver training", "Reliable transportation", "Compassionate and patient", "Background review (case-by-case)"],
    fairChance: true,
    posted: "3 days ago"
  },
  {
    id: 8,
    title: "Dishwasher / Kitchen Prep",
    company: "Denny's",
    location: "Glendale, AZ",
    category: "food",
    type: "Part-Time",
    pay: "$14-$16/hr",
    description: "Maintain a clean kitchen by washing dishes, utensils, and equipment. Assist with basic food prep. Flexible hours and meal benefits included.",
    requirements: ["Must be 18+", "Able to stand for extended periods", "Team player", "Fair-chance employer"],
    fairChance: true,
    posted: "Today"
  },
  {
    id: 9,
    title: "Roofing Laborer",
    company: "Lyons Roofing",
    location: "Phoenix, AZ",
    category: "construction",
    type: "Full-Time",
    pay: "$17-$23/hr",
    description: "Assist roofing crews with installation, repair, and cleanup on residential and commercial projects across the Valley.",
    requirements: ["Comfortable working at heights", "Able to work in Arizona heat", "Must be 18+", "Fair-chance employer"],
    fairChance: true,
    posted: "2 days ago"
  },
  {
    id: 10,
    title: "CDL-B Truck Driver",
    company: "Republic Services",
    location: "Phoenix, AZ",
    category: "driving",
    type: "Full-Time",
    pay: "$22-$30/hr",
    description: "Drive waste collection vehicles along established routes. Excellent benefits including health insurance and retirement plan.",
    requirements: ["CDL-B license required", "Clean driving record (3 years)", "Able to lift 75 lbs", "Background review (case-by-case)"],
    fairChance: true,
    posted: "1 week ago"
  },
  {
    id: 11,
    title: "Plumber's Apprentice",
    company: "Parker & Sons",
    location: "Tempe, AZ",
    category: "trades",
    type: "Full-Time",
    pay: "$16-$20/hr",
    description: "Learn plumbing under licensed professionals. Work on residential service calls including repairs, installations, and maintenance.",
    requirements: ["Desire to learn a trade", "Valid driver's license", "Able to work in tight spaces", "Fair-chance employer"],
    fairChance: true,
    posted: "3 days ago"
  },
  {
    id: 12,
    title: "Certified Nursing Assistant (CNA)",
    company: "Brookdale Senior Living",
    location: "Mesa, AZ",
    category: "healthcare",
    type: "Full-Time",
    pay: "$16-$20/hr",
    description: "Provide direct care to residents in a senior living community. Assist with bathing, dressing, mobility, and daily activities.",
    requirements: ["Active AZ CNA certification", "CPR/BLS certified", "Compassionate demeanor", "Background review (case-by-case)"],
    fairChance: true,
    posted: "5 days ago"
  }
];

var currentCategory = "all";

function renderJobs(list) {
  var grid = document.getElementById("jobsGrid");

  if (!list.length) {
    grid.innerHTML = "<p style='text-align:center;color:#aaa;padding:40px 20px'>No jobs found. Try adjusting your search or filters.</p>";
    return;
  }

  grid.innerHTML = list.map(function(job) {
    return '<div class="job-card" data-job-id="' + job.id + '" role="button" tabindex="0" aria-label="View details for ' + job.title + ' at ' + job.company + '">' +
      '<div class="job-card-header">' +
        '<h4>' + job.title + '</h4>' +
        '<span class="job-tag fair-chance">Fair Chance</span>' +
      '</div>' +
      '<p class="job-company">' + job.company + '</p>' +
      '<p class="job-location">' + job.location + '</p>' +
      '<div class="job-meta">' +
        '<span class="job-tag">' + job.type + '</span>' +
        '<span class="job-tag">' + job.pay + '</span>' +
        '<span class="job-posted">' + job.posted + '</span>' +
      '</div>' +
      '<button class="apply-btn" data-apply-id="' + job.id + '">Apply Now</button>' +
    '</div>';
  }).join("");
}

function applyFilter(category) {
  currentCategory = category;
  var filtered = JOBS;
  if (category !== "all") {
    filtered = JOBS.filter(function(j) { return j.category === category; });
  }

  document.querySelectorAll(".filter-chip").forEach(function(c) { c.classList.remove("active"); });
  var activeChip = document.querySelector('.filter-chip[data-category="' + category + '"]');
  if (activeChip) activeChip.classList.add("active");

  var title = document.getElementById("sectionTitle");
  if (title) {
    var labels = { all: "Fair-Chance Jobs Near You", construction: "Construction Jobs", driving: "Driving Jobs", food: "Food Service Jobs", warehouse: "Warehouse Jobs", trades: "Trades Jobs", healthcare: "Healthcare Jobs" };
    title.textContent = labels[category] || "Fair-Chance Jobs Near You";
  }

  renderJobs(filtered);
}

function showJobDetail(jobId) {
  var job = JOBS.find(function(j) { return j.id === jobId; });
  if (!job) return;

  var content = document.getElementById("jobModalContent");
  content.innerHTML =
    '<div class="job-detail">' +
      '<span class="job-tag fair-chance" style="margin-bottom:12px;display:inline-block">Fair Chance Employer</span>' +
      '<h2>' + job.title + '</h2>' +
      '<p class="job-detail-company">' + job.company + ' &mdash; ' + job.location + '</p>' +
      '<div class="job-detail-meta">' +
        '<span class="job-tag">' + job.type + '</span>' +
        '<span class="job-tag">' + job.pay + '</span>' +
        '<span class="job-posted">Posted ' + job.posted + '</span>' +
      '</div>' +
      '<div class="job-detail-section">' +
        '<h3>About This Role</h3>' +
        '<p>' + job.description + '</p>' +
      '</div>' +
      '<div class="job-detail-section">' +
        '<h3>Requirements</h3>' +
        '<ul>' + job.requirements.map(function(r) { return '<li>' + r + '</li>'; }).join('') + '</ul>' +
      '</div>' +
      '<div class="job-detail-actions">' +
        '<button class="apply-btn large" data-apply-id="' + job.id + '">Apply Now</button>' +
      '</div>' +
    '</div>';

  document.getElementById("jobModal").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeJobModal() {
  document.getElementById("jobModal").classList.remove("open");
  document.body.style.overflow = "";
}

function applyToJob(jobId) {
  var job = JOBS.find(function(j) { return j.id === jobId; });
  if (!job) return;

  var apps = JSON.parse(localStorage.getItem("fcf_applications") || "[]");
  var already = apps.find(function(a) { return a.id === jobId; });
  if (already) {
    showToast("You've already applied to this job!");
    return;
  }

  apps.push({
    id: job.id,
    title: job.title,
    company: job.company,
    location: job.location,
    type: job.type,
    pay: job.pay,
    appliedAt: new Date().toISOString()
  });

  localStorage.setItem("fcf_applications", JSON.stringify(apps));
  showToast("Application saved! Track it in My Apps.");
  closeJobModal();
}

function showToast(msg) {
  var t = document.getElementById("toast");
  t.textContent = msg;
  t.style.display = "block";
  setTimeout(function() { t.style.display = "none"; }, 3000);
}

document.addEventListener("click", function(e) {
  var target = e.target;

  if (target.matches("[data-scroll]")) {
    document.getElementById("jobsGrid").scrollIntoView({ behavior: "smooth" });
    return;
  }

  if (target.matches("[data-link]")) {
    window.location.href = target.dataset.link;
    return;
  }

  if (target.matches(".filter-chip")) {
    applyFilter(target.dataset.category);
    return;
  }

  if (target.matches(".cat-card") || target.closest(".cat-card")) {
    var card = target.closest(".cat-card") || target;
    var cat = card.dataset.category;
    if (cat) {
      applyFilter(cat);
      document.getElementById("jobsGrid").scrollIntoView({ behavior: "smooth" });
    }
    return;
  }

  if (target.matches("[data-apply-id]")) {
    e.stopPropagation();
    applyToJob(parseInt(target.dataset.applyId));
    return;
  }

  if (target.matches(".job-card") || target.closest(".job-card")) {
    var jobCard = target.closest(".job-card") || target;
    var jobId = parseInt(jobCard.dataset.jobId);
    if (jobId) showJobDetail(jobId);
    return;
  }

  if (target.matches("#closeJobModal") || target.matches(".modal-overlay.open")) {
    if (target.matches(".modal-overlay.open") && !target.querySelector(".modal").contains(e.target === target ? null : e.target)) {
      closeJobModal();
    }
    if (target.matches("#closeJobModal")) {
      closeJobModal();
    }
    return;
  }
});

document.addEventListener("keydown", function(e) {
  if (e.key === "Escape") closeJobModal();
});

document.getElementById("jobModal").addEventListener("click", function(e) {
  if (e.target === this) closeJobModal();
});

document.getElementById("searchBtn").addEventListener("click", function() {
  var query = document.getElementById("searchInput").value.toLowerCase().trim();
  if (!query) { applyFilter("all"); return; }

  var filtered = JOBS.filter(function(job) {
    return job.title.toLowerCase().indexOf(query) !== -1 ||
      job.company.toLowerCase().indexOf(query) !== -1 ||
      job.location.toLowerCase().indexOf(query) !== -1 ||
      job.category.toLowerCase().indexOf(query) !== -1;
  });

  renderJobs(filtered);
});

document.getElementById("searchInput").addEventListener("keydown", function(e) {
  if (e.key === "Enter") document.getElementById("searchBtn").click();
});

renderJobs(JOBS);

if ("serviceWorker" in navigator) {
  navigator.serviceWorker.register("/sw.js").catch(function() {});
}
