/**
 * ============================================
 *  SHAHVEER CODER — Portfolio Backend API
 *  Node.js + Express
 * ============================================
 */
const express = require("express");
const cors = require("cors");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, "data");

// On serverless hosts (Vercel) the filesystem is read-only — write messages to /tmp
const IS_SERVERLESS = !!process.env.VERCEL || !!process.env.AWS_LAMBDA_FUNCTION_NAME;
const WRITE_DIR = IS_SERVERLESS ? "/tmp" : DATA_DIR;
const MESSAGES_FILE = path.join(WRITE_DIR, "messages.json");

// ---------- Middleware ----------
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

// Ensure write dir + messages file exist
try {
  if (!fs.existsSync(WRITE_DIR)) fs.mkdirSync(WRITE_DIR, { recursive: true });
  if (!fs.existsSync(MESSAGES_FILE)) fs.writeFileSync(MESSAGES_FILE, "[]");
} catch (e) {
  console.warn("Could not prepare messages file:", e.message);
}

// ---------- Helpers ----------
const readJSON = (file, fallback = []) => {
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return fallback;
  }
};
const writeJSON = (file, data) =>
  fs.writeFileSync(file, JSON.stringify(data, null, 2));

// ============================================
//  API ROUTES
// ============================================

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", service: "Shahveer Coder API", time: new Date().toISOString() });
});

// --- Profile / About ---
app.get("/api/profile", (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "profile.json"), {}));
});

// --- Services ---
app.get("/api/services", (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "services.json")));
});

// --- Projects ---
app.get("/api/projects", (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "projects.json")));
});

// --- Skills ---
app.get("/api/skills", (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "skills.json")));
});

// --- Testimonials ---
app.get("/api/testimonials", (req, res) => {
  res.json(readJSON(path.join(DATA_DIR, "testimonials.json")));
});

// --- Contact form: save message ---
app.post("/api/contact", (req, res) => {
  const { name, email, subject, message, budget } = req.body || {};

  // Validation
  if (!name || !email || !message) {
    return res.status(400).json({
      success: false,
      error: "Name, email and message are required.",
    });
  }
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ success: false, error: "Invalid email address." });
  }

  const messages = readJSON(MESSAGES_FILE);
  const newMessage = {
    id: Date.now(),
    name: String(name).slice(0, 100),
    email: String(email).slice(0, 100),
    subject: String(subject || "No subject").slice(0, 200),
    budget: String(budget || "Not specified").slice(0, 50),
    message: String(message).slice(0, 2000),
    receivedAt: new Date().toISOString(),
    read: false,
  };
  messages.push(newMessage);
  writeJSON(MESSAGES_FILE, messages);

  res.status(201).json({
    success: true,
    message: "Thanks! Your message has been received. I'll get back to you within 24 hours.",
    id: newMessage.id,
  });
});

// --- Admin: view all messages (simple inbox) ---
app.get("/api/messages", (req, res) => {
  res.json(readJSON(MESSAGES_FILE));
});

// --- Stats ---
app.get("/api/stats", (req, res) => {
  const projects = readJSON(path.join(DATA_DIR, "projects.json"));
  const testimonials = readJSON(path.join(DATA_DIR, "testimonials.json"));
  res.json({
    projectsCompleted: projects.length,
    happyClients: testimonials.length,
    yearsExperience: 2,
    technologies: 12,
  });
});

// Fallback → serve frontend
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// ---------- Start ----------
if (IS_SERVERLESS) {
  // Vercel handles the server — just export the app
  module.exports = app;
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 Shahveer Coder Portfolio running at http://0.0.0.0:${PORT}`);
  });
}
