(() => {
  const renderApiOrigin = "https://arotec-web.onrender.com";
  const passwordKey = "arotec-admin-password";
  const loginForm = document.getElementById("adminLoginForm");
  const loginStatus = document.getElementById("adminLoginStatus");
  const adminPanel = document.getElementById("adminPanel");
  const summary = document.getElementById("adminSummary");
  const tableBody = document.getElementById("membersTableBody");
  const emptyState = document.getElementById("membersEmpty");
  const searchInput = document.getElementById("memberSearch");
  const refreshButton = document.getElementById("refreshMembers");
  const downloadButton = document.getElementById("downloadMembers");
  const logoutButton = document.getElementById("logoutAdmin");
  let members = [];

  function apiUrl(path) {
    if (location.protocol === "file:") return path;
    if (location.hostname.toLowerCase().endsWith("github.io")) {
      return `${renderApiOrigin}${path}`;
    }
    return path;
  }

  function setLoginStatus(message, isError = false) {
    if (!loginStatus) return;
    loginStatus.textContent = message;
    loginStatus.style.color = isError ? "#f5a3c7" : "var(--aqua)";
  }

  function getPassword() {
    return sessionStorage.getItem(passwordKey) || "";
  }

  async function readApiResponse(response) {
    const raw = await response.text();
    if (!raw.trim()) {
      return { ok: response.ok, error: response.ok ? "" : `${response.status} ${response.statusText}`.trim() };
    }
    try {
      return JSON.parse(raw);
    } catch (error) {
      return { ok: false, error: response.ok ? "Invalid JSON" : `${response.status} ${response.statusText}`.trim() };
    }
  }

  function formatDate(value) {
    if (!value) return "-";
    const date = new Date(value);
    if (Number.isNaN(date.getTime())) return value;
    return new Intl.DateTimeFormat("th-TH", {
      dateStyle: "medium",
      timeStyle: "short"
    }).format(date);
  }

  function cell(text) {
    const td = document.createElement("td");
    td.textContent = text || "-";
    return td;
  }

  function matchesSearch(member, query) {
    if (!query) return true;
    const haystack = [
      member.member_code,
      member.full_name,
      member.email,
      member.phone,
      member.preferred_language,
      member.company,
      member.job_title,
      member.wellness_goal
    ].join(" ").toLowerCase();
    return haystack.includes(query);
  }

  function renderMembers() {
    const query = (searchInput?.value || "").trim().toLowerCase();
    const visibleMembers = members.filter((member) => matchesSearch(member, query));
    tableBody.replaceChildren();

    visibleMembers.forEach((member) => {
      const tr = document.createElement("tr");
      tr.append(
        cell(formatDate(member.created_at)),
        cell(member.member_code),
        cell(member.full_name),
        cell(member.email),
        cell(member.phone),
        cell(member.preferred_language),
        cell(member.company),
        cell(member.job_title),
        cell(member.wellness_goal),
        cell(member.marketing_consent ? "Yes" : "No")
      );
      tableBody.appendChild(tr);
    });

    if (summary) {
      summary.textContent = `ทั้งหมด ${members.length} รายการ` + (query ? ` | แสดง ${visibleMembers.length} รายการ` : "");
    }
    if (emptyState) emptyState.hidden = visibleMembers.length > 0;
  }

  async function loadMembers() {
    const password = getPassword();
    if (!password) return;
    if (summary) summary.textContent = "กำลังโหลดข้อมูล...";
    setLoginStatus("");

    try {
      const response = await fetch(apiUrl("/api/admin/members"), {
        headers: { Authorization: `Bearer ${password}` }
      });
      const result = await readApiResponse(response);
      if (!response.ok || !result.ok) {
        if (response.status === 401) sessionStorage.removeItem(passwordKey);
        throw new Error(result.error || "Unable to load members");
      }
      members = Array.isArray(result.members) ? result.members : [];
      if (loginForm) loginForm.hidden = true;
      if (adminPanel) adminPanel.hidden = false;
      renderMembers();
    } catch (error) {
      if (loginForm) loginForm.hidden = false;
      if (adminPanel) adminPanel.hidden = true;
      setLoginStatus(error.message || "Unable to load members", true);
    }
  }

  function downloadCsv() {
    const headers = [
      "created_at",
      "member_code",
      "full_name",
      "email",
      "phone",
      "preferred_language",
      "company",
      "job_title",
      "wellness_goal",
      "marketing_consent"
    ];
    const rows = [headers.join(",")].concat(
      members.map((member) => headers.map((key) => {
        const value = member[key] == null ? "" : String(member[key]);
        return `"${value.replaceAll('"', '""')}"`;
      }).join(","))
    );
    const blob = new Blob([rows.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `arotec-members-${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
    URL.revokeObjectURL(url);
  }

  loginForm?.addEventListener("submit", (event) => {
    event.preventDefault();
    const password = new FormData(loginForm).get("adminPassword");
    sessionStorage.setItem(passwordKey, String(password || ""));
    loadMembers();
  });

  refreshButton?.addEventListener("click", loadMembers);
  downloadButton?.addEventListener("click", downloadCsv);
  searchInput?.addEventListener("input", renderMembers);
  logoutButton?.addEventListener("click", () => {
    sessionStorage.removeItem(passwordKey);
    members = [];
    if (loginForm) loginForm.hidden = false;
    if (adminPanel) adminPanel.hidden = true;
    setLoginStatus("ออกจากระบบแล้ว");
  });

  if (getPassword()) loadMembers();
})();
