# 🏋️ Power House Gym — DHA Phase 3, Lahore

A **premium, multi-page website** built for **Power House Gym, Y-Block DHA Phase 3, Lahore** —
a real gym that lives on Facebook & Instagram and had no website of its own.

> **The gym (real):** 2nd Floor, Building #179, W Street 13, above ChenOne, Sector Y,
> DHA Phase 3, Lahore · 📞 0321 7593916 · Mon–Sat 7 AM – 11 PM
> Instagram: [@powerhousegymlahore](https://www.instagram.com/powerhousegymlahore/) ·
> Facebook: [PowerHouseGymLahore](https://www.facebook.com/PowerHouseGymLahore/)

Built with **HTML + CSS + GSAP 3 (ScrollTrigger) + Lenis**. No build step, no framework,
no CDN dependency — animation libraries are vendored in `public/vendor/`.

## 📄 Pages (7 — not a one-pager)

| Page | What's on it |
| --- | --- |
| `index.html` | 3D hero stage, marquee, club intro, programs preview, stats + timetable, coaching strip, FAQ + trial CTA |
| `about.html` | The club's story — floor, ladies section, equipment care, three working principles |
| `programs.html` | Strength, Fat Loss/Cardio, Kickboxing/Zumba/Aerobics/Cycling, Personal Training, Nutrition + BMI calculator + weekly schedule |
| `trainers.html` | Coaching team by specialty + how coaching works (assessment → plan → monthly check) |
| `pricing.html` | Monthly / 3-month toggle, three plans from PKR 7,500/mo, value breakdown, pricing FAQ |
| `gallery.html` | Filterable gallery (Floor / Strength / Cardio / Classes / Coaching) with lightbox |
| `contact.html` | Address, timings, map embed, directions + free-trial form that hands off to WhatsApp |

## 🎨 Design

| Token | Value | Use |
| --- | --- | --- |
| Charcoal | `#0E100E` | Base background |
| Bone | `#F3EFE6` | Primary text / light sections |
| Muted brass | `#C8A45D` | Accent (used sparingly, large text) |
| Sage | `#8A9A7B` | Secondary pill / ladies batches |

Typography: **Fraunces** (display serif) · **Archivo** (UI/body).
Copy is written in a grounded Roman-Urdu + English voice with real DHA/Y-Block detail —
no generic template lines. All photos are real gym photography (no AI-generated imagery).

## ⚡ Motion — heavy feel, light cost

- 3D hero stage with mouse-depth layers + floating info cards (rAF-throttled, transform-only)
- 3D tilt cards with cursor-tracked shine, GSAP scroll reveals, parallax images
- Count-up stats, marquee, magnetic-feeling buttons, page wipe, custom cursor (desktop only)
- Performance guards: `prefers-reduced-motion` respected, Lenis only on desktop,
  lazy images everywhere except the hero, no WebGL — the site stays smooth on weak phones.

## 🚀 Run locally

```bash
npm install
npm start
# open http://localhost:3000
```

## 📡 API

| Method | Endpoint | Description |
| --- | --- | --- |
| GET | `/api/health` | Service heartbeat + gym info |

## 📝 Note for the gym

Rates, class times and coach availability shown here reflect public listings
(Facebook/Instagram/directories) — confirm current details at the desk: **0321 7593916**.
