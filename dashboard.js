const BASE_URL = "https://phi-lab-server.vercel.app/api/v1/lab";

const issuesContainer = document.getElementById("issuesContainer");
const loader = document.getElementById("loader");
const issueCount = document.getElementById("issueCount");
const openCount = document.getElementById("openCount");
const closedCount = document.getElementById("closedCount");
const tabButtons = document.querySelectorAll(".tab-btn");
const searchInput = document.getElementById("searchInput");
const searchBtn = document.getElementById("searchBtn");
const logoutBtn = document.getElementById("logoutBtn");

const issueModal = document.getElementById("issueModal");
const modalContent = document.getElementById("modalContent");
const closeModal = document.getElementById("closeModal");

let allIssues = [];
let currentTab = "all";

// Redirect if not logged in
if (localStorage.getItem("isLoggedIn") !== "true") {
  window.location.href = "index.html";
}

// Add new issue
const addIssueBtn = document.getElementById("addIssueBtn");

addIssueBtn.addEventListener("click", () => {
  alert("Add New Issue feature can be shown as UI only (optional) since assignment does not require POST API.");
});

// Show loader
function showLoader() {
  loader.classList.remove("hidden");
}

// Hide loader
function hideLoader() {
  loader.classList.add("hidden");
}

// Format date
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleString();
}

// Fetch all issues
async function fetchAllIssues() {
  try {
    showLoader();
    issuesContainer.innerHTML = "";

    const res = await fetch(`${BASE_URL}/issues`);
    const data = await res.json();

    allIssues = data.data || [];
    updateCounts();
    renderIssuesByTab(currentTab);
  } catch (error) {
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center text-red-500 font-semibold">
        Failed to load issues.
      </div>
    `;
  } finally {
    hideLoader();
  }
}

// Update counts
function updateCounts() {
  issueCount.textContent = allIssues.length;
  openCount.textContent = allIssues.filter(issue => issue.status === "open").length;
  closedCount.textContent = allIssues.filter(issue => issue.status === "closed").length;
}

// Render issues by tab
function renderIssuesByTab(tab) {
  let filtered = allIssues;

  if (tab === "open") {
    filtered = allIssues.filter(issue => issue.status === "open");
  } else if (tab === "closed") {
    filtered = allIssues.filter(issue => issue.status === "closed");
  }

  issueCount.textContent = filtered.length;
  renderIssues(filtered);
}

// Render issues
function renderIssues(issues) {
  issuesContainer.innerHTML = "";

  if (issues.length === 0) {
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center text-slate-500 font-medium py-10">
        No issues found.
      </div>
    `;
    return;
  }

  issues.forEach(issue => {
    const borderColor = issue.status === "open" ? "#22c55e" : "#a855f7"; // green / purple

    const statusIcon = issue.status === "open" ? "assets/Open-Status.png" : "assets/Closed- Status .png";

    // Priority badge style
    let priorityClass = "bg-gray-100 text-gray-500";
    if (issue.priority?.toLowerCase() === "high") {
      priorityClass = "bg-red-100 text-red-500";
    } else if (issue.priority?.toLowerCase() === "medium") {
      priorityClass = "bg-yellow-100 text-yellow-600";
    } else if (issue.priority?.toLowerCase() === "low") {
      priorityClass = "bg-slate-200 text-slate-500";
    }

    // Label badges
    const labelsHTML = (issue.labels || [])
      .map(label => {
        const lower = label.toLowerCase();

        if (lower === "bug") {
          return `
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-red-300 text-red-500 text-xs font-medium">
              🐞 ${label.toUpperCase()}
            </span>
          `;
        }

        if (lower === "help wanted") {
          return `
            <span class="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-yellow-400 text-yellow-600 text-xs font-medium">
              ⚙️ ${label.toUpperCase()}
            </span>
          `;
        }

        return `
          <span class="inline-flex items-center px-3 py-1 rounded-full border border-slate-300 text-slate-500 text-xs font-medium">
            ${label.toUpperCase()}
          </span>
        `;
      })
      .join("");

    const card = document.createElement("div");
    card.className = "issue-card bg-white rounded-2xl shadow-md border border-slate-200 overflow-hidden";
    card.style.borderTop = `4px solid ${borderColor}`;

    card.innerHTML = `
      <div class="p-5">
        <!-- Top Row -->
        <div class="flex items-center justify-between mb-4">
          <img 
            src="${statusIcon}" 
            alt="${issue.status} status" 
            class="w-8 h-8 object-contain"
          />

          <span class="px-4 py-1 rounded-full text-xs font-bold uppercase ${priorityClass}">
            ${issue.priority || "N/A"}
          </span>
        </div>

        <!-- Title -->
        <h3 class="text-xl font-bold text-slate-800 leading-snug mb-3">
          ${issue.title}
        </h3>

        <!-- Description -->
        <p class="text-slate-500 text-sm leading-6 mb-4 line-clamp-3">
          ${issue.description}
        </p>

        <!-- Labels -->
        <div class="flex flex-wrap gap-2 mb-4">
          ${labelsHTML}
        </div>
      </div>

      <!-- Footer -->
      <div class="border-t border-slate-200 px-5 py-4 bg-slate-50">
        <p class="text-sm text-slate-500 mb-2">#${issue.id} by ${issue.author}</p>
        <p class="text-sm text-slate-500">${new Date(issue.createdAt).toLocaleDateString()}</p>
      </div>
    `;

    card.addEventListener("click", () => openIssueModal(issue.id));
    issuesContainer.appendChild(card);
  });
}

