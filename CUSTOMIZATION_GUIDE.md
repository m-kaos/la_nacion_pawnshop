# KaoStore Template - Customization Guide

Complete guide to customizing this e-commerce template for your clients.

---

## 📋 Table of Contents

1. [Before You Start](#before-you-start)
2. [Quick Customization Checklist](#quick-customization-checklist)
3. [Branding Your Store](#branding-your-store)
4. [Content Management](#content-management)
5. [Styling & Colors](#styling--colors)
6. [Email Configuration](#email-configuration)
7. [Payment Setup](#payment-setup)
8. [Adding/Removing Features](#addingremoving-features)
9. [Database Configuration](#database-configuration)
10. [Common Customizations](#common-customizations)

---

## Before You Start

### Requirements Checklist
- [ ] Git repository cloned locally
- [ ] Docker Desktop running
- [ ] Code editor installed (VS Code recommended)
- [ ] Basic understanding of TypeScript/React
- [ ] Access to Stripe account (for payments)
- [ ] Domain name ready (for production)

### Understanding the Template Structure

This template uses a **hybrid content approach**:
- **Hardcoded content**: Page layouts, policies, static text
- **Admin-editable content**: Emails, social media links, dynamic content

Choose the approach that fits your project needs.

---

## Quick Customization Checklist

For a basic rebrand, follow these steps in order:

### 1. Store Name & Branding (15 minutes)
- [ ] Update store name in 3 files
- [ ] Change color scheme
- [ ] Create/add logo files

### 2. Content Updates (30 minutes)
- [ ] Update About Us page
- [ ] Update Contact information
- [ ] Review and modify policies
- [ ] Update FAQ content

### 3. Admin Configuration (15 minutes)
- [ ] Change admin credentials
- [ ] Configure email addresses in admin
- [ ] Add social media links

### 4. Payment Setup (20 minutes)
- [ ] Get Stripe API keys
- [ ] Update .env file
- [ ] Test with test cards

### 5. Testing (30 minutes)
- [ ] Complete checkout flow
- [ ] Test email delivery
- [ ] Mobile responsiveness
- [ ] Browser compatibility

**Total Time: ~2 hours**

---

## Branding Your Store

### Step 1: Change Store Name

#### File 1: Storefront Page Title
**File:** `storefront/app/layout.tsx`
**Line:** 12

```typescript
// BEFORE
export const metadata: Metadata = {
  title: 'KaoStore',
  description: 'Tu tienda en línea de confianza para productos de calidad',
};

// AFTER
export const metadata: Metadata = {
  title: 'YourStoreName',  // ← Change this
  description: 'Your store description',  // ← And this
};
```

#### File 2: Header Logo/Brand
**File:** `storefront/components/Header.tsx`
**Line:** 15

```typescript
// BEFORE
<Link href="/" className="text-2xl font-bold text-red-600...">
  KaoStore
</Link>

// AFTER
<Link href="/" className="text-2xl font-bold text-red-600...">
  YourStoreName  // ← Change this
</Link>
```

#### File 3: Email Sender Name
**File:** `backend/src/vendure-config.ts`
**Line:** 76

```typescript
// BEFORE
fromAddress: '"KaoStore" <noreply@kaostore.com>',

// AFTER
fromAddress: '"YourStoreName" <noreply@yourstore.com>',  // ← Change both name and email
```

#### File 4: HTML Language (if not Spanish)
**File:** `storefront/app/layout.tsx`
**Line:** 22

```typescript
// BEFORE
<html lang="es">

// AFTER
<html lang="en">  // ← Change to your language code
```

### Step 2: Add Your Logo

#### Create Logo Files
You need 3 logo variants:

1. **Small Logo** (150x50 pixels)
   - Location: `backend/static/logo-small.png`
   - Used in: Admin dashboard header

2. **Large Logo** (300x100 pixels)
   - Location: `backend/static/logo-large.png`
   - Used in: Admin login page

3. **Favicon** (32x32 pixels)
   - Location: `backend/static/favicon.ico`
   - Used in: Browser tab

#### Update Admin UI Configuration
**File:** `backend/src/vendure-config.ts`
**After line 85** (add this inside AdminUiPlugin.init):

```typescript
AdminUiPlugin.init({
  route: 'admin',
  port: 3002,
  brand: 'YourStoreName',  // ← Add this line
  branding: {  // ← Add this entire block
    smallLogoPath: path.join(__dirname, '../static/logo-small.png'),
    largeLogoPath: path.join(__dirname, '../static/logo-large.png'),
    faviconPath: path.join(__dirname, '../static/favicon.ico'),
  },
}),
```

#### Update Storefront Logo (Optional)
If you want an image logo instead of text in the header:

**File:** `storefront/components/Header.tsx`
**Replace line 15-17**:

```typescript
// BEFORE
<Link href="/" className="text-2xl font-bold text-red-600...">
  KaoStore
</Link>

// AFTER
<Link href="/" className="flex items-center">
  <Image
    src="/logo.png"
    alt="YourStoreName"
    width={150}
    height={50}
    priority
  />
</Link>
```

Then add your logo to: `storefront/public/logo.png`

---

## Content Management

### Approach 1: Hardcoded Content (Fast Setup)

Edit static page files directly:

#### Update About Us Page
**File:** `storefront/app/about/page.tsx`

Edit the Spanish content starting at line 21:
- Company story (line 24-26)
- Mission statement (line 35-41)
- Values (lines 46-64)
- Why choose us (lines 74-125)

#### Update Contact Page
**File:** `storefront/app/contact/page.tsx`

Update:
- Business hours (lines 150-161)
- Response time information (lines 138-145)

#### Update Policies
- **Shipping**: `storefront/app/shipping/page.tsx`
- **Returns**: `storefront/app/returns/page.tsx`
- **FAQ**: `storefront/app/faq/page.tsx`
- **Legal**: `storefront/app/legal/page.tsx`

### Approach 2: Admin-Editable Content

Currently active for:
- Support email
- Contact email
- Social media links

To edit:
1. Access admin: http://localhost:3001/admin
2. Navigate to: **Settings** → Scroll to **Custom Fields**
3. Edit field values
4. Click **Save**
5. Refresh storefront to see changes

**To connect more pages to admin**, see [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md).

---

## Styling & Colors

### Change Primary Color

The template uses a red color scheme (`#dc2626`). To change it:

**File:** `storefront/tailwind.config.ts`
**Lines:** 12-24

```typescript
colors: {
  primary: {
    50: '#fef2f2',   // Lightest shade
    100: '#fee2e2',
    200: '#fecaca',
    300: '#fca5a5',
    400: '#f87171',
    500: '#ef4444',
    600: '#dc2626',  // ← Main brand color (change this)
    700: '#b91c1c',
    800: '#991b1b',
    900: '#7f1d1d',
    950: '#450a0a',  // Darkest shade
  },
},
```

#### Option 1: Use a Tailwind Default Color
```typescript
import colors from 'tailwindcss/colors';

export default {
  theme: {
    extend: {
      colors: {
        primary: colors.blue,  // or colors.green, colors.purple, etc.
      },
    },
  },
};
```

#### Option 2: Use Your Brand Color
Generate a full palette from your hex color:
- Use: https://uicolors.app/create
- Input your brand color
- Copy the generated palette
- Replace the `primary` object

### Change Font

**File:** `storefront/app/layout.tsx`
**Line:** 9

```typescript
// BEFORE
import { Inter } from 'next/font/google';
const inter = Inter({ subsets: ['latin'] });

// AFTER
import { Roboto } from 'next/font/google';  // ← Change font
const roboto = Roboto({
  weight: ['400', '500', '700'],  // Specify weights
  subsets: ['latin'],
});

// Then update line 23:
<body className={roboto.className}>  // ← Use new font
```

Browse fonts at: https://fonts.google.com/

### Modify Layout

To adjust spacing, sizing, or layout:
- Header height: `storefront/components/Header.tsx` - `py-4` on line 13
- Footer padding: `storefront/components/Footer.tsx` - `py-12` on line 16
- Container width: Search for `max-w-` classes and adjust

---

## Email Configuration

### Development (Default)
Emails are saved to disk at: `backend/static/email/test-emails/`

View emails at: http://localhost:3001/mailbox

### Production Setup

#### Step 1: Choose Email Provider
- **SendGrid** (recommended)
- Mailgun
- AWS SES
- SMTP server

#### Step 2: Update Environment Variables

Add to `.env`:
```env
# Email Configuration
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASSWORD=SG.your-sendgrid-api-key-here
```

#### Step 3: Update Vendure Config

**File:** `backend/src/vendure-config.ts`
**Lines:** 69-81

```typescript
EmailPlugin.init({
  devMode: process.env.NODE_ENV !== 'production',  // ← Change this
  outputPath: path.join(__dirname, '../static/email/test-emails'),
  route: 'mailbox',
  handlers: defaultEmailHandlers,
  templatePath: path.join(__dirname, '../static/email/templates'),
  globalTemplateVars: {
    fromAddress: '"YourStore" <noreply@yourstore.com>',
    verifyEmailAddressUrl: `${process.env.SHOP_URL}/verify`,
    passwordResetUrl: `${process.env.SHOP_URL}/reset-password`,
    changeEmailAddressUrl: `${process.env.SHOP_URL}/change-email`,
  },
  // Add SMTP transport for production
  transport: process.env.NODE_ENV === 'production' ? {
    type: 'smtp',
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  } : undefined,
}),
```

---

## Payment Setup

### Get Stripe API Keys

1. Create account at: https://dashboard.stripe.com/register
2. Navigate to: **Developers** → **API keys**
3. Copy:
   - **Publishable key** (starts with `pk_test_...`)
   - **Secret key** (starts with `sk_test_...`)

### Update Environment Variables

**File:** `.env`

```env
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_your_key_here
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
```

### Test Payment Flow

Use Stripe test cards:
- **Success**: `4242 4242 4242 4242`
- **Decline**: `4000 0000 0000 0002`
- **3D Secure**: `4000 0025 0000 3155`

All test cards:
- Expiry: Any future date
- CVC: Any 3 digits
- ZIP: Any 5 digits

### Production Setup

1. Activate your Stripe account
2. Complete business verification
3. Get live API keys (`pk_live_...` and `sk_live_...`)
4. Update `.env` with live keys
5. Set up webhooks (see [DEPLOYMENT.md](DEPLOYMENT.md))

---

## Adding/Removing Features

### Add a New Static Page

1. **Create page file**:
   ```bash
   storefront/app/new-page/page.tsx
   ```

2. **Add page content**:
   ```typescript
   export default function NewPage() {
     return (
       <div className="container mx-auto px-4 py-8">
         <h1 className="text-4xl font-bold mb-8">Page Title</h1>
         <p>Your content here...</p>
       </div>
     );
   }
   ```

3. **Add to navigation** (optional):
   **File:** `storefront/components/Header.tsx`
   ```typescript
   <Link href="/new-page" className="text-gray-700 hover:text-red-600...">
     New Page
   </Link>
   ```

4. **Add to footer**:
   **File:** `storefront/components/Footer.tsx`
   ```typescript
   <Link href="/new-page" className="hover:text-red-500...">
     New Page
   </Link>
   ```

### Remove a Feature

#### Example: Remove Order Tracking

1. Delete folder: `storefront/app/orders/`
2. Remove link from: `storefront/app/checkout/success/page.tsx`
3. Remove link from: `storefront/app/account/orders/page.tsx`

### Add Product Categories

Categories are managed in Vendure admin:
1. Go to: http://localhost:3001/admin
2. Navigate to: **Catalog** → **Collections**
3. Click: **Create new Collection**
4. Add name, description, filters
5. Save

Access in storefront at: `/products?collection=your-collection-id`

---

## Database Configuration

### Development (Default)
Uses Docker PostgreSQL container with data persistence.

### Production Options

#### Option 1: Managed PostgreSQL (Recommended)
- Railway PostgreSQL
- AWS RDS
- Digital Ocean Managed Database
- Heroku Postgres

Update `.env`:
```env
DB_HOST=your-db-host.railway.app
DB_PORT=5432
DB_NAME=railway
DB_USERNAME=postgres
DB_PASSWORD=your-secure-password-here
```

#### Option 2: Self-Hosted
Set up PostgreSQL 15+ on your server and update `.env` accordingly.

### Database Migrations

For production, disable auto-sync:

**File:** `backend/src/vendure-config.ts`
**Line:** 47

```typescript
dbConnectionOptions: {
  type: 'postgres',
  synchronize: false,  // ← IMPORTANT: false in production!
  // ... rest of config
},
```

Run migrations manually:
```bash
npm run migrate:generate -- MigrationName
npm run migrate:run
```

---

## Common Customizations

### Change Session Duration

**File:** `backend/src/vendure-config.ts`
**Line:** 42

```typescript
sessionDuration: '30d',  // ← Change to '7d', '14d', '60d', etc.
```

### Modify Checkout Steps

**File:** `storefront/app/checkout/page.tsx`

Currently 3 steps: Address → Shipping → Payment

To add/remove steps, modify the `STEPS` array and add corresponding form sections.

### Change Product Grid Layout

**File:** `storefront/app/products/page.tsx`

```typescript
// BEFORE (3 columns)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

// AFTER (4 columns)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
```

### Add Social Login (Google, Facebook)

1. Install NextAuth.js:
   ```bash
   cd storefront
   npm install next-auth
   ```

2. Configure providers in: `storefront/app/api/auth/[...nextauth]/route.ts`

3. Update login page to include social buttons

4. Connect to Vendure authentication

(Full guide: https://next-auth.js.org/getting-started/introduction)

### Enable Reviews/Ratings

1. Install Vendure Reviews plugin
2. Add review form component
3. Display ratings on product pages
4. Add reviews section

(Vendure plugin: https://github.com/vendure-ecommerce/vendure/tree/master/packages/reviews-plugin)

### Add Product Filtering

Currently basic search is implemented. To add filters:

1. Update product query to accept filter parameters
2. Add filter UI components (checkboxes, sliders)
3. Update URL query parameters
4. Refetch products with filters

---

## Next Steps

After customization:

1. **Test Thoroughly**
   - Complete checkout flow (3+ times)
   - Test all forms
   - Check mobile responsiveness
   - Verify emails are sent

2. **Add Your Products**
   - Access admin dashboard
   - Create collections/categories
   - Add products with images
   - Set prices and inventory

3. **Configure Shipping**
   - Admin → Settings → Shipping Methods
   - Add flat rate, free shipping, etc.
   - Set up regions if needed

4. **Deploy**
   - See [DEPLOYMENT.md](DEPLOYMENT.md)
   - Set up production database
   - Configure domain & SSL
   - Test live payments

5. **Monitor**
   - Set up error tracking (Sentry)
   - Enable analytics (Google Analytics)
   - Monitor server health
   - Check email deliverability

---

## Troubleshooting

### Changes Not Showing

1. **Clear browser cache**: Ctrl+Shift+R (Windows) or Cmd+Shift+R (Mac)
2. **Rebuild containers**: `docker-compose build && docker-compose restart`
3. **Check logs**: `docker-compose logs -f`

### Tailwind Styles Not Applying

1. Ensure class names are in `content` array in `tailwind.config.ts`
2. Restart dev server
3. Check for typos in class names
4. Clear Next.js cache: `rm -rf storefront/.next`

### GraphQL Errors

1. Check backend is running: `docker-compose ps`
2. Verify API URL in `.env`: `NEXT_PUBLIC_VENDURE_SHOP_API_URL`
3. Check backend logs: `docker-compose logs backend`
4. Test query in GraphQL playground: http://localhost:3001/shop-api

---

## Need Help?

- **Template Issues**: Check existing documentation
- **Vendure Questions**: https://docs.vendure.io/
- **Next.js Questions**: https://nextjs.org/docs
- **Tailwind CSS**: https://tailwindcss.com/docs

---

**Happy Customizing! 🎨**
