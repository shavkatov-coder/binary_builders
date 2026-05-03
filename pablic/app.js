const app = document.querySelector("#app");
const toastEl = document.querySelector("#toast");

const state = {
  token: localStorage.getItem("bb_token") || "",
  theme: localStorage.getItem("bb_theme") || "dark",
  language: localStorage.getItem("bb_lang") || "uz",
  user: null,
  dashboard: null,
  courses: [],
  stats: null,
  view: "dashboard",
  authMode: "login",
  roleDraft: "student",
  avatarDraft: "",
  profileAvatarDraft: "",
  selectedCourseId: "",
  selectedClassroomId: "",
  classroomTab: "announcements",
  courseQuery: "",
  lessonQuery: "",
  assistantOpen: false,
  assistantMessages: [
    { from: "ai", text: "Salom. Bugun nimani o'rganamiz? Kurs, test yoki classroom bo'yicha yordam bera olaman." }
  ],
  meeting: {
    camera: true,
    mic: true,
    screen: false,
    hand: false
  },
  sidebarOpen: false
};

document.body.dataset.theme = state.theme;

const copy = {
  uz: {
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    courses: "Kurslar",
    classroom: "Classroom",
    creator: "Creator Studio",
    live: "Live dars",
    certificates: "Sertifikatlar",
    profile: "Profil",
    logout: "Chiqish",
    start: "Boshlash",
    demo: "Demo kirish",
    theme: "Rejim",
    search: "Qidirish",
    join: "Join",
    create: "Yaratish",
    save: "Saqlash"
  },
  en: {
    login: "Login",
    signup: "Sign Up",
    dashboard: "Dashboard",
    courses: "Courses",
    classroom: "Classroom",
    creator: "Creator Studio",
    live: "Live lesson",
    certificates: "Certificates",
    profile: "Profile",
    logout: "Log out",
    start: "Start",
    demo: "Demo login",
    theme: "Theme",
    search: "Search",
    join: "Join",
    create: "Create",
    save: "Save"
  },
  ru: {
    login: "Вход",
    signup: "Регистрация",
    dashboard: "Панель",
    courses: "Курсы",
    classroom: "Класс",
    creator: "Студия",
    live: "Онлайн урок",
    certificates: "Сертификаты",
    profile: "Профиль",
    logout: "Выйти",
    start: "Начать",
    demo: "Демо вход",
    theme: "Тема",
    search: "Поиск",
    join: "Войти",
    create: "Создать",
    save: "Сохранить"
  }
};

const iconPaths = {
  menu: "M4 6h16M4 12h16M4 18h16",
  x: "M18 6 6 18M6 6l12 12",
  moon: "M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z",
  sun: "M12 2v2m0 16v2m10-10h-2M4 12H2m15.1-7.1-1.4 1.4M8.3 17.7l-1.4 1.4m12.2 0-1.4-1.4M8.3 6.3 6.9 4.9M12 8a4 4 0 1 0 0 8 4 4 0 0 0 0-8Z",
  user: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  book: "M4 19.5A2.5 2.5 0 0 1 6.5 17H20M4 4.5A2.5 2.5 0 0 1 6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15Z",
  home: "m3 11 9-8 9 8v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V11Z",
  class: "M4 5h16v12H4zM8 21h8M12 17v4",
  live: "M23 7l-7 5 7 5V7ZM1 5h15v14H1z",
  trophy: "M8 21h8M12 17v4M7 4h10v5a5 5 0 0 1-10 0V4Zm0 2H4a3 3 0 0 0 3 3m10-3h3a3 3 0 0 1-3 3",
  spark: "M12 2l1.8 6.2L20 10l-6.2 1.8L12 18l-1.8-6.2L4 10l6.2-1.8L12 2Zm7 13 1 3 3 1-3 1-1 3-1-3-3-1 3-1 1-3Z",
  bell: "M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9M13.7 21a2 2 0 0 1-3.4 0",
  chat: "M21 15a4 4 0 0 1-4 4H8l-5 3V7a4 4 0 0 1 4-4h10a4 4 0 0 1 4 4v8Z",
  plus: "M12 5v14M5 12h14",
  play: "m8 5 11 7-11 7V5Z",
  search: "m21 21-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z",
  upload: "M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12",
  chart: "M3 3v18h18M8 17V9m5 8V5m5 12v-6",
  shield: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z",
  check: "M20 6 9 17l-5-5",
  mic: "M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3ZM5 10v2a7 7 0 0 0 14 0v-2M12 19v3",
  camera: "M23 7l-7 5 7 5V7ZM1 5h15v14H1z",
  screen: "M3 4h18v12H3zM8 20h8M12 16v4",
  hand: "M18 11V7a2 2 0 0 0-4 0v4M14 10V5a2 2 0 0 0-4 0v7M10 11V6a2 2 0 0 0-4 0v8l-1-1a2 2 0 1 0-3 3l5 5h8a5 5 0 0 0 5-5v-5a2 2 0 0 0-4 0Z"
};

function t(key) {
  return copy[state.language]?.[key] || copy.uz[key] || key;
}

