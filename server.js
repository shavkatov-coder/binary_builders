const http = require("http");
const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const PORT = Number(process.env.PORT || 3000);
const PUBLIC_DIR = path.join(__dirname, "public");
const DATA_DIR = path.join(__dirname, "data");
const DB_FILE = path.join(DATA_DIR, "db.json");
const SECRET = process.env.BINARY_BUILDER_SECRET || "binary-builder-local-secret";

function id(prefix) {
  return `${prefix}_${crypto.randomBytes(8).toString("hex")}`;
}

function nowISO() {
  return new Date().toISOString();
}

function hashPassword(password, salt = crypto.randomBytes(16).toString("hex")) {
  const hash = crypto.pbkdf2Sync(password, salt, 120000, 32, "sha256").toString("hex");
  return { salt, hash };
}

function verifyPassword(password, salt, expectedHash) {
  const { hash } = hashPassword(password, salt);
  return crypto.timingSafeEqual(Buffer.from(hash), Buffer.from(expectedHash));
}

function base64url(value) {
  return Buffer.from(value).toString("base64url");
}

function signToken(userId) {
  const payload = base64url(JSON.stringify({ userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 14 }));
  const signature = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  return `${payload}.${signature}`;
}

function verifyToken(token) {
  if (!token || !token.includes(".")) return null;
  const [payload, signature] = token.split(".");
  const expected = crypto.createHmac("sha256", SECRET).update(payload).digest("base64url");
  if (signature.length !== expected.length) return null;
  if (!crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, "base64url").toString("utf8"));
    if (!data.exp || data.exp < Date.now()) return null;
    return data.userId;
  } catch {
    return null;
  }
}

const courseBlueprints = [
  ["html-css", "HTML & CSS", "Web foundations", "Boshlang'ich", "Build clean pages, layouts, forms and responsive interfaces.", "#38bdf8", "#8b5cf6"],
  ["javascript", "JavaScript", "Programming", "O'rta", "Master modern JavaScript, browser APIs and interactive web logic.", "#facc15", "#22c55e"],
  ["python", "Python", "Programming", "Boshlang'ich", "Learn Python syntax, automation, data structures and real projects.", "#60a5fa", "#f59e0b"],
  ["ai-basics", "AI Asoslari", "Artificial intelligence", "Boshlang'ich", "Understand prompts, models, ethics and everyday AI workflows.", "#a78bfa", "#06b6d4"],
  ["web-design", "Web Design", "Design", "O'rta", "Create visual systems, landing pages, grids and polished web products.", "#fb7185", "#38bdf8"],
  ["graphic-design", "Graphic Design", "Design", "Boshlang'ich", "Work with composition, color, brand kits and digital graphics.", "#f97316", "#ec4899"],
  ["math-logic", "Matematik Mantiq", "STEM", "O'rta", "Train propositions, proofs, sets, functions and logical thinking.", "#14b8a6", "#6366f1"],
  ["ielts-english", "IELTS English", "Language", "O'rta", "Practice reading, writing, listening and speaking for IELTS success.", "#22c55e", "#0ea5e9"],
  ["german-a1-a2", "Nemis tili A1-A2", "Language", "Boshlang'ich", "Learn German grammar, vocabulary and daily communication.", "#facc15", "#ef4444"],
  ["data-science", "Data Science", "Data", "Yuqori", "Analyze data, visualize insights and build machine learning basics.", "#06b6d4", "#8b5cf6"],
  ["react-js", "React JS", "Frontend", "O'rta", "Build component systems, hooks, routing and production dashboards.", "#38bdf8", "#111827"],
  ["cyber-security", "Cyber Security", "Security", "O'rta", "Learn security hygiene, threats, encryption and safe web practices.", "#ef4444", "#475569"],
  ["ui-ux-design", "UI/UX Design", "Product design", "O'rta", "Research users, prototype flows and design delightful interfaces.", "#c084fc", "#10b981"],
  ["public-speaking", "Public Speaking", "Soft skills", "Boshlang'ich", "Build confidence, structure talks and present ideas clearly.", "#f43f5e", "#f59e0b"],
  ["excel", "Excel", "Productivity", "Boshlang'ich", "Use formulas, tables, dashboards and data cleaning in Excel.", "#22c55e", "#0f766e"],
  ["freelancing", "Freelancing", "Career", "Boshlang'ich", "Create offers, manage clients, price work and deliver professionally.", "#8b5cf6", "#fb7185"],
  ["mobile-app", "Mobile App Development", "Mobile", "O'rta", "Plan, design and build mobile app interfaces and logic.", "#0ea5e9", "#f97316"],
  ["problem-solving", "Problem Solving", "Thinking", "O'rta", "Solve complex problems with systems thinking and practical frameworks.", "#84cc16", "#14b8a6"],
  ["algorithms", "Algoritmlar", "Computer science", "Yuqori", "Study complexity, sorting, searching, recursion and graph thinking.", "#6366f1", "#22d3ee"],
  ["career-skills", "Career Skills", "Career", "Boshlang'ich", "Write resumes, prepare interviews and build a strong digital profile.", "#f59e0b", "#2563eb"]
];

