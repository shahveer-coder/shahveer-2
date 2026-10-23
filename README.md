# Cafe Sierra — Demo Website (Client Pitch)

**Built by ShahveerCoder — Freelance Web Developer**

> Stunning free demo website built to pitch Cafe Sierra, Islamabad.

Pure static website — HTML + CSS + JavaScript, no build step required.

## 🌐 Pages
- `/` — Home (hero, featured favourites, why us, gallery, reviews)
- `/menu.html` — Live menu from Supabase + category filters + per-item WhatsApp ordering
- `/about.html` — Our story, opening hours, kitchen team
- `/contact.html` — Contact form (saves to Supabase `messages`), Google Map, WhatsApp CTA
- `/admin-login.html` — Owner login
- `/admin-dashboard.html` — Stats + menu CRUD

## 🔐 Admin Panel
- **URL:** `/admin-login.html`
- **Demo credentials:** `admin@cafesierra.com` / `demo123`
- Production ke liye: Supabase Dashboard → Authentication → Users → Add user with same email/password.

## 🗄️ Supabase
- **Project Ref:** `qyjhrfthqmidtsjfxztp`
- **URL:** `https://qyjhrfthqmidtsjfxztp.supabase.co`
- **Tables:** `menu_items` (20 seeded items), `orders`, `messages` — RLS enabled
- Anon/publishable key `js/supabase-config.js` mein hai (public-safe, RLS protected).

## ✨ Features
- Dark Brown + Cream + Gold premium theme, Playfair Display + Poppins
- Live Supabase menu with category filters
- Contact form → Supabase `messages`
- Admin login + dashboard stats + Add/Delete menu items
- Floating WhatsApp button (+92 321 5096969), SEO + Open Graph tags, mobile responsive, smooth reveal animations

## 🚀 Deploy
Static site — Vercel par koi build command nahi chahiye (framework: Other / Static).
`vercel.json` sirf `cleanUrls` set karta hai.

## 📞 Real Cafe Info
- Plot 7, Lower Ground, Madina Market, F-8/2, Islamabad
- Phone/WhatsApp: +92 321 5096969 | facebook.com/cafe.sierra.isb
- 4.2★ Google (137 reviews) · 4.4★ foodpanda

Built by ShahveerCoder — Freelance Web Developer