function icon(name) {
  return `<svg class="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="${iconPaths[name] || iconPaths.spark}"></path></svg>`;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function initials(name) {
  return String(name || "BB")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

function avatar(user, extraClass = "") {
  if (user?.avatar) {
    return `<span class="avatar ${extraClass}"><img src="${escapeHtml(user.avatar)}" alt="${escapeHtml(user.name)}" /></span>`;
  }
  return `<span class="avatar ${extraClass}">${escapeHtml(initials(user?.name))}</span>`;
}

function toast(message) {
  toastEl.textContent = message;
  toastEl.classList.add("show");
  window.clearTimeout(toast.timer);
  toast.timer = window.setTimeout(() => toastEl.classList.remove("show"), 3000);
}

async function api(path, options = {}) {
  const response = await fetch(path, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(state.token ? { Authorization: `Bearer ${state.token}` } : {}),
      ...(options.headers || {})
    }
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Xatolik yuz berdi");
  return data;
}

async function init() {
  try {
    const bootstrap = await api("/api/bootstrap");
    state.courses = bootstrap.courses || [];
    state.stats = bootstrap.stats || null;
    if (state.token) {
      const dashboard = await api("/api/me");
      applyDashboard(dashboard);
    }
  } catch (error) {
    toast(error.message);
  }
  render();
}

function applyDashboard(data) {
  state.dashboard = data.dashboard || data;
  state.user = data.user || data.dashboard?.user || data?.user || state.dashboard?.user || state.user;
  state.courses = state.dashboard?.courses || state.courses;
  if (!state.selectedClassroomId && state.dashboard?.classrooms?.length) {
    state.selectedClassroomId = state.dashboard.classrooms[0].id;
  }
}

function setTheme(theme) {
  state.theme = theme;
  localStorage.setItem("bb_theme", theme);
  document.body.dataset.theme = theme;
}

function setLanguage(language) {
  state.language = language;
  localStorage.setItem("bb_lang", language);
}

function brand() {
  return `
    <div class="brand">
      <span class="brand-mark">BB</span>
      <span>Binary Builder<small>Premium learning OS</small></span>
    </div>
  `;
}

function render() {
  document.body.dataset.theme = state.theme;
  if (!state.user && state.view === "auth") {
    app.innerHTML = renderAuth();
    return;
  }
  if (!state.user) {
    app.innerHTML = renderLanding();
    renderAssistant();
    return;
  }
  app.innerHTML = renderShell();
  renderAssistant();
}

function renderLanding() {
  const stats = state.stats || { courses: 20, learners: 28400, classrooms: 420, certificates: 9100 };
  const previewCourses = state.courses.slice(0, 8);
  return `
    <nav class="site-nav">
      ${brand()}
      <div class="nav-links">
        <a href="#features">Platforma</a>
        <a href="#courses">Kurslar</a>
        <a href="#roles">Dashboard</a>
        <button class="ghost-btn" data-action="toggle-theme" title="${t("theme")}">${icon(state.theme === "dark" ? "sun" : "moon")}</button>
        <select aria-label="Language" data-action="language">
          ${languageOptions()}
        </select>
        <button class="ghost-btn" data-action="show-auth" data-mode="login">${t("login")}</button>
        <button class="primary-btn" data-action="show-auth" data-mode="signup">${icon("spark")}${t("signup")}</button>
      </div>
      <button class="icon-btn mobile-menu" data-action="show-auth" data-mode="login" title="${t("login")}">${icon("user")}</button>
    </nav>

    <header class="hero">
      <div class="hero-grid">
        <div>
          <span class="eyebrow">All-in-one education platform</span>
          <h1>Binary Builder <span>kelajak sinfi</span></h1>
          <p>O'quvchi va o'qituvchi uchun kurslar, classroom, testlar, live dars, AI yordamchi, XP, leaderboard va premium sertifikatlar bitta silliq platformada.</p>
          <div class="hero-actions">
            <button class="primary-btn" data-action="show-auth" data-mode="signup">${icon("spark")}${t("start")}</button>
            <button class="ghost-btn" data-action="demo-login" data-role="student">${icon("user")}O'quvchi demo</button>
            <button class="ghost-btn" data-action="demo-login" data-role="teacher">${icon("shield")}O'qituvchi demo</button>
          </div>
          <div class="hero-proof">
            <div class="proof-item"><strong>${stats.courses}+</strong><span>premium kurs</span></div>
            <div class="proof-item"><strong>${formatNumber(stats.learners)}+</strong><span>o'quvchi</span></div>
            <div class="proof-item"><strong>${formatNumber(stats.classrooms)}+</strong><span>classroom</span></div>
            <div class="proof-item"><strong>${formatNumber(stats.certificates)}+</strong><span>sertifikat</span></div>
          </div>
        </div>
        <div class="hero-stage" aria-label="Binary Builder dashboard preview">
          <div class="product-visual">
            <div class="visual-topbar"><span class="dot"></span><span class="dot"></span><span class="dot"></span><span class="badge hot">Live classroom</span></div>
            <div class="visual-board">
              <div class="visual-rail">
                <div class="rail-pill active">${icon("home")}Dashboard</div>
                <div class="rail-pill">${icon("book")}Kurslar</div>
                <div class="rail-pill">${icon("class")}Classroom</div>
                <div class="rail-pill">${icon("live")}Live dars</div>
                <div class="rail-pill">${icon("trophy")}Sertifikat</div>
              </div>
              <div class="visual-main">
                <div class="row"><h3>O'quv progressi</h3><span class="badge hot">AI plan</span></div>
                <div class="visual-cards">
                  <div class="mini-card"><span>XP points</span><strong>8,420</strong><div class="progress-line"><i style="width:82%"></i></div></div>
                  <div class="mini-card"><span>Daily streak</span><strong>18 kun</strong><div class="progress-line"><i style="width:68%"></i></div></div>
                  <div class="mini-card"><span>Test natijasi</span><strong>92%</strong><div class="progress-line"><i style="width:92%"></i></div></div>
                  <div class="mini-card"><span>Live attendance</span><strong>96%</strong><div class="progress-line"><i style="width:96%"></i></div></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="hero-next"><span>Pastda platformaning asosiy modullari ko'rinadi</span><span>${icon("spark")}</span></div>
    </header>

    <section class="section" id="features">
      <div class="section-inner">
        <div class="section-head">
          <div><span class="eyebrow">Core system</span><h2>O'qish, dars berish va baholash uchun bitta premium markaz</h2></div>
          <p>Classroom, test, live dars va sertifikatlar bir xil dizayn tilida ishlaydi.</p>
        </div>
        <div class="feature-grid">
          ${featureCard("class", "Smart Classroom", "Announcement, lessons, homework, tests, chat, grades va live jadval bir joyda.")}
          ${featureCard("upload", "Dars yuklash", "Text, PDF, rasm, video, YouTube embed, slayd va kodlash topshiriqlari.")}
          ${featureCard("chart", "Avto test analytics", "Multiple choice, true/false, short answer va timed exam natijalari diagrammada.")}
          ${featureCard("live", "Online video dars", "Kamera, mikrofon, screen share, raise hand, chat va attendance ko'rinishi.")}
          ${featureCard("spark", "AI Study Assistant", "Kurs tanlash, daily plan, quiz maslahatlari va reminder uchun chatbot.")}
          ${featureCard("trophy", "Premium certificate", "Ism, kurs, sana, QR kod, imzo va Binary Builder logosi bilan.")}
          ${featureCard("shield", "Role-based auth", "O'quvchi va o'qituvchi uchun alohida dashboard va xavfsiz token oqimi.")}
          ${featureCard("bell", "Gamification", "XP, daily streak, badge system, leaderboard va notificationlar.")}
        </div>
      </div>
    </section>

    <section class="section" id="courses">
      <div class="section-inner">
        <div class="section-head">
          <div><span class="eyebrow">Self learning</span><h2>20 ta premium mustaqil o'rganish kursi</h2></div>
          <button class="ghost-btn" data-action="show-auth" data-mode="signup">${icon("book")}Kurslarga kirish</button>
        </div>
        <div class="course-grid">
          ${previewCourses.map(courseCard).join("")}
        </div>
      </div>
    </section>

    <section class="section" id="roles">
      <div class="section-inner">
        <div class="section-head">
          <div><span class="eyebrow">Two dashboards</span><h2>O'quvchi va o'qituvchi uchun alohida professional ish maydoni</h2></div>
        </div>
        <div class="teacher-grid">
          <div class="panel">
            <div class="row"><h3>O'quvchi dashboard</h3><span class="badge hot">XP + streak</span></div>
            ${list(["Mening kurslarim", "Join Classroom", "Vazifalar", "Test natijalari", "Sertifikatlar", "Live darslar", "Ustoz bilan chat"])}
          </div>
          <div class="panel">
            <div class="row"><h3>O'qituvchi dashboard</h3><span class="badge hot">Creator tools</span></div>
            ${list(["Classroom yaratish", "Kod yaratish", "O'quvchilarni boshqarish", "Dars yuklash", "Test yaratish", "Natijalarni ko'rish", "Live dars rejalash"])}
          </div>
        </div>
      </div>
    </section>
  `;
}

function featureCard(iconName, title, text) {
  return `
    <article class="feature-card">
      <span class="badge hot">${icon(iconName)}${escapeHtml(title)}</span>
      <h3>${escapeHtml(title)}</h3>
      <p>${escapeHtml(text)}</p>
    </article>
  `;
}

function list(items) {
  return `<div class="stack">${items.map((item) => `<div class="notification-row"><span>${icon("check")}${escapeHtml(item)}</span><span class="badge">Ready</span></div>`).join("")}</div>`;
}

function courseCard(course) {
  return `
    <article class="course-card" style="--from:${course.accent?.from || "#38bdf8"};--to:${course.accent?.to || "#8b5cf6"}" data-action="open-course" data-course-id="${course.id}">
      <span class="badge hot">${escapeHtml(course.category)}</span>
      <h3>${escapeHtml(course.title)}</h3>
      <p>${escapeHtml(course.summary)}</p>
      <div class="course-meta">
        <span class="badge">${escapeHtml(course.level)}</span>
        <span class="badge">${escapeHtml(course.duration)}</span>
        <span class="badge">${course.lessonsCount} dars</span>
        <span class="badge">${course.rating} rating</span>
      </div>
    </article>
  `;
}

function renderAuth() {
  const isSignup = state.authMode === "signup";
  return `
    <div class="auth-shell">
      <div class="auth-card">
        <aside class="auth-art">
          <div>${brand()}</div>
          <div>
            <span class="eyebrow">Secure role-based access</span>
            <h1>${isSignup ? "Binary Builderga qo'shiling" : "Xush kelibsiz"}</h1>
            <p>${isSignup ? "O'quvchi yoki o'qituvchi sifatida ro'yxatdan o'ting, profil rasmi qo'shing va shaxsiy dashboardni oching." : "Demo akkaunt yoki o'zingiz yaratgan profil bilan kiring. Platforma token va hash qilingan parol oqimidan foydalanadi."}</p>
          </div>
          <div class="stack">
            <button class="ghost-btn" data-action="back-home">${icon("home")}Landing page</button>
            <button class="ghost-btn" data-action="toggle-theme">${icon(state.theme === "dark" ? "sun" : "moon")}${t("theme")}</button>
          </div>
        </aside>
        <main class="auth-form">
          <div class="row wrap">
            <div>
              <span class="eyebrow">${isSignup ? "Create account" : "Sign in"}</span>
              <h2>${isSignup ? t("signup") : t("login")}</h2>
            </div>
            <select aria-label="Language" data-action="language">${languageOptions()}</select>
          </div>
          <div class="segmented" style="margin:18px 0">
            <button class="${!isSignup ? "active" : ""}" data-action="switch-auth" data-mode="login">${t("login")}</button>
            <button class="${isSignup ? "active" : ""}" data-action="switch-auth" data-mode="signup">${t("signup")}</button>
          </div>
          <form id="auth-form" class="stack">
            ${isSignup ? `
              <label>Ism Familiya<input name="name" placeholder="Masalan: Diyorbek Sobirov" required /></label>
              <div>
                <span class="muted" style="display:block;margin-bottom:8px;font-weight:760">Rol tanlash</span>
                <div class="segmented">
                  <button type="button" class="${state.roleDraft === "student" ? "active" : ""}" data-action="set-role" data-role="student">${icon("user")}O'quvchi</button>
                  <button type="button" class="${state.roleDraft === "teacher" ? "active" : ""}" data-action="set-role" data-role="teacher">${icon("shield")}O'qituvchi</button>
                </div>
              </div>
              <div class="avatar-uploader">
                <div class="avatar-preview" id="avatar-preview">${state.avatarDraft ? `<img src="${state.avatarDraft}" alt="Profil rasmi" />` : "BB"}</div>
                <label style="flex:1">Profil rasmi<input type="file" accept="image/*" data-action="avatar-file" /></label>
              </div>
            ` : ""}
            <label>Email<input name="email" type="email" placeholder="${isSignup ? "siz@email.com" : "student@binary.uz"}" required /></label>
            <label>Parol<input name="password" type="password" placeholder="${isSignup ? "Kamida 6 belgi" : "binary123"}" minlength="6" required /></label>
            <button class="primary-btn" type="submit">${icon("spark")}${isSignup ? "Akkaunt yaratish" : "Tizimga kirish"}</button>
          </form>
          <div class="row wrap" style="margin-top:14px">
            <button class="ghost-btn" data-action="demo-login" data-role="student">${icon("user")}Student demo</button>
            <button class="ghost-btn" data-action="demo-login" data-role="teacher">${icon("shield")}Teacher demo</button>
          </div>
        </main>
      </div>
    </div>
  `;
}

function renderShell() {
  const navItems = state.user.role === "teacher"
    ? [
        ["dashboard", "home", t("dashboard")],
        ["classroom", "class", t("classroom")],
        ["creator", "upload", t("creator")],
        ["live", "live", t("live")],
        ["profile", "user", t("profile")]
      ]
    : [
        ["dashboard", "home", t("dashboard")],
        ["courses", "book", t("courses")],
        ["classroom", "class", t("classroom")],
        ["live", "live", t("live")],
        ["certificates", "trophy", t("certificates")],
        ["profile", "user", t("profile")]
      ];
  return `
    <div class="app-shell">
      <aside class="sidebar ${state.sidebarOpen ? "open" : ""}">
        <div class="row">
          ${brand()}
          <button class="icon-btn mobile-menu" data-action="toggle-sidebar" title="Close">${icon("x")}</button>
        </div>
        <nav class="side-nav">
          ${navItems.map(([view, iconName, label]) => `<button class="${state.view === view ? "active" : ""}" data-action="navigate" data-view="${view}">${icon(iconName)}${label}</button>`).join("")}
        </nav>
        <div class="panel">
          <div class="row">
            ${avatar(state.user)}
            <div>
              <strong>${escapeHtml(state.user.name)}</strong>
              <div class="muted">${state.user.role === "teacher" ? "O'qituvchi" : "O'quvchi"}</div>
            </div>
          </div>
          <div class="course-meta">
            ${(state.user.badges || []).slice(0, 3).map((badge) => `<span class="badge">${escapeHtml(badge)}</span>`).join("")}
          </div>
        </div>
        <div class="side-foot">
          <select aria-label="Language" data-action="language">${languageOptions()}</select>
          <button class="ghost-btn" data-action="toggle-theme">${icon(state.theme === "dark" ? "sun" : "moon")}${t("theme")}</button>
          <button class="ghost-btn" data-action="logout">${icon("x")}${t("logout")}</button>
        </div>
      </aside>
      <main class="main">
        <header class="topbar">
          <div class="row">
            <button class="icon-btn mobile-menu" data-action="toggle-sidebar" title="Menu">${icon("menu")}</button>
            <div>
              <strong>${escapeHtml(viewTitle())}</strong>
              <div class="muted">${state.user.role === "teacher" ? "Mentor workspace" : "Learning workspace"}</div>
            </div>
          </div>
          <div class="top-actions">
            <button class="ghost-btn" data-action="navigate" data-view="live">${icon("live")}Live</button>
            <button class="icon-btn" data-action="navigate" data-view="profile" title="Profile">${icon("user")}</button>
            ${avatar(state.user)}
          </div>
        </header>
        ${renderView()}
      </main>
    </div>
  `;
}

function viewTitle() {
  const map = {
    dashboard: t("dashboard"),
    courses: t("courses"),
    classroom: t("classroom"),
    creator: t("creator"),
    live: t("live"),
    certificates: t("certificates"),
    profile: t("profile")
  };
  return map[state.view] || "Binary Builder";
}

function renderView() {
  if (state.view === "courses") return renderCoursesView();
  if (state.view === "classroom") return renderClassroomView();
  if (state.view === "creator") return renderCreatorView();
  if (state.view === "live") return renderLiveView();
  if (state.view === "certificates") return renderCertificatesView();
  if (state.view === "profile") return renderProfileView();
  return state.user.role === "teacher" ? renderTeacherDashboard() : renderStudentDashboard();
}

function renderStudentDashboard() {
  const dashboard = state.dashboard || {};
  const stats = dashboard.stats || {};
  const enrollments = dashboard.enrollments || [];
  const classrooms = dashboard.classrooms || [];
  const nextClass = classrooms[0];
  return `
    <section class="hero-panel">
      <div>
        <span class="eyebrow">Welcome back</span>
        <h2>Bugungi o'qish rejangiz tayyor, ${escapeHtml(state.user.name.split(" ")[0])}</h2>
        <p class="muted">AI yordamchi progress, live darslar va test natijalariga qarab eng foydali keyingi qadamni tavsiya qiladi.</p>
      </div>
      <div class="progress-ring" style="--value:${stats.completion || 0}"><strong>${stats.completion || 0}%</strong></div>
    </section>
    <div class="stat-grid">
      ${statCard("XP points", formatNumber(stats.xp || state.user.xp || 0), "+120 bugun")}
      ${statCard("Daily streak", `${stats.streak || state.user.streak || 0} kun`, "ketma-ket")}
      ${statCard("Kurslar", stats.activeCourses || enrollments.length, "aktiv")}
      ${statCard("Classroom", stats.classrooms || classrooms.length, nextClass?.joinCode || "join")}
    </div>
    <div class="dashboard-grid">
      <div class="stack">
        <div class="panel">
          <div class="row wrap"><h3>Mening kurslarim</h3><button class="ghost-btn" data-action="navigate" data-view="courses">${icon("book")}Barchasi</button></div>
          <div class="course-grid" style="grid-template-columns:repeat(2,minmax(0,1fr));margin-top:14px">
            ${enrollments.slice(0, 4).map((item) => enrolledCourseCard(item)).join("") || emptyState("Hali kurs tanlanmagan", "Self-learning bo'limidan 20 ta kursdan birini boshlang.")}
          </div>
        </div>
        <div class="panel">
          <div class="row wrap"><h3>Vazifalar va testlar</h3><span class="badge hot">Auto-check</span></div>
          ${renderAssignments(classrooms)}
        </div>
        <div class="panel">
          <div class="row wrap"><h3>Test natijalari</h3><span class="badge">Diagramma</span></div>
          ${renderResultsChart(dashboard.submissions || [])}
        </div>
      </div>
      <aside class="stack">
        <div class="panel">
          <h3>Join Classroom</h3>
          <form id="join-class-form" class="row wrap" style="margin-top:12px">
            <input name="code" placeholder="Masalan: BINARY7" required />
            <button class="primary-btn" type="submit">${icon("plus")}${t("join")}</button>
          </form>
        </div>
        <div class="panel">
          <div class="row wrap"><h3>Live dars</h3><button class="ghost-btn" data-action="navigate" data-view="live">${icon("play")}Kirish</button></div>
          <p class="muted">${nextClass?.live ? `${nextClass.live.title} - ${formatDate(nextClass.live.scheduledAt)}` : "Yaqin live dars hali belgilanmagan."}</p>
        </div>
        <div class="panel">
          <h3>Notification</h3>
          ${notificationsList(dashboard.notifications || [])}
        </div>
        <div class="panel">
          <h3>Reyting jadvali</h3>
          ${leaderboard(dashboard.leaderboard || [])}
        </div>
        <div class="panel">
          <h3>Ustoz bilan chat</h3>
          ${miniChat(nextClass)}
        </div>
      </aside>
    </div>
  `;
}

function renderTeacherDashboard() {
  const dashboard = state.dashboard || {};
  const classrooms = dashboard.classrooms || [];
  const studentsCount = classrooms.reduce((total, item) => total + item.students.length, 0);
  const lessonsCount = classrooms.reduce((total, item) => total + item.lessons.length, 0);
  const testsCount = classrooms.reduce((total, item) => total + item.tests.length, 0);
  return `
    <section class="hero-panel">
      <div>
        <span class="eyebrow">Teacher command center</span>
        <h2>Bugun classroom, test va live darslarni premium tartibda boshqaring</h2>
        <p class="muted">O'quvchilar, dars materiallari, natijalar va chat bitta joyda ko'rinadi.</p>
      </div>
      <button class="primary-btn" data-action="navigate" data-view="creator">${icon("upload")}Creator Studio</button>
    </section>
    <div class="stat-grid">
      ${statCard("Classroom", classrooms.length, "aktiv")}
      ${statCard("O'quvchilar", studentsCount, "jami")}
      ${statCard("Darslar", lessonsCount, "yuklangan")}
      ${statCard("Testlar", testsCount, "yaratilgan")}
    </div>
    <div class="teacher-grid">
      <div class="stack">
        <div class="panel">
          <div class="row wrap"><h3>Classroom yaratish</h3><span class="badge hot">Auto code</span></div>
          ${createClassForm()}
        </div>
        <div class="panel">
          <h3>Classroomlar</h3>
          ${classroomList(classrooms)}
        </div>
      </div>
      <div class="stack">
        <div class="panel">
          <div class="row wrap"><h3>Natijalar</h3><span class="badge">Analytics</span></div>
          ${teacherChart(classrooms)}
        </div>
        <div class="panel">
          <h3>O'quvchilarni boshqarish</h3>
          ${studentTable(classrooms)}
        </div>
        <div class="panel">
          <h3>Reminder notification</h3>
          ${notificationsList(dashboard.notifications || [])}
        </div>
      </div>
    </div>
  `;
}

function statCard(label, value, trend) {
  return `<div class="stat-card"><span>${escapeHtml(label)}</span><strong>${escapeHtml(value)}</strong><div class="trend">${escapeHtml(trend)}</div></div>`;
}

function enrolledCourseCard(item) {
  const course = item.course || {};
  return `
    <article class="course-card" style="--from:${course.accent?.from || "#38bdf8"};--to:${course.accent?.to || "#8b5cf6"}" data-action="open-course" data-course-id="${course.id}">
      <span class="badge hot">${escapeHtml(course.category || "Course")}</span>
      <h3>${escapeHtml(course.title || item.courseId)}</h3>
      <p>${escapeHtml(item.lastLesson || course.summary || "")}</p>
      <div class="progress-line"><i style="width:${item.progress || 0}%"></i></div>
      <div class="course-meta"><span class="badge">${item.progress || 0}%</span><span class="badge">${item.xp || 0} XP</span></div>
    </article>
  `;
}

function renderAssignments(classrooms) {
  const rows = classrooms.flatMap((classroom) => [
    ...(classroom.homework || []).map((item) => ({ ...item, type: "Vazifa", classroom: classroom.title })),
    ...(classroom.tests || []).map((item) => ({ ...item, type: "Test", classroom: classroom.title, due: `${item.timedMinutes || 20} min` }))
  ]);
  if (!rows.length) return emptyState("Vazifa yo'q", "Classroomga kirganingizda vazifalar shu yerda chiqadi.");
  return rows.map((item) => `
    <div class="assignment-row">
      <div><strong>${escapeHtml(item.title)}</strong><div class="muted">${escapeHtml(item.classroom)} - ${escapeHtml(item.type)}</div></div>
      <span class="badge">${escapeHtml(item.due || "open")}</span>
    </div>
  `).join("");
}

function renderResultsChart(submissions) {
  const data = submissions.length ? submissions.slice(0, 6) : [
    { score: 86, testTitle: "HTML" },
    { score: 92, testTitle: "CSS" },
    { score: 78, testTitle: "JS" },
    { score: 88, testTitle: "AI" }
  ];
  return `
    <div class="chart-bars">
      ${data.map((item) => `<div class="bar" style="height:${Math.max(16, item.score)}%"><span>${item.score}%</span></div>`).join("")}
    </div>
  `;
}

function teacherChart(classrooms) {
  const grades = classrooms.flatMap((item) => item.grades || []);
  const data = grades.length ? grades : [
    { score: 91 },
    { score: 84 },
    { score: 78 },
    { score: 96 },
    { score: 88 }
  ];
  return `
    <div class="chart-bars">
      ${data.slice(0, 8).map((item) => `<div class="bar" style="height:${Math.max(16, item.score)}%"><span>${item.score}%</span></div>`).join("")}
    </div>
  `;
}

function notificationsList(items) {
  if (!items.length) return emptyState("Xabar yo'q", "Reminder va platforma xabarlari shu yerda chiqadi.");
  return items.map((item) => `<div class="notification-row"><span>${icon("bell")}${escapeHtml(item.text)}</span><span class="badge">${formatDate(item.createdAt)}</span></div>`).join("");
}

function leaderboard(items) {
  if (!items.length) return emptyState("Leaderboard bo'sh", "O'quvchilar XP yig'ganda reyting paydo bo'ladi.");
  return items.map((item, index) => `
    <div class="leader-row">
      <span class="rank">${index + 1}</span>
      <div style="flex:1"><strong>${escapeHtml(item.name)}</strong><div class="muted">${item.streak || 0} kun streak</div></div>
      <span class="badge">${formatNumber(item.xp)} XP</span>
    </div>
  `).join("");
}

function miniChat(classroom) {
  if (!classroom) return emptyState("Chat hali yo'q", "Classroomga qo'shiling va ustoz bilan yozishing.");
  return `
    <div class="chat-window">
      ${(classroom.chat || []).slice(-3).map((message) => `<div class="chat-bubble"><strong>${escapeHtml(message.name)}</strong><p>${escapeHtml(message.text)}</p></div>`).join("")}
    </div>
    <form id="chat-form" class="row wrap" style="margin-top:12px">
      <input type="hidden" name="classroomId" value="${classroom.id}" />
      <input name="text" placeholder="Xabar yozing" required />
      <button class="primary-btn" type="submit">${icon("chat")}</button>
    </form>
  `;
}

function createClassForm() {
  return `
    <form id="create-class-form" class="form-grid" style="margin-top:12px">
      <label>Classroom nomi<input name="title" placeholder="Masalan: Python Bootcamp" required /></label>
      <label>Fan / yo'nalish<input name="subject" placeholder="Python, AI, IELTS..." required /></label>
      <label>Accent rang<select name="accent"><option value="#38bdf8">Blue neon</option><option value="#8b5cf6">Purple</option><option value="#22c55e">Green</option><option value="#f97316">Orange</option></select></label>
      <label>&nbsp;<button class="primary-btn" type="submit">${icon("plus")}${t("create")}</button></label>
    </form>
  `;
}

function classroomList(classrooms) {
  if (!classrooms.length) return emptyState("Classroom yo'q", "Birinchi classroomni yaratib, join code ulashing.");
  return classrooms.map((item) => `
    <div class="assignment-row">
      <div>
        <strong>${escapeHtml(item.title)}</strong>
        <div class="muted">${escapeHtml(item.subject)} - ${item.students.length} o'quvchi</div>
      </div>
      <div class="row wrap">
        <span class="badge hot">${escapeHtml(item.joinCode)}</span>
        <button class="ghost-btn" data-action="select-classroom" data-classroom-id="${item.id}">${icon("class")}Ochish</button>
      </div>
    </div>
  `).join("");
}

function studentTable(classrooms) {
  const rows = classrooms.flatMap((classroom) => classroom.students.map((studentId) => ({ studentId, classroom: classroom.title })));
  if (!rows.length) return emptyState("O'quvchi yo'q", "Join code ulashing, o'quvchilar ro'yxati shu yerda chiqadi.");
  return rows.map((row, index) => `
    <div class="leader-row">
      <span class="rank">${index + 1}</span>
      <div style="flex:1"><strong>${row.studentId === "u_student" ? "Dilshod Rahimov" : escapeHtml(row.studentId)}</strong><div class="muted">${escapeHtml(row.classroom)}</div></div>
      <span class="badge">active</span>
    </div>
  `).join("");
}

function renderCoursesView() {
  const query = state.courseQuery.toLowerCase().trim();
  const courses = state.courses.filter((course) => {
    return !query || `${course.title} ${course.category} ${course.summary}`.toLowerCase().includes(query);
  });
  const selected = state.courses.find((course) => course.id === state.selectedCourseId) || courses[0];
  return `
    <div class="view-title">
      <div><span class="eyebrow">Self-learning academy</span><h1>20 ta premium kurs</h1><p>Har kursda darslar, matnlar, quiz, final test va sertifikat bor.</p></div>
      <div class="row wrap">
        <input style="min-width:260px" data-action="course-search" value="${escapeHtml(state.courseQuery)}" placeholder="${t("search")}..." />
      </div>
    </div>
    <div class="dashboard-grid">
      <div class="course-grid" style="grid-template-columns:repeat(2,minmax(0,1fr))">
        ${courses.map(courseCard).join("") || emptyState("Kurs topilmadi", "Qidiruvni o'zgartirib ko'ring.")}
      </div>
      <aside class="stack">
        ${selected ? renderCourseDetail(selected) : ""}
      </aside>
    </div>
  `;
}

function renderCourseDetail(course) {
  const enrollment = state.dashboard?.enrollments?.find((item) => item.courseId === course.id);
  const certificate = state.dashboard?.certificates?.find((item) => item.courseId === course.id);
  return `
    <div class="panel">
      <span class="badge hot">${escapeHtml(course.category)}</span>
      <h2>${escapeHtml(course.title)}</h2>
      <p class="muted">${escapeHtml(course.summary)}</p>
      <div class="course-meta">
        <span class="badge">${escapeHtml(course.level)}</span>
        <span class="badge">${escapeHtml(course.duration)}</span>
        <span class="badge">${course.lessonsCount} dars</span>
        <span class="badge">${course.xp} XP</span>
      </div>
      <div class="progress-line"><i style="width:${enrollment?.progress || 0}%"></i></div>
    </div>
    <div class="panel">
      <h3>Darslar</h3>
      ${course.lessons.map((lesson) => `
        <div class="lesson-item">
          <div><strong>${escapeHtml(lesson.title)}</strong><div class="muted">${escapeHtml(lesson.type)} - ${lesson.minutes} min</div></div>
          <span class="badge">${icon(lesson.type === "Video" ? "play" : "book")}${escapeHtml(lesson.type)}</span>
        </div>
      `).join("")}
    </div>
    <div class="panel">
      <h3>Final test</h3>
      ${course.finalTest.questions.map((question, index) => `<div class="test-item"><span>${index + 1}. ${escapeHtml(question.prompt)}</span><span class="badge">${escapeHtml(question.type)}</span></div>`).join("")}
      <button class="primary-btn" style="margin-top:12px;width:100%" data-action="complete-course" data-course-id="${course.id}">${icon("trophy")}${certificate ? "Sertifikatni ko'rish" : "Finalni tugatish va sertifikat olish"}</button>
    </div>
    ${certificate ? renderCertificate(certificate, true) : ""}
  `;
}

function renderClassroomView() {
  const classrooms = state.dashboard?.classrooms || [];
  const selected = classrooms.find((item) => item.id === state.selectedClassroomId) || classrooms[0];
  if (!selected) {
    return `
      <div class="view-title">
        <div><span class="eyebrow">Classroom</span><h1>Classroom hali yo'q</h1><p>${state.user.role === "teacher" ? "Yangi classroom oching va join code ulashing." : "Join code kiriting va classga qo'shiling."}</p></div>
      </div>
      <div class="panel">${state.user.role === "teacher" ? createClassForm() : `<form id="join-class-form" class="row wrap"><input name="code" placeholder="BINARY7" required /><button class="primary-btn" type="submit">${icon("plus")}${t("join")}</button></form>`}</div>
    `;
  }
  return `
    <div class="classroom-header">
      <div>
        <span class="eyebrow">Join code: ${escapeHtml(selected.joinCode)}</span>
        <h1>${escapeHtml(selected.title)}</h1>
        <p class="muted">${escapeHtml(selected.subject)} - ${selected.students.length} o'quvchi</p>
      </div>
      <div class="row wrap">
        ${classrooms.map((item) => `<button class="tab-btn ${item.id === selected.id ? "active" : ""}" data-action="select-classroom" data-classroom-id="${item.id}">${escapeHtml(item.title)}</button>`).join("")}
      </div>
    </div>
    <div class="tabs">
      ${[
        ["announcements", "Announcement"],
        ["lessons", "Lessons"],
        ["homework", "Homework"],
        ["tests", "Tests"],
        ["live", "Live dars"],
        ["chat", "Chat"],
        ["grades", "Baholar"]
      ].map(([tab, label]) => `<button class="tab-btn ${state.classroomTab === tab ? "active" : ""}" data-action="classroom-tab" data-tab="${tab}">${label}</button>`).join("")}
    </div>
    ${renderClassroomTab(selected)}
  `;
}

function renderClassroomTab(classroom) {
  if (state.classroomTab === "lessons") {
    const lessons = (classroom.lessons || []).filter((lesson) => !state.lessonQuery || `${lesson.title} ${lesson.body} ${lesson.type}`.toLowerCase().includes(state.lessonQuery.toLowerCase()));
    return `<div class="panel"><div class="row wrap"><h3>Lessons</h3><input style="max-width:280px" data-action="lesson-search" value="${escapeHtml(state.lessonQuery)}" placeholder="Search lesson..." /></div>${lessons.map((lesson) => `
      <div class="lesson-item">
        <div><strong>${escapeHtml(lesson.title)}</strong><div class="muted">${escapeHtml(lesson.type)} - ${escapeHtml(lesson.body)}</div>${lesson.url ? `<a class="badge hot" href="${escapeHtml(lesson.url)}" target="_blank" rel="noreferrer">Material</a>` : ""}</div>
        <span class="badge">${formatDate(lesson.createdAt)}</span>
      </div>
    `).join("") || emptyState("Dars topilmadi", "O'qituvchi dars yuklaganda shu yerda chiqadi.")}</div>`;
  }
  if (state.classroomTab === "homework") {
    return `<div class="panel"><h3>Homework</h3>${(classroom.homework || []).map((item) => `<div class="assignment-row"><div><strong>${escapeHtml(item.title)}</strong><div class="muted">Deadline: ${escapeHtml(item.due)}</div></div><span class="badge">${item.points} point</span></div>`).join("") || emptyState("Vazifa yo'q", "Yangi vazifalar shu yerda ko'rinadi.")}</div>`;
  }
  if (state.classroomTab === "tests") {
    return `<div class="panel"><h3>Tests</h3>${(classroom.tests || []).map((test) => renderTest(classroom, test)).join("") || emptyState("Test yo'q", "O'qituvchi test yaratganda shu yerda chiqadi.")}</div>`;
  }
  if (state.classroomTab === "live") {
    return `<div class="panel"><div class="row wrap"><div><h3>${escapeHtml(classroom.live?.title || "Live dars belgilanmagan")}</h3><p class="muted">${classroom.live ? formatDate(classroom.live.scheduledAt) : "Schedule bo'sh"}</p></div><button class="primary-btn" data-action="navigate" data-view="live">${icon("live")}Live xonaga kirish</button></div></div>`;
  }
  if (state.classroomTab === "chat") {
    return `<div class="panel"><h3>Chat</h3>${miniChat(classroom)}</div>`;
  }
  if (state.classroomTab === "grades") {
    return `<div class="panel"><h3>Baholar</h3>${(classroom.grades || []).map((grade) => `<div class="assignment-row"><div><strong>${escapeHtml(grade.label)}</strong><div class="muted">${grade.studentId === state.user.id ? state.user.name : grade.studentId}</div></div><span class="badge hot">${grade.score}%</span></div>`).join("") || emptyState("Baho yo'q", "Test yoki vazifa tekshirilganda baholar chiqadi.")}</div>`;
  }
  return `<div class="panel"><h3>Announcement</h3>${(classroom.announcements || []).map((item) => `<div class="notification-row"><div><strong>${escapeHtml(item.title)}</strong><div class="muted">${escapeHtml(item.text)}</div></div><span class="badge">${formatDate(item.createdAt)}</span></div>`).join("") || emptyState("E'lon yo'q", "Yangi e'lonlar shu yerda ko'rinadi.")}</div>`;
}

function renderTest(classroom, test) {
  return `
    <form class="test-item" data-test-form="true">
      <input type="hidden" name="classroomId" value="${classroom.id}" />
      <input type="hidden" name="testId" value="${test.id}" />
      <div style="width:100%">
        <div class="row wrap"><strong>${escapeHtml(test.title)}</strong><span class="badge">${test.timedMinutes || 20} min</span></div>
        <div class="stack" style="margin-top:10px">
          ${(test.questions || []).map((question) => renderQuestionInput(question)).join("")}
        </div>
      </div>
      ${state.user.role === "student" ? `<button class="primary-btn" type="submit">${icon("check")}Topshirish</button>` : `<span class="badge">Teacher preview</span>`}
    </form>
  `;
}

function renderQuestionInput(question) {
  if (question.type === "multiple") {
    return `
      <label>${escapeHtml(question.prompt)}
        <select name="${question.id}" required>
          <option value="">Javob tanlang</option>
          ${(question.options || []).map((option) => `<option value="${escapeHtml(option)}">${escapeHtml(option)}</option>`).join("")}
        </select>
      </label>
    `;
  }
  if (question.type === "truefalse") {
    return `
      <label>${escapeHtml(question.prompt)}
        <select name="${question.id}" required>
          <option value="">Javob tanlang</option>
          <option value="True">True</option>
          <option value="False">False</option>
        </select>
      </label>
    `;
  }
  return `<label>${escapeHtml(question.prompt)}<input name="${question.id}" placeholder="Qisqa javob" required /></label>`;
}

function renderCreatorView() {
  const classrooms = state.dashboard?.classrooms || [];
  if (state.user.role !== "teacher") return `<div class="panel">Creator Studio faqat o'qituvchi uchun.</div>`;
  if (!classrooms.length) {
    return `<div class="view-title"><div><span class="eyebrow">Creator Studio</span><h1>Avval classroom yarating</h1></div></div><div class="panel">${createClassForm()}</div>`;
  }
  const options = classrooms.map((item) => `<option value="${item.id}">${escapeHtml(item.title)} (${item.joinCode})</option>`).join("");
  return `
    <div class="view-title">
      <div><span class="eyebrow">Creator Studio</span><h1>Dars, test, vazifa va live dars boshqaruvi</h1><p>Materiallarni tez yuklang, o'quvchilar esa classroom ichida ko'radi.</p></div>
    </div>
    <div class="teacher-grid">
      <div class="stack">
        <div class="panel">
          <h3>Dars yuklash</h3>
          <form id="lesson-form" class="form-grid single">
            <label>Classroom<select name="classroomId">${options}</select></label>
            <label>Dars turi<select name="type"><option>Text lesson</option><option>PDF</option><option>Rasm</option><option>Video</option><option>YouTube</option><option>Slayd</option><option>Kodlash topshirig'i</option></select></label>
            <label>Sarlavha<input name="title" placeholder="Masalan: CSS Grid amaliyoti" required /></label>
            <label>Matn / izoh<textarea name="body" placeholder="Dars tavsifi, topshiriq yoki matn"></textarea></label>
            <label>URL / YouTube embed / fayl havolasi<input name="url" placeholder="https://..." /></label>
            <button class="primary-btn" type="submit">${icon("upload")}Darsni yuklash</button>
          </form>
        </div>
        <div class="panel">
          <h3>Live dars rejalash</h3>
          <form id="live-form" class="form-grid single">
            <label>Classroom<select name="classroomId">${options}</select></label>
            <label>Dars nomi<input name="title" placeholder="Live coding session" required /></label>
            <label>Sana va vaqt<input name="scheduledAt" type="datetime-local" required /></label>
            <button class="primary-btn" type="submit">${icon("live")}Rejalash</button>
          </form>
        </div>
      </div>
      <div class="stack">
        <div class="panel">
          <h3>Test yaratish</h3>
          <form id="test-create-form" class="form-grid single">
            <label>Classroom<select name="classroomId">${options}</select></label>
            <label>Test nomi<input name="title" placeholder="JavaScript quiz" required /></label>
            <label>Vaqt limiti<input name="timedMinutes" type="number" min="1" value="20" /></label>
            <label>Savol turi<select name="type"><option value="multiple">Multiple Choice</option><option value="truefalse">True / False</option><option value="short">Short Answer</option></select></label>
            <label>Savol<input name="prompt" placeholder="Savol matni" required /></label>
            <label>Variantlar<input name="options" placeholder="A, B, C, D" /></label>
            <label>To'g'ri javob<input name="answer" placeholder="To'g'ri javob" required /></label>
            <button class="primary-btn" type="submit">${icon("chart")}Test yaratish</button>
          </form>
        </div>
        <div class="panel">
          <h3>Vazifa berish</h3>
          <form id="homework-form" class="form-grid single">
            <label>Classroom<select name="classroomId">${options}</select></label>
            <label>Vazifa nomi<input name="title" placeholder="Portfolio homepage" required /></label>
            <label>Deadline<input name="due" type="date" required /></label>
            <label>Ball<input name="points" type="number" min="1" value="100" /></label>
            <button class="primary-btn" type="submit">${icon("check")}Vazifa berish</button>
          </form>
        </div>
      </div>
    </div>
  `;
}

function renderLiveView() {
  const classroom = (state.dashboard?.classrooms || []).find((item) => item.id === state.selectedClassroomId) || state.dashboard?.classrooms?.[0];
  const names = state.user.role === "teacher"
    ? [state.user.name, "Dilshod Rahimov", "Madina Aliyeva", "Jasur Nabiyev"]
    : [state.user.name, "Aziza Karimova", "Madina Aliyeva", "Jasur Nabiyev"];
  return `
    <div class="view-title">
      <div><span class="eyebrow">Online video lesson</span><h1>${escapeHtml(classroom?.live?.title || "Binary Builder Live")}</h1><p>Kamera, mikrofon, screen share, chat, raise hand va attendance demo xonasi.</p></div>
      <span class="badge hot">${escapeHtml(classroom?.title || "Open room")}</span>
    </div>
    <div class="live-stage">
      <div>
        <div class="video-grid">
          ${names.map((name, index) => `
            <div class="video-tile">
              <div class="video-person">${escapeHtml(initials(name))}</div>
              <div class="video-label">${escapeHtml(name)} ${index === 0 ? "(siz)" : ""}</div>
            </div>
          `).join("")}
        </div>
        <div class="meeting-controls">
          <button class="control-btn ${state.meeting.camera ? "active" : ""}" data-action="meeting-toggle" data-control="camera" title="Camera">${icon("camera")}</button>
          <button class="control-btn ${state.meeting.mic ? "active" : ""}" data-action="meeting-toggle" data-control="mic" title="Microphone">${icon("mic")}</button>
          <button class="control-btn ${state.meeting.screen ? "active" : ""}" data-action="meeting-toggle" data-control="screen" title="Screen share">${icon("screen")}</button>
          <button class="control-btn ${state.meeting.hand ? "active" : ""}" data-action="meeting-toggle" data-control="hand" title="Raise hand">${icon("hand")}</button>
          <button class="control-btn danger-btn" title="Leave">${icon("x")}</button>
        </div>
      </div>
      <aside class="stack">
        <div class="panel">
          <h3>Attendance</h3>
          ${names.map((name) => `<div class="leader-row"><span class="rank">${initials(name)}</span><div style="flex:1"><strong>${escapeHtml(name)}</strong><div class="muted">online</div></div><span class="badge hot">present</span></div>`).join("")}
        </div>
        <div class="panel">
          <h3>Live chat</h3>
          ${miniChat(classroom)}
        </div>
      </aside>
    </div>
  `;
}

function renderCertificatesView() {
  const certificates = state.dashboard?.certificates || [];
  const selected = certificates[0];
  return `
    <div class="view-title">
      <div><span class="eyebrow">Premium certificates</span><h1>Sertifikatlar</h1><p>Ism, kurs nomi, sana, QR kod, imzo va Binary Builder logosi bilan.</p></div>
      <button class="ghost-btn" onclick="window.print()">${icon("trophy")}Print</button>
    </div>
    ${selected ? renderCertificate(selected) : `<div class="panel">${emptyState("Sertifikat hali yo'q", "Kursni 100% tugatsangiz sertifikat avtomatik yaratiladi.")}</div>`}
    <div class="course-grid" style="margin-top:14px">
      ${certificates.map((cert) => `<div class="certificate-card panel"><strong>${escapeHtml(cert.courseTitle)}</strong><p class="muted">${escapeHtml(cert.issuedAt)}</p><span class="badge">${escapeHtml(cert.qr)}</span></div>`).join("")}
    </div>
  `;
}

function renderCertificate(cert, compact = false) {
  return `
    <div class="certificate ${compact ? "" : ""}">
      <div class="row wrap">
        ${brand()}
        <span class="badge hot">Verified certificate</span>
      </div>
      <h2>Certificate of Completion</h2>
      <p class="muted">This certificate is proudly presented to</p>
      <div class="cert-name">${escapeHtml(cert.name)}</div>
      <p class="muted">for successfully completing <strong>${escapeHtml(cert.courseTitle)}</strong> on Binary Builder.</p>
      <div class="cert-footer">
        <div>
          <div class="signature">Founder Signature</div>
          <div class="muted">Date: ${escapeHtml(cert.issuedAt)}</div>
        </div>
        <div class="qr" aria-label="QR code">${qrBlocks(cert.qr)}</div>
      </div>
    </div>
  `;
}

function renderProfileView() {
  return `
    <div class="view-title">
      <div><span class="eyebrow">Account settings</span><h1>Profilni tahrirlash</h1><p>Ism, bio, til va profil rasmini yangilang.</p></div>
    </div>
    <div class="teacher-grid">
      <div class="panel">
        <form id="profile-form" class="form-grid single">
          <div class="avatar-uploader">
            <div class="avatar-preview" id="profile-avatar-preview">${state.profileAvatarDraft || state.user.avatar ? `<img src="${escapeHtml(state.profileAvatarDraft || state.user.avatar)}" alt="Profil rasmi" />` : initials(state.user.name)}</div>
            <label style="flex:1">Profil rasmi<input type="file" accept="image/*" data-action="profile-avatar-file" /></label>
          </div>
          <label>Ism Familiya<input name="name" value="${escapeHtml(state.user.name)}" required /></label>
          <label>Bio<textarea name="bio">${escapeHtml(state.user.bio || "")}</textarea></label>
          <label>Til<select name="language">${languageOptions(state.user.language || state.language)}</select></label>
          <button class="primary-btn" type="submit">${icon("check")}${t("save")}</button>
        </form>
      </div>
      <div class="stack">
        <div class="panel">
          <h3>Badge system</h3>
          <div class="course-meta">${(state.user.badges || []).map((badge) => `<span class="badge hot">${escapeHtml(badge)}</span>`).join("")}</div>
        </div>
        <div class="panel">
          <h3>Account security</h3>
          <div class="notification-row"><span>${icon("shield")}Password hash + signed token</span><span class="badge hot">active</span></div>
          <div class="notification-row"><span>${icon("user")}Role: ${state.user.role}</span><span class="badge">verified</span></div>
        </div>
      </div>
    </div>
  `;
}

function renderAssistant() {
  const old = document.querySelector(".assistant-fab");
  const panel = document.querySelector(".assistant-panel");
  if (old) old.remove();
  if (panel) panel.remove();
  document.body.insertAdjacentHTML("beforeend", `
    <button class="assistant-fab" data-action="toggle-assistant" title="AI Study Assistant">${icon("spark")}</button>
    <div class="assistant-panel ${state.assistantOpen ? "" : "hidden"}">
      <div class="row"><strong>AI Study Assistant</strong><button class="icon-btn" data-action="toggle-assistant">${icon("x")}</button></div>
      <div class="chat-window">
        ${state.assistantMessages.map((message) => `<div class="chat-bubble"><strong>${message.from === "ai" ? "Binary AI" : "Siz"}</strong><p>${escapeHtml(message.text)}</p></div>`).join("")}
      </div>
      <form id="assistant-form" class="row wrap">
        <input name="text" placeholder="Kurs, test yoki reja so'rang..." required />
        <button class="primary-btn" type="submit">${icon("chat")}</button>
      </form>
    </div>
  `);
}

function emptyState(title, text) {
  return `<div class="notification-row"><div><strong>${escapeHtml(title)}</strong><div class="muted">${escapeHtml(text)}</div></div></div>`;
}

function languageOptions(selected = state.language) {
  return `
    <option value="uz" ${selected === "uz" ? "selected" : ""}>O'zbek</option>
    <option value="en" ${selected === "en" ? "selected" : ""}>English</option>
    <option value="ru" ${selected === "ru" ? "selected" : ""}>Русский</option>
  `;
}

function formatNumber(value) {
  return new Intl.NumberFormat("en-US").format(Number(value || 0));
}

function formatDate(value) {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value).slice(0, 16);
  return new Intl.DateTimeFormat(state.language === "uz" ? "uz-UZ" : state.language === "ru" ? "ru-RU" : "en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit"
  }).format(date);
}

