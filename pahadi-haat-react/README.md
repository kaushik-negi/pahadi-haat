# Pahadi Haat — Frontend (React + Vite)

A multi-page, multi-role storefront: real routes via `react-router-dom`,
and role-based interfaces for Customer, Seller, and Driver accounts — now
backed by the real Spring Boot API in `../pahadi-haat-backend`.

## Run it locally

Start the backend first (see its README), then:

```bash
npm install
npm run dev
```

Open the printed local URL (usually http://localhost:5173).

By default the app talks to `http://localhost:8080/api`. To point it
somewhere else, copy `.env.example` to `.env` and set `VITE_API_BASE_URL`.

## Go live

```bash
npm run build
```

Produces a `dist/` folder you can deploy anywhere static (Netlify, Vercel,
etc). Set `VITE_API_BASE_URL` in that platform's environment variables to
your deployed backend's URL before building. `npm run preview` lets you
sanity-check the production build locally first.

## How it's wired to the backend

- **`src/api/`** — one small module per feature (`auth.js`, `catalog.js`,
  `orders.js`, `seller.js`, `driver.js`) plus `client.js`, a thin `fetch`
  wrapper that attaches the JWT and turns non-2xx responses into thrown
  `Error`s so pages can just `try/catch`.
- **`AuthContext`** (`src/context/AuthContext.jsx`) calls the real
  `/api/auth/*` endpoints, stores the returned JWT (`src/api/client.js`)
  and `{ role, name, email }` in `localStorage` so a refresh doesn't log
  you out.
- **`CartContext`** stays fully client-side (it's just a shopping cart
  before checkout) but now stores whole product snapshots fetched from
  the API, rather than looking IDs up in a static file.
- **Categories, shops, and products** are fetched from the backend on
  each relevant page (`Home`, `Category`, `ShopList`, `ShopDetails`,
  `Product`). `src/data/index.js` now only holds purely decorative
  marketing content (deal banners, "Local Produce" tiles) that has no
  backend model.
- **Checkout** (`Cart` → `PlaceOrder`) requires being logged in as a
  customer; if you're not, you're sent to `/login` and returned to
  `/place-order` after. Placing the order calls `POST /api/orders`,
  which recomputes prices server-side and returns a real order ID used
  for the tracking page.
- **Seller dashboard** fetches the logged-in seller's own shop and
  inventory, and lets them add products, adjust stock, and remove
  listings — all hitting `/api/seller/*`.
- **Driver dashboard** lists assigned + open deliveries from
  `/api/driver/deliveries`, and lets a driver accept a delivery or
  advance its status (Placed → Shipped → Delivered).

## Role-gating

`RequireRole` (`src/components/RequireRole.jsx`) redirects to `/login`
if you try to visit `/seller/dashboard` or `/driver/dashboard` without
being logged in as that role. The dashboards use their own header/chrome,
not the customer Header/Footer.
