/**
 * ============================================
 *  POWER HOUSE GYM — DHA Phase 3, Lahore
 *  Node.js + Express (multi-page static host)
 * ============================================
 */
const express = require("express");
const cors = require("cors");
const path = require("path");
const fs = require("fs");

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
    service: "Power House Gym — DHA Phase 3, Lahore",
    place: "2nd Floor, Building #179, W Street 13, above ChenOne, Sector Y, DHA Phase 3, Lahore, Pakistan",
    phone: "+92 321 7593916",
    time: new Date().toISOString(),
  });
});

// ---------- Fallback: real page if it exists, else home ----------
app.get("*", (req, res) => {
  const candidate = path.join(PUBLIC_DIR, req.path);
  if (req.path !== "/" && fs.existsSync(candidate) && fs.statSync(candidate).isFile()) {
    return res.sendFile(candidate);
  }
  res.status(404).sendFile(path.join(PUBLIC_DIR, "index.html"));
});

// ---------- Start ----------
if (process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME) {
  module.exports = app;
} else {
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🏋️  Power House Gym running at http://0.0.0.0:${PORT}`);
  });
}