function qrBlocks(seed) {
  const text = String(seed || "BINARYBUILDER");
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  return Array.from({ length: 49 }, (_, index) => ((hash >> (index % 24)) + index) % 3 ? "<i></i>" : "<span></span>").join("");
}

function selectedClassroom() {
  return (state.dashboard?.classrooms || []).find((item) => item.id === state.selectedClassroomId) || state.dashboard?.classrooms?.[0];
}

async function refreshDashboard() {
  const dashboard = await api("/api/me");
  applyDashboard(dashboard);
}

async function login(email, password) {
  const data = await api("/api/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password })
  });
  state.token = data.token;
  localStorage.setItem("bb_token", state.token);
  applyDashboard(data.dashboard || data);
  state.view = "dashboard";
  toast("Tizimga muvaffaqiyatli kirdingiz");
  render();
}

document.addEventListener("click", async (event) => {
  const target = event.target.closest("[data-action]");
  if (!target) return;
  const action = target.dataset.action;

  try {
    if (action === "show-auth") {
      state.authMode = target.dataset.mode || "login";
      state.view = "auth";
      render();
    }
    if (action === "back-home") {
      state.view = "landing";
      render();
    }
    if (action === "switch-auth") {
      state.authMode = target.dataset.mode || "login";
      render();
    }
    if (action === "set-role") {
      state.roleDraft = target.dataset.role || "student";
      render();
    }
    if (action === "toggle-theme") {
      setTheme(state.theme === "dark" ? "light" : "dark");
      render();
    }
    if (action === "demo-login") {
      const role = target.dataset.role || "student";
      await login(role === "teacher" ? "teacher@binary.uz" : "student@binary.uz", "binary123");
    }
    if (action === "logout") {
      state.token = "";
      state.user = null;
      state.dashboard = null;
      localStorage.removeItem("bb_token");
      state.view = "landing";
      toast("Tizimdan chiqdingiz");
      render();
    }
    if (action === "navigate") {
      state.view = target.dataset.view || "dashboard";
      state.sidebarOpen = false;
      render();
    }
    if (action === "toggle-sidebar") {
      state.sidebarOpen = !state.sidebarOpen;
      render();
    }
    if (action === "open-course") {
      state.selectedCourseId = target.dataset.courseId;
      if (state.user) state.view = "courses";
      render();
    }
    if (action === "complete-course") {
      const data = await api("/api/courses/complete", {
        method: "POST",
        body: JSON.stringify({ courseId: target.dataset.courseId })
      });
      applyDashboard(data.dashboard);
      state.view = "certificates";
      toast("Sertifikat tayyor");
      render();
    }
    if (action === "select-classroom") {
      state.selectedClassroomId = target.dataset.classroomId;
      state.view = "classroom";
      render();
    }
    if (action === "classroom-tab") {
      state.classroomTab = target.dataset.tab || "announcements";
      render();
    }
    if (action === "meeting-toggle") {
      const control = target.dataset.control;
      state.meeting[control] = !state.meeting[control];
      render();
    }
    if (action === "toggle-assistant") {
      state.assistantOpen = !state.assistantOpen;
      renderAssistant();
    }
  } catch (error) {
    toast(error.message);
  }
});

