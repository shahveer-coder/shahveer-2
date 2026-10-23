/**
 * Cafe Sierra — demo static site host
 * Serves the plain HTML/CSS/JS files from the repository root.
 * No build step required.
 */
const express = require("express");
const path = require("path");
const fs = require("fs");

const app = express();
const ROOT = __dirname;

// Serve static assets (css, js, images, html)
app.use(express.static(ROOT, { extensions: ["html"], maxAge: "1h" }));

// Extensionless URLs: /menu -> menu.html
app.get("*", (req, res) => {
  const clean = req.path.replace(/\/+$/, "") || "/";
  const candidates = [
    path.join(ROOT, clean + ".html"),
    path.join(ROOT, clean, "index.html"),
    path.join(ROOT, "index.html"),
  ];
  for (const file of candidates) {
    if (fs.existsSync(file) && fs.statSync(file).isFile()) {
      return res.sendFile(file);
    }
  }
  res.status(404).sendFile(path.join(ROOT, "index.html"));
});

if (process.env.VERCEL) {
  module.exports = app;
} else {
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, "0.0.0.0", () => console.log(`Cafe Sierra running on ${PORT}`));
}