function buildCourses() {
  return courseBlueprints.map(([slug, title, category, level, summary, from, to], index) => ({
    id: slug,
    title,
    category,
    level,
    summary,
    accent: { from, to },
    duration: `${4 + (index % 5)} hafta`,
    lessonsCount: 12 + (index % 6),
    rating: Number((4.72 + (index % 4) * 0.05).toFixed(2)),
    students: 1200 + index * 317,
    xp: 900 + index * 70,
    certificate: true,
    lessons: [
      {
        id: `${slug}-intro`,
        title: `${title}: start va roadmap`,
        type: "Matn",
        minutes: 18,
        body: `${title} kursida maqsad, amaliy loyiha va haftalik o'qish rejasi bilan tanishasiz.`
      },
      {
        id: `${slug}-practice`,
        title: "Amaliy laboratoriya",
        type: "Video",
        minutes: 32,
        body: "Real vazifa ustida ishlab, bilimni darhol amaliyotga aylantirasiz."
      },
      {
        id: `${slug}-quiz`,
        title: "Mini quiz",
        type: "Quiz",
        minutes: 10,
        body: "Asosiy tushunchalar bo'yicha tezkor tekshiruv."
      },
      {
        id: `${slug}-project`,
        title: "Portfolio topshirig'i",
        type: "Project",
        minutes: 45,
        body: "Kurs yakunida namoyish qilish mumkin bo'lgan loyiha yaratasiz."
      }
    ],
    finalTest: {
      timeLimit: 20,
      questions: [
        {
          id: `${slug}-q1`,
          type: "multiple",
          prompt: `${title} kursida eng muhim odat qaysi?`,
          options: ["Har kuni kichik amaliyot qilish", "Faqat video ko'rish", "Natijani tekshirmaslik", "Rejasiz o'qish"],
          answer: "Har kuni kichik amaliyot qilish"
        },
        {
          id: `${slug}-q2`,
          type: "truefalse",
          prompt: "Progressni o'lchash o'quv motivatsiyasini oshiradi.",
          answer: "True"
        },
        {
          id: `${slug}-q3`,
          type: "short",
          prompt: "Kurs yakunidagi asosiy hujjat nima?",
          answer: "sertifikat"
        }
      ]
    }
  }));
}

function publicUser(user) {
  if (!user) return null;
  const { passwordHash, passwordSalt, ...safe } = user;
  return safe;
}