document.addEventListener("change", (event) => {
  const target = event.target;
  const action = target.dataset.action;
  if (action === "language") {
    setLanguage(target.value);
    toast("Til yangilandi");
    render();
  }
  if (action === "avatar-file" || action === "profile-avatar-file") {
    const file = target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (action === "avatar-file") {
        state.avatarDraft = reader.result;
        const preview = document.querySelector("#avatar-preview");
        if (preview) preview.innerHTML = `<img src="${state.avatarDraft}" alt="Profil rasmi" />`;
      } else {
        state.profileAvatarDraft = reader.result;
        const preview = document.querySelector("#profile-avatar-preview");
        if (preview) preview.innerHTML = `<img src="${state.profileAvatarDraft}" alt="Profil rasmi" />`;
      }
    };
    reader.readAsDataURL(file);
  }
});

document.addEventListener("input", (event) => {
  const action = event.target.dataset.action;
  if (action === "course-search") {
    state.courseQuery = event.target.value;
    render();
  }
  if (action === "lesson-search") {
    state.lessonQuery = event.target.value;
    render();
  }
});

document.addEventListener("submit", async (event) => {
  const form = event.target;
  event.preventDefault();
  const data = Object.fromEntries(new FormData(form).entries());

  try {
    if (form.id === "auth-form") {
      if (state.authMode === "signup") {
        const response = await api("/api/auth/register", {
          method: "POST",
          body: JSON.stringify({
            name: data.name,
            email: data.email,
            password: data.password,
            role: state.roleDraft,
            avatar: state.avatarDraft
          })
        });
        state.token = response.token;
        localStorage.setItem("bb_token", state.token);
        applyDashboard(response.dashboard || response);
        state.view = "dashboard";
        toast("Akkaunt yaratildi");
        render();
      } else {
        await login(data.email, data.password);
      }
    }

    if (form.id === "join-class-form") {
      const response = await api("/api/classrooms/join", {
        method: "POST",
        body: JSON.stringify({ code: data.code })
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = response.classroom.id;
      state.view = "classroom";
      toast("Classroomga qo'shildingiz");
      render();
    }

    if (form.id === "create-class-form") {
      const response = await api("/api/classrooms", {
        method: "POST",
        body: JSON.stringify(data)
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = response.classroom.id;
      state.view = "classroom";
      toast(`Classroom yaratildi: ${response.classroom.joinCode}`);
      render();
    }

    if (form.id === "lesson-form") {
      const response = await api("/api/lessons", {
        method: "POST",
        body: JSON.stringify(data)
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = data.classroomId;
      state.view = "classroom";
      state.classroomTab = "lessons";
      toast("Dars yuklandi");
      render();
    }

    if (form.id === "test-create-form") {
      const question = {
        type: data.type,
        prompt: data.prompt,
        options: data.type === "multiple" ? String(data.options || "").split(",").map((item) => item.trim()).filter(Boolean) : undefined,
        answer: data.answer
      };
      const response = await api("/api/tests", {
        method: "POST",
        body: JSON.stringify({
          classroomId: data.classroomId,
          title: data.title,
          timedMinutes: Number(data.timedMinutes || 20),
          questions: [question]
        })
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = data.classroomId;
      state.view = "classroom";
      state.classroomTab = "tests";
      toast("Test yaratildi");
      render();
    }

    if (form.id === "homework-form") {
      const response = await api("/api/homework", {
        method: "POST",
        body: JSON.stringify(data)
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = data.classroomId;
      state.view = "classroom";
      state.classroomTab = "homework";
      toast("Vazifa qo'shildi");
      render();
    }

    if (form.id === "live-form") {
      const response = await api("/api/live/schedule", {
        method: "POST",
        body: JSON.stringify(data)
      });
      applyDashboard(response.dashboard);
      state.selectedClassroomId = data.classroomId;
      state.view = "live";
      toast("Live dars rejalandi");
      render();
    }

    if (form.id === "chat-form") {
      const response = await api("/api/chat", {
        method: "POST",
        body: JSON.stringify(data)
      });
      applyDashboard(response.dashboard);
      toast("Xabar yuborildi");
      render();
    }

    if (form.id === "profile-form") {
      const response = await api("/api/profile", {
        method: "PATCH",
        body: JSON.stringify({
          name: data.name,
          bio: data.bio,
          language: data.language,
          avatar: state.profileAvatarDraft || state.user.avatar || ""
        })
      });
      applyDashboard(response.dashboard);
      setLanguage(data.language);
      state.profileAvatarDraft = "";
      toast("Profil yangilandi");
      render();
    }

    if (form.id === "assistant-form") {
      const text = data.text.trim();
      state.assistantMessages.push({ from: "user", text });
      state.assistantMessages.push({ from: "ai", text: assistantReply(text) });
      form.reset();
      renderAssistant();
    }

    if (form.dataset.testForm) {
      const classroomId = data.classroomId;
      const testId = data.testId;
      const answers = { ...data };
      delete answers.classroomId;
      delete answers.testId;
      const response = await api("/api/tests/submit", {
        method: "POST",
        body: JSON.stringify({ classroomId, testId, answers })
      });
      applyDashboard(response.dashboard);
      toast(`Natija: ${response.result.score}%`);
      render();
    }
  } catch (error) {
    toast(error.message);
  }
});

function assistantReply(text) {
  const lower = text.toLowerCase();
  if (lower.includes("test") || lower.includes("quiz")) {
    return "Test uchun 3 bosqichli reja: dars konspektini 10 daqiqa ko'ring, 5 ta savolga javob bering, xatolaringizni alohida ro'yxat qiling.";
  }
  if (lower.includes("kurs") || lower.includes("course")) {
    return "Agar web yo'nalishini tanlasangiz HTML & CSS, JavaScript va React JS ketma-ketligi eng yaxshi start bo'ladi.";
  }
  if (lower.includes("ielts") || lower.includes("english")) {
    return "IELTS uchun daily streakni speaking 15 daqiqa, reading 20 daqiqa va writing 1 paragraf bilan saqlang.";
  }
  if (lower.includes("class")) {
    return "Classroom ichida Lessons, Homework, Tests va Chat tablari orqali barcha ishni boshqarishingiz mumkin. Join code namunasi: BINARY7.";
  }
  return "Bugun kichik, lekin aniq maqsad tanlang: bitta dars, bitta quiz va bitta amaliy vazifa. Men sizga keyingi qadamni ajratib beraman.";
}

init();
