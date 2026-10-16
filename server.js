/**
 * ============================================
 *  BAD SHAHI MOSQUE — Animated Travel Guide
 *  Node.js + Express (static host)
 * ============================================
 */
const express = require("express");
const cors = require("cors");
const path = require("path");

const app = express();
const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, "public");

// ---------- Middleware ----------
app.use(cors());
app.use(express.static(PUBLIC_DIR, { extensions: ["html"] }));

// ---------- Health check ----------
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    service: "Badshahi Mosque — Animated Travel Guide",
    place: "Badshahi Mosque, Walled City of Lahore, Pakistan",
    time: new Date().toISOString(),
  });
});

// Fallback → serve the single-page app
app.get("*", (req, res) => {
  res.sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ---------- Start ----------
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  // Serverless hosts (Vercel) handle the server — just export the app
  module.exports = app;
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🕌 Badshahi Mosque guide running at http://0.0.0.0:${PORT}`);
  });
}