function seedDatabase() {
  const studentPassword = hashPassword("binary123", "student-demo-salt");
  const teacherPassword = hashPassword("binary123", "teacher-demo-salt");
  return {
    users: [
      {
        id: "u_student",
        role: "student",
        name: "Dilshod Rahimov",
        email: "student@binary.uz",
        passwordSalt: studentPassword.salt,
        passwordHash: studentPassword.hash,
        avatar: "",
        bio: "Frontend va AI bo'yicha o'quvchi",
        xp: 8420,
        streak: 18,
        badges: ["Fast Learner", "Quiz Master", "Code Sprint"],
        language: "uz",
        createdAt: nowISO()
      },
      {
        id: "u_teacher",
        role: "teacher",
        name: "Aziza Karimova",
        email: "teacher@binary.uz",
        passwordSalt: teacherPassword.salt,
        passwordHash: teacherPassword.hash,
        avatar: "",
        bio: "Senior mentor, web va product design",
        xp: 15300,
        streak: 41,
        badges: ["Mentor Pro", "Live Star", "Top Creator"],
        language: "uz",
        createdAt: nowISO()
      }
    ],
    courses: buildCourses(),
    classrooms: [
      {
        id: "class_frontend",
        title: "Frontend Intensive",
        subject: "HTML, CSS, JavaScript",
        teacherId: "u_teacher",
        joinCode: "BINARY7",
        accent: "#38bdf8",
        createdAt: nowISO(),
        students: ["u_student"],
        announcements: [
          {
            id: "ann_1",
            title: "Haftalik sprint boshlandi",
            text: "Bu hafta responsive layout va dark mode ustida ishlaymiz.",
            createdAt: nowISO()
          }
        ],
        lessons: [
          {
            id: "lesson_1",
            type: "YouTube",
            title: "CSS Grid va Flexbox",
            body: "Amaliy dars: dashboard layout qurish.",
            url: "https://www.youtube.com/embed/jV8B24rSN5o",
            createdAt: nowISO()
          },
          {
            id: "lesson_2",
            type: "PDF",
            title: "Design system checklist",
            body: "Spacing, rang, typography va component state bo'yicha qo'llanma.",
            url: "",
            createdAt: nowISO()
          }
        ],
        homework: [
          {
            id: "hw_1",
            title: "Portfolio homepage",
            due: "2026-05-10",
            status: "open",
            points: 100
          }
        ],
        tests: [
          {
            id: "test_1",
            title: "CSS Fundamentals",
            timedMinutes: 15,
            questions: [
              {
                id: "t1_q1",
                type: "multiple",
                prompt: "Responsive dizaynda qaysi birlik ko'p ishlatiladi?",
                options: ["rem", "kg", "ms", "volt"],
                answer: "rem"
              },
              {
                id: "t1_q2",
                type: "truefalse",
                prompt: "Media query turli ekranlar uchun stil yozishga yordam beradi.",
                answer: "True"
              }
            ]
          }
        ],
        live: {
          title: "Live UI Review",
          scheduledAt: "2026-05-05T15:00:00+05:00",
          room: "bb-live-frontend",
          attendance: ["u_student"]
        },
        chat: [
          {
            id: "chat_1",
            userId: "u_teacher",
            name: "Aziza Karimova",
            text: "Bugungi darsda layoutni premium ko'rinishga keltiramiz.",
            createdAt: nowISO()
          }
        ],
        grades: [
          { studentId: "u_student", label: "CSS Fundamentals", score: 92 },
          { studentId: "u_student", label: "Portfolio homepage", score: 88 }
        ]
      }
    ],
    enrollments: [
      { userId: "u_student", courseId: "html-css", progress: 82, xp: 1120, lastLesson: "CSS Grid va Flexbox" },
      { userId: "u_student", courseId: "javascript", progress: 64, xp: 890, lastLesson: "DOM events" },
      { userId: "u_student", courseId: "ai-basics", progress: 38, xp: 520, lastLesson: "Prompt frameworks" },
      { userId: "u_student", courseId: "ielts-english", progress: 71, xp: 740, lastLesson: "Writing Task 2" }
    ],
    submissions: [
      { id: "sub_1", userId: "u_student", testId: "test_1", classroomId: "class_frontend", score: 92, createdAt: nowISO() }
    ],
    certificates: [
      {
        id: "cert_demo",
        userId: "u_student",
        courseId: "html-css",
        courseTitle: "HTML & CSS",
        name: "Dilshod Rahimov",
        issuedAt: "2026-04-28",
        qr: "BB-HTMLCSS-DILSHOD-2026"
      }
    ],
    notifications: [
      {
        id: "note_1",
        audience: "student",
        text: "Frontend Intensive live darsi 5-may kuni 15:00 da.",
        createdAt: nowISO()
      },
      {
        id: "note_2",
        audience: "teacher",
        text: "3 ta o'quvchi sertifikat uchun final testga yaqin.",
        createdAt: nowISO()
      }
    ]
  };
}

function loadDB() {
  if (!fs.existsSync(DB_FILE)) return seedDatabase();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

function saveDB(db) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  fs.writeFileSync(DB_FILE, JSON.stringify(db, null, 2));
}

function send(res, status, data, headers = {}) {
  const body = typeof data === "string" ? data : JSON.stringify(data);
  res.writeHead(status, {
    "Content-Type": typeof data === "string" ? "text/plain; charset=utf-8" : "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    ...headers
  });
  res.end(body);
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let raw = "";
    req.on("data", (chunk) => {
      raw += chunk;
      if (raw.length > 12 * 1024 * 1024) {
        reject(new Error("Request too large"));
        req.destroy();
      }
    });
    req.on("end", () => {
      if (!raw) return resolve({});
      try {
        resolve(JSON.parse(raw));
      } catch {
        reject(new Error("Invalid JSON"));
      }
    });
    req.on("error", reject);
  });
}

