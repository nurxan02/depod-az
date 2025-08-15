# Depod (Static Frontend + Django Backend)

This repo contains a static frontend (GitHub Pages friendly) and a Django REST backend under `backend/` to manage content via Django Admin and serve JSON/media.

## Frontend (static)

- Pages: `index.html`, `products.html`, `product-detail.html`, etc.
- Product data is fetched from a backend API if `API_BASE` is configured; otherwise it falls back to the local hardcoded list in `js/products.js`.
- Configure API at runtime in your browser console:

```js
API.setBase("http://127.0.0.1:8000"); // or your deployed backend origin
```

The setting persists in `localStorage`.

## Backend (Django + DRF + PostgreSQL)

See `backend/README.md` for setup.

Essential endpoints:

- GET `/api/products/?category=earphone|powerbank|charger|car-charger`
- GET `/api/products/<id>/`
- GET `/api/categories/`

Media files are returned as absolute URLs, so the static site can render images hosted by the backend.

## Deployment model

- Host this frontend on GitHub Pages (static)
- Host the backend on a server/platform with a domain like `https://api.depod.az`
- Set CORS to allow your Pages domain.
- In production you can inline a small script to set `API_BASE` globally, or instruct admins to run `API.setBase('https://api.depod.az')` once per device.
