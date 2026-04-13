# CLAUDE.md — Frontend Website Rules

## Always Do First
- **Invoke the `frontend-design` skill** before writing any frontend code, every session, no exceptions.

## Reference Images
- If a reference image is provided: match layout, spacing, typography, and color exactly. Swap in placeholder content (images via `https://placehold.co/`, generic copy). Do not improve or add to the design.
- If no reference image: design from scratch with high craft (see guardrails below).
- Screenshot your output, compare against reference, fix mismatches, re-screenshot. Do at least 2 comparison rounds. Stop only when no visible differences remain or user says so.

## Local Server
- **Always serve on localhost** — never screenshot a `file:///` URL.
- Start the dev server: `node serve.mjs` (serves the project root at `http://localhost:3000`)
- `serve.mjs` lives in the project root. Start it in the background before taking any screenshots.
- If the server is already running, do not start a second instance.

## Screenshot Workflow
- Puppeteer is installed at `C:/Users/nateh/AppData/Local/Temp/puppeteer-test/`. Chrome cache is at `C:/Users/nateh/.cache/puppeteer/`.
- **Always screenshot from localhost:** `node screenshot.mjs http://localhost:3000`
- Screenshots are saved automatically to `./temporary screenshots/screenshot-N.png` (auto-incremented, never overwritten).
- Optional label suffix: `node screenshot.mjs http://localhost:3000 label` → saves as `screenshot-N-label.png`
- `screenshot.mjs` lives in the project root. Use it as-is.
- After screenshotting, read the PNG from `temporary screenshots/` with the Read tool — Claude can see and analyze the image directly.
- When comparing, be specific: "heading is 32px but reference shows ~24px", "card gap is 16px but should be 24px"
- Check: spacing/padding, font size/weight/line-height, colors (exact hex), alignment, border-radius, shadows, image sizing

## Output Defaults
- Single `index.html` file, all styles inline, unless user says otherwise
- Tailwind CSS via CDN: `<script src="https://cdn.tailwindcss.com"></script>`
- Placeholder images: `https://placehold.co/WIDTHxHEIGHT`
- Mobile-first responsive

## Brand Assets
- Always check the `brand_assets/` folder before designing. It may contain logos, color guides, style guides, or images.
- If assets exist there, use them. Do not use placeholders where real assets are available.
- If a logo is present, use it. If a color palette is defined, use those exact values — do not invent brand colors.

## Anti-Generic Guardrails
- **Colors:** Never use default Tailwind palette (indigo-500, blue-600, etc.). Pick a custom brand color and derive from it.
- **Shadows:** Never use flat `shadow-md`. Use layered, color-tinted shadows with low opacity.
- **Typography:** Never use the same font for headings and body. Pair a display/serif with a clean sans. Apply tight tracking (`-0.03em`) on large headings, generous line-height (`1.7`) on body.
- **Gradients:** Layer multiple radial gradients. Add grain/texture via SVG noise filter for depth.
- **Animations:** Only animate `transform` and `opacity`. Never `transition-all`. Use spring-style easing.
- **Interactive states:** Every clickable element needs hover, focus-visible, and active states. No exceptions.
- **Images:** Add a gradient overlay (`bg-gradient-to-t from-black/60`) and a color treatment layer with `mix-blend-multiply`.
- **Spacing:** Use intentional, consistent spacing tokens — not random Tailwind steps.
- **Depth:** Surfaces should have a layering system (base → elevated → floating), not all sit at the same z-plane.

## Hard Rules
- Do not add sections, features, or content not in the reference
- Do not "improve" a reference design — match it
- Do not stop after one screenshot pass
- Do not use `transition-all`
- Do not use default Tailwind blue/indigo as primary color

---

## Project Architecture

ANISO is a headless e-commerce frontend for premium nightwear. The stack:

- **Frontend:** Vanilla HTML + Tailwind CDN + modular JS (no framework, no build step)
- **Backend CMS:** Shopify Storefront API (GraphQL) — Shopify admin IS the admin panel
- **Payments:** Razorpay (UPI, cards, wallets, COD) via Vercel serverless functions
- **Hosting:** Vercel free tier (static + serverless)

### Directory Structure

```
ANISO/
  brand_assets/              Logo, favicon, brand guidelines (do not modify)
  js/
    product-data.js          Hardcoded product array (fallback for Shopify API)
    cart.js                  Cart state (localStorage), cart drawer, toast
    components.js            Shared nav, footer, search overlay, auth modal (injected via JS)
    shopify-client.js        Storefront API GraphQL client (with fallback to product-data.js)
    checkout.js              Razorpay checkout flow
    search.js                (future) Dedicated search module
  api/                       Vercel serverless functions (Node.js)
    create-order.js          Razorpay order creation + COD flow
    verify-payment.js        Payment signature verification + Shopify order sync
  index.html                 Home page — hero, features, collections, new arrivals, bestsellers
  shop.html                  Shop page — category tabs (HOC-style), sort, dynamic grid
  product.html               Product detail page — dynamic from URL param ?id=X
  cart.html                  Cart page — items list + order summary
  checkout.html              Checkout — shipping form + Razorpay payment
  about.html                 Brand story
  contact.html               Contact form + info
  faq.html                   FAQ accordion
  size-guide.html            Size tables
  serve.mjs                  Local dev server (localhost:3000)
  package.json               Dependencies (razorpay)
  vercel.json                Vercel deployment routing
  .env.example               API keys template (never commit .env)
```

### Shared Component System

All pages use `<div id="nav-mount"></div>` and `<div id="footer-mount"></div>` — the nav and footer are injected by `js/components.js` at DOMContentLoaded. Do NOT duplicate nav/footer HTML across pages.

### Product Data Flow

1. `js/product-data.js` contains the hardcoded `PRODUCTS` array + helper functions
2. `js/shopify-client.js` wraps Shopify Storefront API with automatic fallback to local data
3. Pages render products dynamically from the JS data (not hardcoded HTML)
4. When Shopify is configured, live data replaces the hardcoded array seamlessly

### Brand Theme (Tailwind Config)

All pages share this Tailwind config:
- Colors: `cocoa: #8B6147`, `blush: #E8B4A0`, `champagne: #D4B896`
- Fonts: `display: Playfair Display`, `body: Montserrat`
- Base: white background, clean minimal aesthetic

### Cart System

- Storage: `localStorage` key `aniso_cart`
- Cart drawer: slide-in panel from right (triggered by cart icon in nav)
- Shipping: free above ₹1,499, else ₹149
- COD: available for orders up to ₹5,000

### Key Scripts Load Order

Every page loads scripts in this order:
1. `js/product-data.js` — product array + helpers
2. `js/cart.js` — cart state management
3. `js/components.js` — nav, footer, search, auth injection

Checkout page additionally loads:
- `https://checkout.razorpay.com/v1/checkout.js` (Razorpay SDK)
- `js/checkout.js` — checkout flow