function authenticate(req, db) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : "";
  const userId = verifyToken(token);
  return db.users.find((user) => user.id === userId) || null;
}

function dashboardFor(db, user) {
  const classrooms =
    user.role === "teacher"
      ? db.classrooms.filter((item) => item.teacherId === user.id)
      : db.classrooms.filter((item) => item.students.includes(user.id));
  const enrollments = db.enrollments
    .filter((item) => item.userId === user.id)
    .map((enrollment) => ({
      ...enrollment,
      course: db.courses.find((course) => course.id === enrollment.courseId)
    }));
  const notifications = db.notifications.filter(
    (item) => item.userId === user.id || item.audience === user.role || item.audience === "all"
  );
  const submissions = db.submissions.filter((item) => item.userId === user.id);
  const certificates = db.certificates.filter((item) => item.userId === user.id);
  const leaderboard = db.users
    .filter((item) => item.role === "student")
    .map((item) => ({ id: item.id, name: item.name, xp: item.xp || 0, streak: item.streak || 0 }))
    .sort((a, b) => b.xp - a.xp)
    .slice(0, 10);
  return {
    user: publicUser(user),
    courses: db.courses,
    classrooms,
    enrollments,
    notifications,
    submissions,
    certificates,
    leaderboard,
    stats: {
      activeCourses: enrollments.length,
      classrooms: classrooms.length,
      xp: user.xp || 0,
      streak: user.streak || 0,
      completion: Math.round(
        enrollments.reduce((total, item) => total + (item.progress || 0), 0) / Math.max(enrollments.length, 1)
      )
    }
  };
}

function requireFields(body, fields) {
  return fields.filter((field) => body[field] === undefined || body[field] === null || String(body[field]).trim() === "");
}

function generateJoinCode(db) {
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  do {
    code = Array.from({ length: 6 }, () => alphabet[Math.floor(Math.random() * alphabet.length)]).join("");
  } while (db.classrooms.some((item) => item.joinCode === code));
  return code;
}

function gradeSubmission(test, answers) {
  const questions = test.questions || [];
  let correct = 0;
  const review = questions.map((question) => {
    const given = String(answers?.[question.id] || "").trim();
    const expected = String(question.answer || "").trim();
    const ok = given.toLowerCase() === expected.toLowerCase();
    if (ok) correct += 1;
    return { questionId: question.id, given, expected, ok };
  });
  return {
    score: Math.round((correct / Math.max(questions.length, 1)) * 100),
    correct,
    total: questions.length,
    review
  };
}

