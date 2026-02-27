# Storage & Deployment Guide

Full documentation for image/asset storage (MinIO locally, Cloudflare R2 in production) and deployment (Vercel for storefront, Railway for backend).

---

## Table of Contents

1. [How Storage Works](#how-storage-works)
2. [Local Dev: MinIO Setup](#local-dev-minio-setup)
3. [Production: Cloudflare R2 Setup](#production-cloudflare-r2-setup)
4. [Deploy Backend to Railway](#deploy-backend-to-railway)
5. [Deploy Storefront to Vercel](#deploy-storefront-to-vercel)
6. [Connect Everything: Environment Variables](#connect-everything-environment-variables)
7. [Troubleshooting](#troubleshooting)

---

## How Storage Works

### The Storage Strategy

Vendure's `AssetServerPlugin` is configured with conditional S3 storage in `backend/src/vendure-config.ts`:

- **`S3_BUCKET` env is set** → uses S3-compatible storage (MinIO locally, R2 in production)
- **`S3_BUCKET` env is NOT set** → falls back to local filesystem at `backend/static/assets/`

The `ASSET_URL_PREFIX` env var controls what URL Vendure puts in image `src` attributes. This must be the public-facing URL your browser can actually reach.

### Local Docker vs Production

| Environment | Storage Backend | `S3_ENDPOINT` | `ASSET_URL_PREFIX` |
|-------------|-----------------|---------------|---------------------|
| Local (Docker) | MinIO container | `http://minio:9000` | `http://localhost:3001/assets` |
| Railway | Cloudflare R2 | `https://<id>.r2.cloudflarestorage.com` | `https://<public-r2-domain>/assets` |

### Why Not Vercel Blob?

Vercel Blob uses a proprietary API (`@vercel/blob`) — it is **not S3-compatible**. Vendure's asset plugin requires S3-compatible storage. Cloudflare R2 is the closest equivalent: same developer-friendly UX, no egress fees, S3-compatible API.

---

## Local Dev: MinIO Setup

MinIO is already running in `docker-compose.yml`. After starting the stack you need to create the bucket once.

### Step 1 — Start the stack

```bash
docker compose up -d
```

### Step 2 — Create the bucket

1. Open MinIO Console: **http://localhost:9001**
2. Login with:
   - **Username:** `minioadmin`
   - **Password:** `minioadmin`
   (or whatever `MINIO_ROOT_USER` / `MINIO_ROOT_PASSWORD` are set to in your `.env`)
3. Click **"Create Bucket"**
4. Bucket name: **`vendure-assets`** (must match `S3_BUCKET` in docker-compose)
5. Click **"Create Bucket"**

### Step 3 — Make the bucket public

Images must be publicly readable so the storefront browser can load them.

1. In MinIO Console, click the `vendure-assets` bucket
2. Go to **"Access Policy"** → set to **"Public"**
3. Save

> Alternatively via `mc` CLI inside the container:
> ```bash
> docker exec vendure-minio mc alias set local http://localhost:9000 minioadmin minioadmin
> docker exec vendure-minio mc mb local/vendure-assets
> docker exec vendure-minio mc anonymous set public local/vendure-assets
> ```

### Step 4 — Verify

Upload an image via the Artículos form in the admin panel. It should:
- Appear in MinIO at http://localhost:9001 under the `vendure-assets` bucket
- Load in the browser via `http://localhost:3001/assets/<filename>`
- Display on the storefront product page

### Environment Variables (already in docker-compose.yml)

```yaml
S3_BUCKET: vendure-assets
S3_ACCESS_KEY_ID: ${MINIO_ROOT_USER:-minioadmin}
S3_SECRET_ACCESS_KEY: ${MINIO_ROOT_PASSWORD:-minioadmin}
S3_ENDPOINT: http://minio:9000
S3_REGION: us-east-1
ASSET_URL_PREFIX: http://localhost:3001/assets
```

These are already wired up — no action needed unless you change the MinIO credentials.

---

## Production: Cloudflare R2 Setup

### Step 1 — Create a Cloudflare account

Go to https://cloudflare.com and sign up (free). R2 is under the **"R2 Object Storage"** section.

### Step 2 — Enable R2

1. In the Cloudflare dashboard, go to **R2 Object Storage** in the left sidebar
2. Click **"Get started"** (first-time setup may ask for a payment method — R2 is free up to 10 GB)

### Step 3 — Create the bucket

1. Click **"Create bucket"**
2. Name: `la-nacion-assets` (or any name you like — you'll set it as `S3_BUCKET`)
3. Region: **Automatic** (default)
4. Click **"Create bucket"**

### Step 4 — Get API credentials

1. In the R2 section, click **"Manage R2 API tokens"** (top right)
2. Click **"Create API token"**
3. Settings:
   - **Token name:** `vendure-backend`
   - **Permissions:** Object Read & Write
   - **Specify bucket:** select `la-nacion-assets`
4. Click **"Create API Token"**
5. **Copy both values immediately** (they won't be shown again):
   - `Access Key ID`
   - `Secret Access Key`
6. Also copy your **Account ID** from the R2 overview page (top right of the R2 section)

### Step 5 — Enable public access

R2 buckets are private by default. To make images publicly accessible:

**Option A: Custom domain (recommended for production)**

1. Go to your bucket → **"Settings"** tab
2. Under **"Custom Domains"**, click **"Connect Domain"**
3. Enter a subdomain you control, e.g. `assets.tunegocio.com`
4. Cloudflare will configure DNS automatically if your domain is on Cloudflare
5. Your public URL will be `https://assets.tunegocio.com`

**Option B: R2.dev subdomain (quick testing)**

1. Go to your bucket → **"Settings"** tab
2. Under **"Public access"**, enable **"R2.dev subdomain"**
3. You'll get a URL like `https://pub-abc123.r2.dev`
4. Note: not recommended for production — use a custom domain instead

### Step 6 — Note your endpoint

Your R2 S3-compatible endpoint is:
```
https://<ACCOUNT_ID>.r2.cloudflarestorage.com
```

Replace `<ACCOUNT_ID>` with the Account ID from step 4.

### Production Environment Variables (for Railway)

```env
S3_BUCKET=la-nacion-assets
S3_ACCESS_KEY_ID=<access-key-id-from-step-4>
S3_SECRET_ACCESS_KEY=<secret-access-key-from-step-4>
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
ASSET_URL_PREFIX=https://assets.tunegocio.com/assets
```

> **Note:** `ASSET_URL_PREFIX` is the base URL where Vendure will prepend to asset filenames.
> If your R2 public URL is `https://assets.tunegocio.com`, files will be served at
> `https://assets.tunegocio.com/<filename>` and Vendure will store URLs as
> `https://assets.tunegocio.com/assets/<filename>`. Adjust the path segment to match
> how your R2 bucket / domain is set up.

---

## Deploy Backend to Railway

### Step 1 — Create a Railway project

1. Go to https://railway.app and log in
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Connect your GitHub account and select this repository
5. Railway will detect the `docker-compose.yml` and ask which services to deploy

### Step 2 — Configure the backend service

In the Railway project:

1. Click the **backend** service
2. Go to **"Settings"** → **"Build"**
   - **Root Directory:** `backend`
   - **Dockerfile Path:** `Dockerfile` (inside `backend/`)
3. Set **Port:** `3001`

### Step 3 — Add a PostgreSQL database

1. Click **"New Service"** → **"Database"** → **"PostgreSQL"**
2. Railway provisions the database and adds a `DATABASE_URL` variable automatically
3. In your backend service → **"Variables"**, add:
   ```env
   DATABASE_URL=${{Postgres.DATABASE_URL}}
   ```
   (Railway's variable reference syntax to pull the DB URL from the Postgres service)

### Step 4 — Set backend environment variables

In Railway backend service → **"Variables"**, add all of these:

```env
# App
NODE_ENV=production

# Database (from Railway's PostgreSQL service)
DATABASE_URL=${{Postgres.DATABASE_URL}}

# Admin credentials — CHANGE THESE
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=tu-contrasena-segura-aqui

# Security — generate a random 64-char string
COOKIE_SECRET=cambia-este-secreto-a-algo-aleatorio-de-64-caracteres

# Storefront URL (update after deploying to Vercel)
SHOP_URL=https://tu-tienda.vercel.app

# Cloudflare R2 storage
S3_BUCKET=la-nacion-assets
S3_ACCESS_KEY_ID=<r2-access-key-id>
S3_SECRET_ACCESS_KEY=<r2-secret-access-key>
S3_ENDPOINT=https://<account-id>.r2.cloudflarestorage.com
S3_REGION=auto
ASSET_URL_PREFIX=https://assets.tunegocio.com

# Email (optional — omit to disable emails in production)
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASSWORD=SG.tu-api-key
```

> **Tip for COOKIE_SECRET:** Generate a secure value with:
> ```bash
> node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
> ```

### Step 5 — Deploy and get the backend URL

1. Railway will automatically deploy after you set variables
2. Go to the backend service → **"Settings"** → **"Domains"**
3. Click **"Generate Domain"** — you'll get a URL like:
   `https://vendure-backend-production-xxxx.up.railway.app`
4. Copy this URL — you'll need it for the storefront

### Step 6 — Run the database initializer

The backend's `Dockerfile` already runs `init-db.ts` on startup (sets up the Mexico tax zone, Spanish language, MXN currency). This runs automatically — no manual action needed.

---

## Deploy Storefront to Vercel

### Step 1 — Import the project

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import the same GitHub repository
4. Vercel will detect Next.js

### Step 2 — Configure build settings

- **Framework Preset:** Next.js (auto-detected)
- **Root Directory:** `storefront`
- **Build Command:** `npm run build` (auto-detected)
- **Output Directory:** `.next` (auto-detected)

### Step 3 — Set environment variables

In Vercel → **"Environment Variables"**:

```env
# Backend API — use the Railway URL from the step above
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://vendure-backend-production-xxxx.up.railway.app/shop-api
```

> **Note about SSR vs browser:** The storefront's `graphql-client.ts` automatically uses
> `http://backend:3001/shop-api` for SSR (server-side rendering) when running inside Docker
> locally. On Vercel, both SSR and browser use `NEXT_PUBLIC_VENDURE_SHOP_API_URL` since
> there's no Docker networking.

### Step 4 — Deploy

1. Click **"Deploy"**
2. Vercel builds and deploys in ~2 minutes
3. You'll get a URL like: `https://tu-tienda.vercel.app`

### Step 5 — Update SHOP_URL in Railway

Go back to Railway → backend service → Variables and update:
```env
SHOP_URL=https://tu-tienda.vercel.app
```
Railway will auto-redeploy.

### Step 6 — Update next.config.js for production image domains

The storefront's `next.config.js` currently allows `localhost` and `backend` (Docker) as image sources. For production, add your R2 public domain:

```js
// storefront/next.config.js
remotePatterns: [
  { protocol: 'http',  hostname: 'localhost', port: '3001', pathname: '/assets/**' },
  { protocol: 'http',  hostname: 'backend',   port: '3001', pathname: '/assets/**' },
  { protocol: 'https', hostname: 'assets.tunegocio.com', pathname: '/**' },
  // Or if using R2.dev subdomain:
  // { protocol: 'https', hostname: 'pub-abc123.r2.dev', pathname: '/**' },
],
```

Commit and push — Vercel redeploys automatically.

---

## Connect Everything: Environment Variables

### Quick Reference

| Variable | Local (docker-compose) | Railway (production) | Vercel (production) |
|---|---|---|---|
| `DATABASE_URL` | auto (docker-compose) | `${{Postgres.DATABASE_URL}}` | — |
| `S3_BUCKET` | `vendure-assets` | `la-nacion-assets` | — |
| `S3_ACCESS_KEY_ID` | `minioadmin` | R2 access key | — |
| `S3_SECRET_ACCESS_KEY` | `minioadmin` | R2 secret key | — |
| `S3_ENDPOINT` | `http://minio:9000` | `https://<id>.r2.cloudflarestorage.com` | — |
| `S3_REGION` | `us-east-1` | `auto` | — |
| `ASSET_URL_PREFIX` | `http://localhost:3001/assets` | `https://assets.tunegocio.com` | — |
| `SHOP_URL` | `http://localhost:3000` | `https://tu-tienda.vercel.app` | — |
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | `http://localhost:3001/shop-api` | — | `https://backend.railway.app/shop-api` |
| `NODE_ENV` | `development` | `production` | `production` |

### storefront/next.config.js — update for production

```js
remotePatterns: [
  // Local dev
  { protocol: 'http',  hostname: 'localhost', port: '3001', pathname: '/assets/**' },
  { protocol: 'http',  hostname: 'backend',   port: '3001', pathname: '/assets/**' },
  // Production (your R2 public domain)
  { protocol: 'https', hostname: 'assets.tunegocio.com', pathname: '/**' },
],
```

---

## Troubleshooting

### Images not loading locally

**Check 1: Is the MinIO bucket created?**
Open http://localhost:9001 — if `vendure-assets` bucket is missing, create it (see [Local Dev Setup](#local-dev-minio-setup) above).

**Check 2: Is the bucket public?**
In MinIO Console → bucket → Access Policy → must be set to `Public`.

**Check 3: Is the backend using MinIO?**
Check backend logs:
```bash
docker compose logs backend | grep -i "s3\|minio\|asset"
```
If you see S3-related startup logs, it's connected. If not, check that `S3_BUCKET` env var is being read.

**Check 4: Is the asset URL correct?**
Open the admin panel, check a product's image URL — it should start with `http://localhost:3001/assets/`, not `http://backend:3001/assets/`. If it starts with `backend`, the `ASSET_URL_PREFIX` env var is not being picked up — restart the backend container.

---

### Images not loading in production (Railway + R2)

**Check 1: Is the bucket public?**
Try opening an image URL directly in your browser. If it returns 403, the R2 bucket public access is not configured.

**Check 2: Is `ASSET_URL_PREFIX` set correctly?**
In Railway backend → Variables, verify `ASSET_URL_PREFIX` matches your R2 public domain exactly (no trailing slash).

**Check 3: Is `next.config.js` updated?**
The storefront must have your R2 domain in `remotePatterns` or Next.js Image will block the URL.

**Check 4: CORS on R2**
If images load directly but fail in the storefront, add a CORS policy in R2:
1. Go to bucket → Settings → CORS Policy
2. Add:
```json
[
  {
    "AllowedOrigins": ["https://tu-tienda.vercel.app"],
    "AllowedMethods": ["GET"],
    "AllowedHeaders": ["*"]
  }
]
```

---

### Backend crashes on Railway

**Check database connection:**
In Railway backend logs, look for `ECONNREFUSED` or `authentication failed`. Ensure `DATABASE_URL` is set to `${{Postgres.DATABASE_URL}}` (Railway variable reference syntax).

**Check `synchronize` setting:**
For production, `DB_SYNCHRONIZE` should be `false` (or just don't set it — the config defaults to `true` only when `DB_SYNCHRONIZE !== 'false'`). Add this Railway env var if you want to be safe:
```env
DB_SYNCHRONIZE=false
```
> ⚠️ Only set this to `false` after the first successful deploy (Vendure needs to create tables on first run).

---

### Storefront shows old backend URL after updating Railway domain

Vercel caches `NEXT_PUBLIC_*` variables at build time. After updating `NEXT_PUBLIC_VENDURE_SHOP_API_URL`:
1. Go to Vercel → Project → Deployments
2. Click the three-dot menu on the latest deployment
3. Click **"Redeploy"** (with cache cleared)

---

## Cost Summary

| Service | Free Tier | Paid Starts At |
|---------|-----------|----------------|
| Vercel (storefront) | Unlimited hobby projects | $20/month (Pro) |
| Railway (backend) | $5 free credit/month | ~$5–15/month |
| Cloudflare R2 (assets) | 10 GB storage, 1M ops/month | $0.015/GB after |
| **Total estimate** | **~$0–5/month** small store | **~$10–20/month** |
