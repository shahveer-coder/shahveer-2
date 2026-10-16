# 🚀 Shahveer Coder — Freelance Portfolio Website

A complete, modern **Full Stack Developer portfolio** with a working **Node.js + Express backend API** — built for freelancing & earning.

![Node](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/License-MIT-blue) ![Status](https://img.shields.io/badge/Status-Live-brightgreen)

## 🕌 Badshahi Mosque — Animated Travel Guide

A second, fully animated site lives at **`/destination/`** — a cinematic guide to the
Badshahi Mosque, Lahore (built 1671–1673 by Emperor Aurangzeb Alamgir).

| | |
| --- | --- |
| **Stack** | HTML + CSS + GSAP 3 (ScrollTrigger) + Lenis smooth scroll, no build step |
| **Animations** | SVG preloader, custom cursor, masked hero reveal, scroll-scrubbed word highlight, vertical timeline, count-up stats, pinned horizontal gallery, lightbox, accordion, magnetic buttons, parallax |
| **Design** | Ink / sandstone / marble / gold palette, WCAG-conscious contrast, `prefers-reduced-motion` support |
| **Content** | History timeline, architecture breakdown, visitor guide (hours, entry, dress code), OpenStreetMap embed, nearby sights |

```bash
npm start
# portfolio  → http://localhost:3000
# mosque     → http://localhost:3000/destination/
```

## ✨ Features

- 🎨 Modern dark-theme responsive design (mobile-first)
- ⌨️ Animated typing hero, scroll reveal animations, animated skill bars
- 🧩 All content served from a **real backend API** (easy to update via JSON files)
- 📨 Working **contact form** — messages are validated & saved server-side
- 📊 Stats, services with pricing, projects, skills & client testimonials
- 🔍 SEO meta tags ready

## 🛠️ Tech Stack

| Layer    | Tech                          |
| -------- | ----------------------------- |
| Frontend | HTML5, CSS3, Vanilla JS       |
| Backend  | Node.js, Express              |
| Storage  | JSON file storage (no DB needed) |

## 📡 API Endpoints

| Method | Endpoint            | Description                    |
| ------ | ------------------- | ------------------------------ |
| GET    | `/api/health`       | Health check                   |
| GET    | `/api/profile`      | Profile & social links         |
| GET    | `/api/services`     | Services with pricing          |
| GET    | `/api/projects`     | Portfolio projects             |
| GET    | `/api/skills`       | Skills with levels             |
| GET    | `/api/testimonials` | Client reviews                 |
| GET    | `/api/stats`        | Stats counters                 |
| POST   | `/api/contact`      | Submit contact form (validated)|
| GET    | `/api/messages`     | View received messages (inbox) |

## 🚀 Run Locally

```bash
npm install
npm start
# open http://localhost:3000
```

## ✏️ Customize

All content lives in the `data/` folder — edit these JSON files, no code changes needed:

- `data/profile.json` — your name, email, WhatsApp, social links
- `data/services.json` — services & prices
- `data/projects.json` — your projects
- `data/skills.json` — skills & levels
- `data/testimonials.json` — client reviews

Contact form messages are saved to `data/messages.json`.

## 🌍 Deploy Free

Works out of the box on **Render**, **Railway**, **Fly.io**, or any Node host:

1. Push to GitHub
2. Connect the repo on [render.com](https://render.com) → New Web Service
3. Build command: `npm install` · Start command: `npm start`

## 📄 License

MIT — free to use.

---

Built with ❤️ by **Shahveer Coder**
