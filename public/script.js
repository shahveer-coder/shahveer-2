/* ============================================
   SHAHVEER CODER — Frontend Logic
   Fetches data from the backend API
   ============================================ */

const API = ""; // same origin

// ---------- Typing effect ----------
const roles = [
  "Web Developer",
  "Restaurant Website Specialist",
  "Node.js & API Developer",
  "Fast. Reliable. Affordable.",
];
const typingEl = document.getElementById("typingText");
let roleIdx = 0, charIdx = 0, deleting = false;

function typeLoop() {
  const current = roles[roleIdx];
  typingEl.textContent = current.slice(0, charIdx);
  if (!deleting) {
    charIdx++;
    if (charIdx > current.length) { deleting = true; setTimeout(typeLoop, 1600); return; }
  } else {
    charIdx--;
    if (charIdx === 0) { deleting = false; roleIdx = (roleIdx + 1) % roles.length; }
  }
  setTimeout(typeLoop, deleting ? 40 : 80);
}
typeLoop();

// ---------- Mobile menu ----------
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");
hamburger.addEventListener("click", () => navLinks.classList.toggle("open"));
navLinks.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => navLinks.classList.remove("open"))
);

// ---------- Footer year ----------
document.getElementById("year").textContent = new Date().getFullYear();

// ---------- Helpers ----------
async function fetchJSON(url) {
  try {
    const res = await fetch(API + url);
    if (!res.ok) throw new Error(res.status);
    return await res.json();
  } catch (e) {
    console.warn("API fetch failed:", url, e);
    return null;
  }
}

function reveal(el) {
  el.classList.add("reveal");
  observer.observe(el);
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        // animate skill bars
        entry.target.querySelectorAll(".skill-fill").forEach((bar) => {
          bar.style.width = bar.dataset.level + "%";
        });
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.15 }
);

// ---------- Load Stats ----------
(async () => {
  const stats = await fetchJSON("/api/stats");
  if (!stats) return;
  const items = [
    { num: stats.projectsCompleted + "+", label: "Projects Completed" },
    { num: stats.happyClients + "+", label: "Happy Clients" },
    { num: stats.yearsExperience + "+", label: "Years Experience" },
    { num: stats.technologies + "+", label: "Technologies" },
  ];
  const grid = document.getElementById("statsGrid");
  grid.innerHTML = items
    .map((s) => `<div><div class="stat-num">${s.num}</div><div class="stat-label">${s.label}</div></div>`)
    .join("");
})();

// ---------- Load Services ----------
(async () => {
  const services = await fetchJSON("/api/services");
  if (!services) return;
  const grid = document.getElementById("servicesGrid");
  grid.innerHTML = services
    .map(
      (s) => `
    <div class="card">
      <div class="icon">${s.icon}</div>
      <h3>${s.title}</h3>
      <p>${s.description}</p>
      <span class="price-tag">${s.price}</span>
    </div>`
    )
    .join("");
  grid.querySelectorAll(".card").forEach(reveal);
})();

// ---------- Load Projects ----------
(async () => {
  const projects = await fetchJSON("/api/projects");
  if (!projects) return;
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = projects
    .map(
      (p) => `
    <div class="card">
      <div class="project-emoji">${p.image}</div>
      <h3>${p.title}</h3>
      <p>${p.description}</p>
      <div class="tech-tags">${p.tech.map((t) => `<span>${t}</span>`).join("")}</div>
      ${p.link && p.link !== "#" ? `<a class="project-link" href="${p.link}" target="_blank" rel="noopener">View Live Site →</a>` : ""}
    </div>`
    )
    .join("");
  grid.querySelectorAll(".card").forEach(reveal);
})();

// ---------- Load Skills ----------
(async () => {
  const skills = await fetchJSON("/api/skills");
  if (!skills) return;
  const grid = document.getElementById("skillsGrid");
  grid.innerHTML = skills
    .map(
      (s) => `
    <div class="skill">
      <div class="skill-name"><span>${s.name}</span><span>${s.level}%</span></div>
      <div class="skill-bar"><div class="skill-fill" data-level="${s.level}"></div></div>
    </div>`
    )
    .join("");
  grid.querySelectorAll(".skill").forEach(reveal);
})();

// ---------- Load Testimonials ----------
(async () => {
  const testimonials = await fetchJSON("/api/testimonials");
  if (!testimonials) return;
  const grid = document.getElementById("testimonialsGrid");
  grid.innerHTML = testimonials
    .map(
      (t) => `
    <div class="card">
      <div class="stars">${"★".repeat(t.rating)}${"☆".repeat(5 - t.rating)}</div>
      <p>"${t.text}"</p>
      <div class="testi-author">${t.name}</div>
      <div class="testi-role">${t.role}</div>
    </div>`
    )
    .join("");
  grid.querySelectorAll(".card").forEach(reveal);
})();

// ---------- Load Profile → contact info + footer ----------
(async () => {
  const profile = await fetchJSON("/api/profile");
  if (!profile || !profile.name) return;

  document.getElementById("heroTagline").textContent = profile.tagline;

  const items = [
    { icon: "📧", label: "Email", value: profile.email, href: `mailto:${profile.email}` },
    { icon: "💬", label: "WhatsApp", value: profile.whatsapp, href: `https://wa.me/${(profile.whatsapp || "").replace(/[^0-9]/g, "")}` },
    { icon: "📍", label: "Location", value: profile.location, href: null },
  ];
  document.getElementById("contactItems").innerHTML = items
    .map((i) =>
      i.href
        ? `<a class="contact-item" href="${i.href}" target="_blank" rel="noopener"><span class="ci-icon">${i.icon}</span><span><div class="ci-label">${i.label}</div><strong>${i.value}</strong></span></a>`
        : `<div class="contact-item"><span class="ci-icon">${i.icon}</span><span><div class="ci-label">${i.label}</div><strong>${i.value}</strong></span></div>`
    )
    .join("");

  const social = profile.social || {};
  document.getElementById("footerSocial").innerHTML = Object.entries(social)
    .map(([k, v]) => `<a href="${v}" target="_blank" rel="noopener">${k.charAt(0).toUpperCase() + k.slice(1)}</a>`)
    .join("");
})();

// ---------- Contact form → POST /api/contact ----------
document.getElementById("contactForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const form = e.target;
  const btn = document.getElementById("submitBtn");
  const status = document.getElementById("formStatus");

  const payload = {
    name: form.name.value.trim(),
    email: form.email.value.trim(),
    subject: form.subject.value.trim(),
    budget: form.budget.value,
    message: form.message.value.trim(),
  };

  btn.disabled = true;
  btn.textContent = "Sending... ⏳";
  status.textContent = "";
  status.className = "form-status";

  try {
    const res = await fetch(API + "/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const data = await res.json();
    if (data.success) {
      status.textContent = "✅ " + data.message;
      status.classList.add("success");
      form.reset();
    } else {
      status.textContent = "❌ " + (data.error || "Something went wrong.");
      status.classList.add("error");
    }
  } catch {
    status.textContent = "❌ Could not reach the server. Please try again.";
    status.classList.add("error");
  }

  btn.disabled = false;
  btn.textContent = "Send Message 📨";
});

// ---------- Reveal sections ----------
document.querySelectorAll(".section-title, .contact-wrap").forEach(reveal);