// Open modal with single issue API
async function openIssueModal(id) {
  try {
    showLoader();

    const res = await fetch(`${BASE_URL}/issue/${id}`);
    const data = await res.json();

    const issue = data.data;

    modalContent.innerHTML = `
      <h2 class="text-2xl font-bold text-slate-800 mb-4">${issue.title}</h2>
      <div class="space-y-3 text-slate-700">
        <p><span class="font-semibold">Description:</span> ${issue.description}</p>
        <p><span class="font-semibold">Status:</span> ${issue.status}</p>
        <p><span class="font-semibold">Author:</span> ${issue.author}</p>
        <p><span class="font-semibold">Assignee:</span> ${issue.assignee || "Not assigned"}</p>
        <p><span class="font-semibold">Priority:</span> ${issue.priority}</p>
        <p><span class="font-semibold">Labels:</span> ${issue.labels.join(", ")}</p>
        <p><span class="font-semibold">Created At:</span> ${formatDate(issue.createdAt)}</p>
        <p><span class="font-semibold">Updated At:</span> ${formatDate(issue.updatedAt)}</p>
        <p><span class="font-semibold">Issue ID:</span> ${issue.id}</p>
      </div>
    `;

    issueModal.classList.remove("hidden");
    issueModal.classList.add("flex");
  } catch (error) {
    alert("Failed to load issue details.");
  } finally {
    hideLoader();
  }
}

// Close modal
closeModal.addEventListener("click", () => {
  issueModal.classList.add("hidden");
  issueModal.classList.remove("flex");
});

issueModal.addEventListener("click", (e) => {
  if (e.target === issueModal) {
    issueModal.classList.add("hidden");
    issueModal.classList.remove("flex");
  }
});

// Tabs
tabButtons.forEach(btn => {
  btn.addEventListener("click", () => {
    tabButtons.forEach(b => b.classList.remove("active-tab"));
    btn.classList.add("active-tab");

    currentTab = btn.dataset.tab;
    renderIssuesByTab(currentTab);
  });
});

// Search functionality
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    handleSearch();
  }
});

async function handleSearch() {
  const query = searchInput.value.trim();

  if (!query) {
    renderIssuesByTab(currentTab);
    return;
  }

  try {
    showLoader();
    issuesContainer.innerHTML = "";

    const res = await fetch(`${BASE_URL}/issues/search?q=${encodeURIComponent(query)}`);
    const data = await res.json();

    let searchedIssues = data.data || [];

    if (currentTab === "open") {
      searchedIssues = searchedIssues.filter(issue => issue.status === "open");
    } else if (currentTab === "closed") {
      searchedIssues = searchedIssues.filter(issue => issue.status === "closed");
    }

    issueCount.textContent = searchedIssues.length;
    renderIssues(searchedIssues);
  } catch (error) {
    issuesContainer.innerHTML = `
      <div class="col-span-full text-center text-red-500 font-semibold">
        Search failed.
      </div>
    `;
  } finally {
    hideLoader();
  }
}

// Initial load
fetchAllIssues();