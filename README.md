# VOYOR | Haute Couture & Italian Fashion

A fashion e-commerce platform inspired by the visual grandeur, editorial storytelling, and architecture of **Versace** (`versace.com`).

---

## 🏛️ Architectural Highlights

* **Frontend:** Next.js 15 (App Router, React 19, Server Components) + Tailwind CSS v4 + Framer Motion.
* **Backend:** Integrated Zero-Overhead Next.js Server Actions & Route Handlers. Direct database queries with 0ms network serialization penalty.
* **Database & ORM:** SQLite (`voyor.db`) with **Drizzle ORM**. Instant queries, zero-cost, no external database clusters needed.
* **Localization & Multi-Currency:** Live dynamic currency converter for **USD ($)**, **EUR (€)**, **GBP (£)**, and **IDR (Rp)**.
* **100% Free & Self-Hostable:** Standalone containerized deployment (`output: 'standalone'`). Runs on any Linux VPS, Docker, Coolify, Railway, or local machine without Vercel lock-in.

---

## 💎 Features

1. **Cinematic Runway Experience:**
   * Full-bleed editorial campaign hero with Milano Fashion Week FW26 aesthetics.
   * Asymmetrical lookbook grids with hover image reveal (campaign vs. studio shots).
2. **Interactive Bag & Checkout:**
   * Slide-out shopping bag (`CartDrawer`) with quantity adjustment.
   * Dedicated shopping bag page (`/cart`).
   * Frictionless checkout sidebar simulation that writes directly to the SQLite `orders` table and returns a unique Italian luxury order number (`VY-XXXXXX-XXX`).
3. **Maison Heritage & Craftsmanship:**
   * Editorial storytelling section honoring Italian silk mills in Como, leather artisans in Florence, and 24K gold hardware plating.
4. **Universal Search:**
   * Instant modal search across collections, materials, and runway looks.

---

## 🚀 Getting Started

### 1. Install Dependencies
```bash
npm install
```

### 2. Seed Database
The repository includes a rich seed script with runway pieces, sizes, variants, and high-resolution fashion photography:
```bash
npx tsx src/lib/db/seed.ts
```

### 3. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🐳 Self-Hosting for Free ($0) with Docker

VOYOR is built with `output: 'standalone'` so you can host it anywhere without Vercel:

```bash
docker compose up -d --build
```
Your boutique will be running at port `3000` with the SQLite database persisted on your host system.