async function handleApi(req, res, pathname) {
  const db = loadDB();
  const body = req.method === "GET" ? {} : await readBody(req);

  if (req.method === "GET" && pathname === "/api/health") {
    return send(res, 200, { ok: true, app: "Binary Builder", time: nowISO() });
  }

  if (req.method === "GET" && pathname === "/api/bootstrap") {
    return send(res, 200, {
      courses: db.courses,
      stats: {
        courses: db.courses.length,
        learners: db.users.filter((user) => user.role === "student").length + 28400,
        classrooms: db.classrooms.length + 420,
        certificates: db.certificates.length + 9100
      }
    });
  }

  if (req.method === "POST" && pathname === "/api/auth/register") {
    const missing = requireFields(body, ["name", "email", "password", "role"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const email = String(body.email).toLowerCase().trim();
    if (!["student", "teacher"].includes(body.role)) return send(res, 400, { error: "Role noto'g'ri" });
    if (db.users.some((user) => user.email.toLowerCase() === email)) {
      return send(res, 409, { error: "Bu email allaqachon ro'yxatdan o'tgan" });
    }
    const password = hashPassword(String(body.password));
    const user = {
      id: id("user"),
      role: body.role,
      name: String(body.name).trim(),
      email,
      passwordSalt: password.salt,
      passwordHash: password.hash,
      avatar: body.avatar || "",
      bio: body.role === "teacher" ? "Binary Builder mentori" : "Binary Builder o'quvchisi",
      xp: 100,
      streak: 1,
      badges: body.role === "teacher" ? ["New Mentor"] : ["Starter"],
      language: "uz",
      createdAt: nowISO()
    };
    db.users.push(user);
    saveDB(db);
    return send(res, 201, { token: signToken(user.id), user: publicUser(user), dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/auth/login") {
    const missing = requireFields(body, ["email", "password"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const user = db.users.find((item) => item.email.toLowerCase() === String(body.email).toLowerCase().trim());
    if (!user || !verifyPassword(String(body.password), user.passwordSalt, user.passwordHash)) {
      return send(res, 401, { error: "Email yoki parol noto'g'ri" });
    }
    return send(res, 200, { token: signToken(user.id), user: publicUser(user), dashboard: dashboardFor(db, user) });
  }

  const user = authenticate(req, db);
  if (!user) return send(res, 401, { error: "Avval tizimga kiring" });

  if (req.method === "GET" && pathname === "/api/me") {
    return send(res, 200, dashboardFor(db, user));
  }

  if (req.method === "PATCH" && pathname === "/api/profile") {
    ["name", "bio", "avatar", "language"].forEach((field) => {
      if (body[field] !== undefined) user[field] = String(body[field]);
    });
    saveDB(db);
    return send(res, 200, { user: publicUser(user), dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/classrooms") {
    if (user.role !== "teacher") return send(res, 403, { error: "Faqat o'qituvchi classroom ochadi" });
    const missing = requireFields(body, ["title", "subject"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = {
      id: id("class"),
      title: String(body.title).trim(),
      subject: String(body.subject).trim(),
      teacherId: user.id,
      joinCode: generateJoinCode(db),
      accent: body.accent || "#38bdf8",
      createdAt: nowISO(),
      students: [],
      announcements: [],
      lessons: [],
      homework: [],
      tests: [],
      live: null,
      chat: [],
      grades: []
    };
    db.classrooms.unshift(classroom);
    saveDB(db);
    return send(res, 201, { classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/classrooms/join") {
    const missing = requireFields(body, ["code"]);
    if (missing.length) return send(res, 400, { error: "Join code kerak" });
    const classroom = db.classrooms.find((item) => item.joinCode.toLowerCase() === String(body.code).toLowerCase().trim());
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    if (!classroom.students.includes(user.id) && classroom.teacherId !== user.id) classroom.students.push(user.id);
    saveDB(db);
    return send(res, 200, { classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/lessons") {
    if (user.role !== "teacher") return send(res, 403, { error: "Faqat o'qituvchi dars yuklaydi" });
    const missing = requireFields(body, ["classroomId", "type", "title"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId && item.teacherId === user.id);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    const lesson = {
      id: id("lesson"),
      type: String(body.type),
      title: String(body.title).trim(),
      body: body.body || "",
      url: body.url || "",
      createdAt: nowISO()
    };
    classroom.lessons.unshift(lesson);
    saveDB(db);
    return send(res, 201, { lesson, classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/tests") {
    if (user.role !== "teacher") return send(res, 403, { error: "Faqat o'qituvchi test yaratadi" });
    const missing = requireFields(body, ["classroomId", "title"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId && item.teacherId === user.id);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    const questions = Array.isArray(body.questions) && body.questions.length
      ? body.questions.map((question, index) => ({
          id: question.id || id(`q${index}`),
          type: question.type || "multiple",
          prompt: question.prompt || `Savol ${index + 1}`,
          options: question.options || ["A", "B", "C", "D"],
          answer: question.answer || ""
        }))
      : [
          {
            id: id("q"),
            type: "multiple",
            prompt: "Binary Builder test savoli",
            options: ["To'g'ri javob", "Variant B", "Variant C", "Variant D"],
            answer: "To'g'ri javob"
          }
        ];
    const test = {
      id: id("test"),
      title: String(body.title).trim(),
      timedMinutes: Number(body.timedMinutes || 20),
      questions
    };
    classroom.tests.unshift(test);
    saveDB(db);
    return send(res, 201, { test, classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/homework") {
    if (user.role !== "teacher") return send(res, 403, { error: "Faqat o'qituvchi vazifa beradi" });
    const missing = requireFields(body, ["classroomId", "title", "due"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId && item.teacherId === user.id);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    const homework = {
      id: id("hw"),
      title: String(body.title).trim(),
      due: String(body.due),
      status: "open",
      points: Number(body.points || 100)
    };
    classroom.homework.unshift(homework);
    saveDB(db);
    return send(res, 201, { homework, classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/tests/submit") {
    const missing = requireFields(body, ["classroomId", "testId"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    const test = classroom.tests.find((item) => item.id === body.testId);
    if (!test) return send(res, 404, { error: "Test topilmadi" });
    const result = gradeSubmission(test, body.answers || {});
    const submission = {
      id: id("sub"),
      userId: user.id,
      classroomId: classroom.id,
      testId: test.id,
      testTitle: test.title,
      score: result.score,
      review: result.review,
      createdAt: nowISO()
    };
    db.submissions.unshift(submission);
    classroom.grades = classroom.grades.filter(
      (item) => !(item.studentId === user.id && item.label === test.title)
    );
    classroom.grades.push({ studentId: user.id, label: test.title, score: result.score });
    user.xp = (user.xp || 0) + Math.max(40, result.score);
    saveDB(db);
    return send(res, 201, { submission, result, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/courses/complete") {
    const missing = requireFields(body, ["courseId"]);
    if (missing.length) return send(res, 400, { error: "courseId kerak" });
    const course = db.courses.find((item) => item.id === body.courseId);
    if (!course) return send(res, 404, { error: "Kurs topilmadi" });
    let enrollment = db.enrollments.find((item) => item.userId === user.id && item.courseId === course.id);
    if (!enrollment) {
      enrollment = { userId: user.id, courseId: course.id, progress: 0, xp: 0, lastLesson: "Final test" };
      db.enrollments.push(enrollment);
    }
    enrollment.progress = 100;
    enrollment.xp = (enrollment.xp || 0) + course.xp;
    user.xp = (user.xp || 0) + course.xp;
    let certificate = db.certificates.find((item) => item.userId === user.id && item.courseId === course.id);
    if (!certificate) {
      certificate = {
        id: id("cert"),
        userId: user.id,
        courseId: course.id,
        courseTitle: course.title,
        name: user.name,
        issuedAt: new Date().toISOString().slice(0, 10),
        qr: `BB-${course.id.toUpperCase()}-${user.id.toUpperCase()}`
      };
      db.certificates.unshift(certificate);
    }
    saveDB(db);
    return send(res, 201, { certificate, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/chat") {
    const missing = requireFields(body, ["classroomId", "text"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    if (classroom.teacherId !== user.id && !classroom.students.includes(user.id)) {
      return send(res, 403, { error: "Bu class sizga tegishli emas" });
    }
    const message = {
      id: id("chat"),
      userId: user.id,
      name: user.name,
      text: String(body.text).trim(),
      createdAt: nowISO()
    };
    classroom.chat.push(message);
    saveDB(db);
    return send(res, 201, { message, classroom, dashboard: dashboardFor(db, user) });
  }

  if (req.method === "POST" && pathname === "/api/live/schedule") {
    if (user.role !== "teacher") return send(res, 403, { error: "Faqat o'qituvchi live dars rejalaydi" });
    const missing = requireFields(body, ["classroomId", "title", "scheduledAt"]);
    if (missing.length) return send(res, 400, { error: `${missing.join(", ")} kerak` });
    const classroom = db.classrooms.find((item) => item.id === body.classroomId && item.teacherId === user.id);
    if (!classroom) return send(res, 404, { error: "Classroom topilmadi" });
    classroom.live = {
      title: String(body.title).trim(),
      scheduledAt: String(body.scheduledAt),
      room: body.room || id("room"),
      attendance: []
    };
    saveDB(db);
    return send(res, 201, { live: classroom.live, classroom, dashboard: dashboardFor(db, user) });
  }

  return send(res, 404, { error: "API route topilmadi" });
}

const contentTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "application/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon"
};

function serveStatic(req, res, pathname) {
  const requested = pathname === "/" ? "/index.html" : decodeURIComponent(pathname);
  let filePath = path.normalize(path.join(PUBLIC_DIR, requested));
  if (!filePath.startsWith(PUBLIC_DIR)) return send(res, 403, "Forbidden");
  if (!fs.existsSync(filePath) || fs.statSync(filePath).isDirectory()) {
    filePath = path.join(PUBLIC_DIR, "index.html");
  }
  const ext = path.extname(filePath);
  res.writeHead(200, {
    "Content-Type": contentTypes[ext] || "application/octet-stream",
    "Cache-Control": ext === ".html" ? "no-store" : "public, max-age=3600"
  });
  fs.createReadStream(filePath).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const pathname = url.pathname;
  try {
    if (pathname.startsWith("/api/")) {
      return await handleApi(req, res, pathname);
    }
    return serveStatic(req, res, pathname);
  } catch (error) {
    return send(res, 500, { error: error.message || "Server xatosi" });
  }
});

server.listen(PORT, () => {
  console.log(`Binary Builder running at http://localhost:${PORT}`);
});
