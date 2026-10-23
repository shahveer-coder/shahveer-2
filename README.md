# Cafe Sierra — Demo Website (Client Pitch)

**Built by ShahveerCoder — Freelance Web Developer**

> Stunning free demo website built to pitch Cafe Sierra, Islamabad. Owner ko dikha ke impress karne ke liye ready!

## 🌐 Live Website URL
- **Vercel:** https://shahveer-code.vercel.app
- **Pages:** `/` · `/menu` · `/about` · `/contact` · owner panel `/admin-login.html`

## 🔐 Admin Panel
- **URL:** `/admin-login.html` — public navigation se linked nahi hai (owner-only, direct link)
- **Email:** `admin@cafesierra.com`
- Login ab **real Supabase Auth** se hota hai (`sb.auth.signInWithPassword`) — koi demo/frontend fallback nahi.
- Password Supabase Dashboard → Authentication → Users se manage karein (repo mein password share na karein).

## 🗄️ Supabase (Already Created ✅)
- **Project:** cafe-sierra-demo
- **Project Ref:** qyjhrfthqmidtsjfxztp
- **URL:** https://qyjhrfthqmidtsjfxztp.supabase.co
- **Region:** ap-southeast-1 (Singapore — Pakistan ke liye fastest)
- **Tables:** `menu_items` (20 items seeded ✅), `orders`, `messages` — RLS policies enabled
- Anon/publishable key `js/supabase-config.js` mein hai (public-safe, RLS protected).

## ✨ Features
- Dark Brown + Cream + Gold premium theme, Playfair Display + Poppins
- Upgraded animations — hero zoom, fade-up reveals, gold shine, float pulse (CSS-only, no libraries)
- Home: Hero, Featured (Coffee/Pizza/Pasta/Desserts), Why Us, Gallery, Real reviews (foodpanda/Google sourced)
- Menu: Live Supabase data + category filters + Order on WhatsApp per item
- About: Real story (F-8/2 Madina Market), hours, kitchen team
- Contact: Form → Supabase `messages`, exact Google Map embed, WhatsApp CTA
- Admin: Supabase Auth login + session guard, stats (menu/orders/messages), Add/Delete menu items (CRUD)
- Floating WhatsApp button (+92 321 5096969 — cafe ka real number), SEO + Open Graph tags, 100% mobile responsive

## 🚀 Deploy (Vercel)
Is project ka Vercel setup ek Node entrypoint expect karta hai, is liye `server.js` + `package.json` repo mein rakhe gaye hain:
- `server.js` — repo root ki HTML/CSS/JS files serve karta hai + clean URLs (`/menu` → `menu.html`)
- `vercel.json` — `@vercel/node` build + catch-all route
- Koi frontend build step nahi (plain HTML/CSS/JS)

## 📞 Real Cafe Info
- Plot 7, Lower Ground, Madina Market, F-8/2, Islamabad
- Phone/WhatsApp: +92 321 5096969 | facebook.com/cafe.sierra.isb
- 4.2★ Google (137 reviews) · 4.4★ foodpanda
- Specialties: Tarragon Steak Rs 1,425 · Mint Margarita Rs 345 · Alfredo Rs 1,395

Built by ShahveerCoder — Freelance Web Developer
