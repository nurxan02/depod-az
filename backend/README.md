# Depod Backend (Django + DRF + PostgreSQL)

This backend exposes a simple API to power the static frontend hosted on GitHub Pages. Manage content via Django Admin and serve JSON + media files.

## Features

- Django Admin for products and categories
- REST API (DRF)
- CORS enabled for your GitHub Pages domain
- PostgreSQL
- Image uploads via Django media

## API surface

- GET /api/categories/ (each item: {id, key, name, description, image})
- GET /api/products/?category=earphone|powerbank|charger|car-charger
- GET /api/products/<id>/
- GET /api/products/by-category/<key>/

Product detail payload matches the current frontend structure:

```
{
  id, name, description, category,
  images: [{image, is_main, alt}],
  features: [{text}],
  specs: [{label, value}],
  highlights: [{number, text}]
}

Category fields:

{
  id, key, name, description, image
}
```

## Local setup

1. Create and activate venv
2. Install requirements
3. Create DB and .env
4. Migrate and create superuser
5. Run server

### Quick commands (macOS, zsh)

```zsh
python3 -m venv .venv
source .venv/bin/activate
pip install -r backend/requirements.txt
cp backend/.env.example backend/.env
# edit backend/.env if needed
createdb depod || true  # or use Postgres app/pgAdmin
python backend/manage.py migrate
python backend/manage.py createsuperuser
python backend/manage.py runserver 8000
```

Open: http://127.0.0.1:8000/admin/

## Deploying the backend

You can deploy to any VPS/Platform (Render, Railway, Fly.io, Heroku alternative) with PostgreSQL. Ensure environment variables and `ALLOWED_HOSTS`/CORS are set.

Serve media via the backend domain, e.g. https://api.yourdomain.com/media/...

## Frontend integration

- Point `API_BASE` to your backend origin (e.g., https://api.yourdomain.com)
- Frontend fetches:
  - /api/products/?category=...
  - /api/products/<slug>/
- Images use absolute URLs from `image` fields.
