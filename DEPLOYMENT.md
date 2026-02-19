# Deployment Guide

Complete deployment instructions for the KaoStore e-commerce template across multiple platforms.

---

## Table of Contents

1. [Deployment Overview](#deployment-overview)
2. [Pre-Deployment Checklist](#pre-deployment-checklist)
3. [Option 1: Vercel (Storefront) + Railway (Backend)](#option-1-vercel-storefront--railway-backend)
4. [Option 2: Cloudflare Workers (Full Stack)](#option-2-cloudflare-workers-full-stack)
5. [Option 3: Railway (Full Stack)](#option-3-railway-full-stack)
6. [Database Setup](#database-setup)
7. [Post-Deployment Steps](#post-deployment-steps)
8. [Environment Variables Reference](#environment-variables-reference)
9. [Troubleshooting](#troubleshooting)

---

## Deployment Overview

### Architecture Options

This template can be deployed in several ways:

| Component | Platform Options |
|-----------|------------------|
| **Storefront** | Vercel, Cloudflare Pages, Railway |
| **Backend** | Railway, Cloudflare Workers, Render, DigitalOcean |
| **Database** | Railway PostgreSQL, Supabase, AWS RDS, Neon |
| **Assets** | Cloudflare R2, AWS S3, DigitalOcean Spaces |

### Recommended Configurations

**Best Performance + Cost:**
- Storefront: Vercel (free tier)
- Backend: Railway ($5-10/month)
- Database: Railway PostgreSQL (included)

**Enterprise Scale:**
- Storefront: Vercel Pro
- Backend: AWS ECS / Kubernetes
- Database: AWS RDS
- Assets: AWS S3 + CloudFront

**Edge-First:**
- Storefront: Cloudflare Pages
- Backend: Cloudflare Workers (Docker)
- Database: Neon (serverless PostgreSQL)

---

## Pre-Deployment Checklist

Before deploying, ensure you have:

### Required Accounts
- [ ] Git repository (GitHub, GitLab, or Bitbucket)
- [ ] Vercel account (for storefront) - https://vercel.com
- [ ] Railway account (for backend) - https://railway.app
- [ ] Stripe account with live API keys - https://stripe.com
- [ ] Domain name (optional but recommended)

### Code Preparation
- [ ] Push all code to Git repository
- [ ] Review and update [.env.example](file://.env.example)
- [ ] Test full checkout flow locally
- [ ] Update branding (store name, colors, logo)
- [ ] Add real product data in admin
- [ ] Configure shipping methods

### Security Checklist
- [ ] Change `SUPERADMIN_USERNAME` and `SUPERADMIN_PASSWORD`
- [ ] Generate production `COOKIE_SECRET`
- [ ] Get Stripe live API keys (not test keys)
- [ ] Set up SMTP for production emails
- [ ] Remove any development/test data
- [ ] Review custom field content in admin

---

## Option 1: Vercel (Storefront) + Railway (Backend)

**Best for:** Most use cases - easy setup, great performance, predictable costs

**Monthly Cost Estimate:** $5-15 (Railway backend + database)

### Step 1: Deploy Backend to Railway

#### 1.1 Create Railway Project

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway will detect `docker-compose.yml`

#### 1.2 Configure Backend Service

1. In Railway dashboard, click **"New Service"** → **"Docker Image"**
2. Configure backend service:
   - **Root Directory**: `/backend`
   - **Dockerfile Path**: `backend/Dockerfile`
   - **Port**: `3001`

#### 1.3 Add PostgreSQL Database

1. Click **"New Service"** → **"Database"** → **"PostgreSQL"**
2. Railway will create database and provide connection details
3. Database credentials are auto-injected as environment variables

#### 1.4 Set Backend Environment Variables

In Railway backend service settings, add:

```env
# Database (Railway provides these automatically as DATABASE_URL)
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}

# Admin Credentials (⚠️ CHANGE THESE!)
SUPERADMIN_USERNAME=your-admin-username
SUPERADMIN_PASSWORD=your-secure-password

# Security (⚠️ GENERATE NEW SECRET!)
COOKIE_SECRET=your-64-character-random-secret-here

# Storefront URL (update after deploying frontend)
SHOP_URL=https://your-store.vercel.app

# Stripe
STRIPE_SECRET_KEY=sk_live_your_live_key_here

# Email (SendGrid example)
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key

# Environment
NODE_ENV=production
```

#### 1.5 Generate Domain

1. Railway will provide a public domain like: `backend-production-abc123.up.railway.app`
2. Copy this URL - you'll need it for the storefront

#### 1.6 Enable Healthcheck (Optional)

Add to backend settings:
- **Healthcheck Path**: `/health`
- **Healthcheck Interval**: `30s`

---

### Step 2: Deploy Storefront to Vercel

#### 2.1 Connect Repository

1. Go to https://vercel.com
2. Click **"Add New..."** → **"Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js

#### 2.2 Configure Build Settings

- **Framework Preset**: Next.js
- **Root Directory**: `storefront`
- **Build Command**: `npm run build` (auto-detected)
- **Output Directory**: `.next` (auto-detected)
- **Install Command**: `npm install` (auto-detected)

#### 2.3 Set Storefront Environment Variables

In Vercel project settings → Environment Variables:

```env
# Backend API (use Railway backend URL)
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://your-backend.up.railway.app/shop-api

# Stripe (frontend)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_live_key_here

# Stripe (backend - for API routes)
STRIPE_SECRET_KEY=sk_live_your_live_key_here
```

#### 2.4 Deploy

1. Click **"Deploy"**
2. Vercel will build and deploy in ~2 minutes
3. You'll get a domain like: `your-store.vercel.app`

#### 2.5 Update Backend SHOP_URL

Go back to Railway backend environment variables and update:
```env
SHOP_URL=https://your-store.vercel.app
```

Redeploy the backend service.

---

### Step 3: Configure Custom Domain (Optional)

#### For Storefront (Vercel):
1. Go to Vercel project → **Settings** → **Domains**
2. Add your domain (e.g., `www.yourstore.com`)
3. Update DNS records as instructed
4. SSL is automatic

#### For Backend (Railway):
1. Go to Railway backend → **Settings** → **Domains**
2. Add custom domain (e.g., `api.yourstore.com`)
3. Update DNS with CNAME record
4. SSL is automatic

#### Update Environment Variables:
```env
# In Railway backend
SHOP_URL=https://www.yourstore.com

# In Vercel storefront
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://api.yourstore.com/shop-api
```

---

### Step 4: Test Deployment

1. Visit your storefront URL
2. Browse products
3. Complete a test order with Stripe test card: `4242 4242 4242 4242`
4. Check order appears in admin: `https://your-backend.up.railway.app/admin`
5. Verify email was sent (check SMTP provider dashboard)

---

## Option 2: Cloudflare Workers (Full Stack)

**Best for:** Edge performance, global distribution, serverless architecture

**Monthly Cost Estimate:** $5-25 (Workers + D1 database or Neon)

### Prerequisites

1. Cloudflare account with Workers enabled
2. Wrangler CLI installed: `npm install -g wrangler`
3. Authenticate: `wrangler login`

### Step 1: Prepare Backend for Cloudflare

#### Create Dockerfile for Workers

Create `backend/Dockerfile.workers`:

```dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
EXPOSE 3001
CMD ["node", "dist/index.js"]
```

#### Configure wrangler.toml

Create `backend/wrangler.toml`:

```toml
name = "vendure-backend"
compatibility_date = "2024-01-01"
main = "dist/index.js"

[env.production]
workers_dev = false
route = "api.yourstore.com/*"

[[env.production.bindings]]
type = "service"
name = "DATABASE"
```

### Step 2: Set Up Database

**Option A: Use Neon (Recommended for Cloudflare)**

1. Create account at https://neon.tech
2. Create new project
3. Copy connection string
4. Add to Cloudflare Workers secrets:
   ```bash
   wrangler secret put DATABASE_URL
   # Paste: postgresql://user:pass@host/dbname?sslmode=require
   ```

**Option B: Use Cloudflare D1 (Beta)**

```bash
wrangler d1 create vendure-db
wrangler d1 execute vendure-db --file=./schema.sql
```

### Step 3: Deploy Backend

```bash
cd backend
wrangler deploy --env production
```

### Step 4: Deploy Storefront to Cloudflare Pages

```bash
cd storefront

# Build the application
npm run build

# Deploy to Cloudflare Pages
wrangler pages deploy .next --project-name=yourstore
```

#### Configure Environment Variables

In Cloudflare Pages dashboard:

```env
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://api.yourstore.com/shop-api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_your_key
STRIPE_SECRET_KEY=sk_live_your_key
```

### Step 5: Configure Custom Domain

1. Go to Cloudflare Pages → Custom Domains
2. Add `www.yourstore.com`
3. DNS records are auto-configured if domain is on Cloudflare

---

## Option 3: Railway (Full Stack)

**Best for:** Simplest deployment, everything in one place

**Monthly Cost Estimate:** $10-20

### Step 1: Deploy Entire Stack

1. Go to https://railway.app
2. Click **"New Project"** → **"Deploy from GitHub repo"**
3. Select your repository
4. Railway detects `docker-compose.yml` and creates services automatically

### Step 2: Configure Services

Railway will create:
- **backend** service (Vendure API + Admin)
- **storefront** service (Next.js)
- **postgres** database
- **redis** (optional, if in docker-compose)

### Step 3: Set Environment Variables

#### Backend Service:
```env
DB_HOST=${PGHOST}
DB_PORT=${PGPORT}
DB_NAME=${PGDATABASE}
DB_USERNAME=${PGUSER}
DB_PASSWORD=${PGPASSWORD}
SUPERADMIN_USERNAME=admin
SUPERADMIN_PASSWORD=your-password
COOKIE_SECRET=your-secret
SHOP_URL=https://storefront-production.up.railway.app
STRIPE_SECRET_KEY=sk_live_...
NODE_ENV=production
```

#### Storefront Service:
```env
NEXT_PUBLIC_VENDURE_SHOP_API_URL=https://backend-production.up.railway.app/shop-api
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
```

### Step 4: Generate Domains

1. Railway creates public URLs for each service
2. Update `SHOP_URL` in backend with storefront URL
3. Redeploy backend service

### Step 5: Add Custom Domains (Optional)

For each service:
1. Go to service → Settings → Domains
2. Add custom domain
3. Configure CNAME in your DNS provider

---

## Database Setup

### Running Migrations

After deploying backend for the first time:

```bash
# For Railway
railway run npm run migrate:run

# For other platforms (SSH into container)
docker exec -it <container-id> npm run migrate:run
```

### Populating Initial Data

```bash
# Create admin user and sample data
railway run npm run populate

# Or manually in admin dashboard
# Login at: https://your-backend-url/admin
# Create collections, products, shipping methods
```

### Database Backups

#### Railway:
- Automatic daily backups (on paid plans)
- Manual backup: Railway dashboard → Database → Backups

#### Neon:
- Point-in-time recovery available
- Automatic backups every 24 hours

#### Manual Backup:
```bash
pg_dump -h host -U user -d dbname > backup.sql
```

---

## Post-Deployment Steps

### 1. Configure Stripe Webhooks

Stripe needs to notify your backend about payment events:

1. Go to https://dashboard.stripe.com/webhooks
2. Click **"Add endpoint"**
3. Enter: `https://your-backend-url/stripe/webhook`
4. Select events:
   - `payment_intent.succeeded`
   - `payment_intent.payment_failed`
   - `charge.refunded`
5. Copy webhook signing secret
6. Add to backend environment: `STRIPE_WEBHOOK_SECRET=whsec_...`
7. Redeploy backend

### 2. Set Up Email Delivery

Configure SMTP in backend environment variables:

**SendGrid (Recommended):**
```env
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-api-key-here
```

**Mailgun:**
```env
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@your-domain.mailgun.org
SMTP_PASSWORD=your-mailgun-password
```

**AWS SES:**
```env
SMTP_HOST=email-smtp.us-east-1.amazonaws.com
SMTP_PORT=587
SMTP_USER=your-aws-access-key-id
SMTP_PASSWORD=your-aws-secret-access-key
```

### 3. Update vendure-config.ts for Production

Ensure `backend/src/vendure-config.ts` has:

```typescript
dbConnectionOptions: {
  type: 'postgres',
  synchronize: false, // ⚠️ MUST be false in production
  logging: false,
  // ... other options
},
```

### 4. Configure CORS (if needed)

If storefront and backend are on different domains:

```typescript
// backend/src/vendure-config.ts
apiOptions: {
  port: 3001,
  cors: {
    origin: process.env.SHOP_URL || 'http://localhost:3000',
    credentials: true,
  },
  // ... other options
},
```

### 5. Set Up Monitoring

**Sentry (Error Tracking):**
1. Create account at https://sentry.io
2. Install: `npm install @sentry/nextjs`
3. Configure in `storefront/sentry.config.js`

**Analytics:**
- Google Analytics 4
- Vercel Analytics (if using Vercel)
- Cloudflare Analytics (if using Cloudflare)

### 6. Enable HTTPS

All recommended platforms provide automatic SSL:
- ✅ Vercel: Automatic
- ✅ Railway: Automatic
- ✅ Cloudflare: Automatic

Ensure all URLs use `https://` in environment variables.

### 7. Test Production Checkout

1. Use real payment methods (small amounts)
2. Verify order confirmation email arrives
3. Check order appears in admin dashboard
4. Test order tracking page
5. Verify all links in emails work

---

## Environment Variables Reference

### Critical Variables for Production

| Variable | Where to Set | Example | Notes |
|----------|--------------|---------|-------|
| `SHOP_URL` | Backend | `https://yourstore.com` | No trailing slash |
| `NEXT_PUBLIC_VENDURE_SHOP_API_URL` | Storefront | `https://api.yourstore.com/shop-api` | Must be publicly accessible |
| `STRIPE_SECRET_KEY` | Backend & Storefront | `sk_live_...` | Live key, not test |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Storefront | `pk_live_...` | Safe to expose |
| `COOKIE_SECRET` | Backend | (64+ char random) | Generate with crypto |
| `SUPERADMIN_PASSWORD` | Backend | (strong password) | Change from default! |
| `DB_HOST`, `DB_PASSWORD`, etc. | Backend | (from provider) | Railway auto-injects |

### Optional but Recommended

| Variable | Purpose | Example |
|----------|---------|---------|
| `SMTP_HOST` | Email delivery | `smtp.sendgrid.net` |
| `SMTP_PASSWORD` | Email auth | `SG.abc123...` |
| `SENTRY_DSN` | Error tracking | `https://...@sentry.io/...` |

---

## Troubleshooting

### Storefront Can't Connect to Backend

**Symptoms:** GraphQL errors, "Network request failed"

**Solutions:**
1. Verify `NEXT_PUBLIC_VENDURE_SHOP_API_URL` is correct
2. Check backend is running: `curl https://your-backend/shop-api`
3. Verify CORS settings in `vendure-config.ts`
4. Check backend logs for errors

### Database Connection Errors

**Symptoms:** Backend crashes with "ECONNREFUSED" or "authentication failed"

**Solutions:**
1. Verify all `DB_*` environment variables are correct
2. Check database is running (Railway dashboard)
3. Ensure database accepts external connections
4. Try connection string format: `DATABASE_URL=postgresql://user:pass@host:5432/db`

### Stripe Payments Failing

**Symptoms:** Payments don't complete, webhook errors

**Solutions:**
1. Verify using **live** keys (not test keys)
2. Check webhook endpoint is accessible: `https://backend/stripe/webhook`
3. Verify webhook secret is set: `STRIPE_WEBHOOK_SECRET`
4. Check Stripe dashboard for webhook delivery attempts
5. Ensure `SHOP_URL` matches actual storefront URL

### Emails Not Sending

**Symptoms:** No order confirmation emails

**Solutions:**
1. Check SMTP credentials are correct
2. Verify `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASSWORD`
3. For SendGrid: Use `apikey` (literal string) as `SMTP_USER`
4. Check email provider dashboard for errors
5. Test SMTP connection from backend container

### Build Failures

**Storefront build fails:**
1. Check Node.js version: Must be 20+
2. Verify all environment variables with `NEXT_PUBLIC_` prefix are set
3. Check build logs for TypeScript errors
4. Try: `npm install` then `npm run build` locally

**Backend build fails:**
1. Check Docker build logs
2. Verify Dockerfile is correct
3. Ensure all dependencies are in `package.json`
4. Check for TypeScript compilation errors

### Admin Dashboard 404

**Symptoms:** `https://backend/admin` shows 404

**Solutions:**
1. Verify AdminUiPlugin is registered in `vendure-config.ts`
2. Check admin route is set to `'admin'`
3. Rebuild backend container
4. Check backend logs for admin UI compilation errors

---

## Production Optimization

### Performance Tips

1. **Enable Caching:**
   - Vercel: Automatic edge caching
   - Cloudflare: Page Rules for static assets

2. **Database Connection Pooling:**
   ```typescript
   // vendure-config.ts
   dbConnectionOptions: {
     extra: {
       max: 20, // Maximum connections
       idleTimeoutMillis: 30000,
     },
   }
   ```

3. **Image Optimization:**
   - Use Next.js Image component
   - Compress product images before upload
   - Consider Cloudflare Images or Imgix

4. **CDN for Assets:**
   - Use Cloudflare R2 or AWS S3
   - Configure in `vendure-config.ts` AssetServerPlugin

### Security Checklist

- [ ] All secrets are environment variables (not in code)
- [ ] `.env` is in `.gitignore`
- [ ] Admin password is strong and unique
- [ ] Database password is randomly generated
- [ ] COOKIE_SECRET is 64+ characters
- [ ] HTTPS is enabled everywhere
- [ ] CORS is configured for your domain only
- [ ] Rate limiting enabled (Cloudflare/Railway)
- [ ] Database backups are enabled
- [ ] Webhook secrets are verified (Stripe)

### Cost Optimization

**Free/Low Tier Options:**
- Storefront: Vercel (free for personal projects)
- Backend: Railway ($5/month hobby tier)
- Database: Included with Railway
- Email: SendGrid (100 emails/day free)

**Expected Monthly Costs:**
- **Small store** (<1000 orders/month): $5-10
- **Medium store** (<10,000 orders/month): $20-50
- **Large store** (>10,000 orders/month): $100+

---

## Next Steps

After successful deployment:

1. **Add Products:**
   - Login to admin dashboard
   - Create collections and products
   - Upload product images
   - Set pricing and inventory

2. **Configure Shipping:**
   - Admin → Settings → Shipping Methods
   - Add flat rate, free shipping, etc.
   - Set up tax zones if needed

3. **Test Extensively:**
   - Complete multiple test orders
   - Verify emails are delivered
   - Test on mobile devices
   - Check all payment flows

4. **Launch:**
   - Announce on social media
   - Set up Google Analytics
   - Enable error tracking (Sentry)
   - Monitor performance and errors

5. **Maintain:**
   - Regular database backups
   - Monitor uptime (UptimeRobot)
   - Update dependencies monthly
   - Review logs for errors

---

## Support Resources

- **Vendure Documentation:** https://docs.vendure.io/
- **Next.js Documentation:** https://nextjs.org/docs
- **Vercel Support:** https://vercel.com/support
- **Railway Docs:** https://docs.railway.app/
- **Stripe Docs:** https://stripe.com/docs

---

**Congratulations on deploying your e-commerce store!** 🚀

For questions or issues specific to this template, refer to the main [README.md](README.md) and [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md).
