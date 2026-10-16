# 🕌 Badshahi Mosque, Lahore — Animated Travel Guide

An **animated single-page travel guide** to the Badshahi Mosque in the Walled City of Lahore —
the last great mosque of the Mughal Empire, raised in 1671–1673 by Emperor Aurangzeb Alamgir.

Built with **HTML + CSS + GSAP 3 (ScrollTrigger) + Lenis** smooth scroll. No build step, no
framework, no CDN dependency — the animation libraries are vendored in `public/vendor/`.

![GSAP](https://img.shields.io/badge/GSAP-3.15-0EA5E9) ![Lenis](https://img.shields.io/badge/Lenis-1.3-8A5CF5) ![Node](https://img.shields.io/badge/Node.js-Express-green) ![License](https://img.shields.io/badge/License-MIT-blue)

## ✨ What's in it

- **Preloader** — a Mughal arch drawn stroke-by-stroke in SVG with a 00→100 counter
- **Custom cursor** — gold ring + dot that grows over links and shows a "View" label on images
- **Hero** — line-by-line masked headline reveal, Nastaliq Urdu title, parallax + Ken Burns background, count-up facts
- **Scroll-scrubbed story** — the opening paragraph lights up word by word as you read
- **History timeline** — eight turning points (1671 → today) on a rail that fills as you scroll
- **Architecture section** — a light marble chapter with count-up stats and hover-zoom details
- **Parallax quote** — a full-bleed sunset moment with a scrubbed statement
- **Horizontal gallery** — pinned on desktop, native swipe on mobile, with a keyboard-navigable lightbox
- **Visitor guide** — hours, entry, dress code, photography, plus an animated FAQ accordion
- **Location** — OpenStreetMap embed, coordinates and a Google Maps hand-off
- **Nearby sights** — Lahore Fort, Hazuri Bagh, Minar-e-Pakistan, Wazir Khan Mosque

## 🎨 Design

| Token | Value | Use |
| --- | --- | --- |
| Ink | `#100C0A` | Base background |
| Sandstone | `#A8452C` | Accent, links, rules |
| Marble | `#F4EEE4` | Primary text, light sections |
| Gold | `#D9A441` | Highlights, numerals |

Typography: **Cormorant Garamond** (display) · **Inter** (UI) · **Noto Nastaliq Urdu** (Urdu).
Contrast checked against WCAG AA, keyboard accessible, and `prefers-reduced-motion` is respected.

## 🚀 Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

## 📡 API

| Method | Endpoint      | Description      |
| ------ | ------------- | ---------------- |
| GET    | `/api/health` | Service heartbeat |

## 🌍 Deploy

Works as-is on **Render**, **Railway**, **Fly.io** or **Vercel** (a `vercel.json` is included).

1. Push to GitHub
2. Connect the repo on [render.com](https://render.com) → New Web Service
3. Build command: `npm install` · Start command: `npm start`

Because the site is fully static, you can also drop `public/` on any static host (Netlify,
GitHub Pages, Cloudflare Pages) with no server at all.

## 📁 Structure

```
├── server.js               # Express static host + /api/health
├── vercel.json             # Serverless config
└── public/
    ├── index.html          # The guide
    ├── style.css           # Design system + layout
    ├── app.js              # Animation engine
    ├── images/             # 12 optimized photos
    └── vendor/             # gsap, ScrollTrigger, lenis (local)
```

`gsap` and `lenis` are listed as dev dependencies only — they are used to refresh the
committed files in `public/vendor/`, not at runtime.

## 📄 Sources

Badshahi Mosque Authority (Govt. of Punjab) · UNESCO World Heritage Centre (Fort & Shalimar
Gardens, Lahore) · Wikipedia · Encyclopaedia Britannica · Vacayadviser.
Photography: Pexels, Wikimedia Commons and public archives.

## 📄 License

MIT — free to use.
