# Admin Content Management System - Complete Guide

## 📌 For Template Users

This document explains the **Content Management System** built into this e-commerce template. The system allows you to edit certain website content directly from the admin dashboard without touching code.

### Hybrid Approach

This template uses a **hybrid content management strategy**:

- **Admin-Editable Content** ✅ Currently Active
  - Email addresses (support, contact)
  - Social media links
  - **Future**: Page content (About, Policies, FAQ)

- **Hardcoded Content** (Default for most pages)
  - About Us page text
  - Shipping & Return policies
  - FAQ questions and answers
  - Legal/Terms pages

**Why hybrid?** This gives you flexibility:
- Quick setup: Use hardcoded content as-is
- Client control: Connect pages to admin for non-technical clients
- Version control: Track content changes in Git
- Performance: No database queries for static content

See "Connecting More Pages to Admin" below to make additional content admin-editable.

---

## ✅ IMPLEMENTATION STATUS: COMPLETE

The admin content management system is fully operational and ready to use.

## 🎯 Features

### Editable Content Fields

All the following content can be managed from the Admin UI:

1. **Contact Information**
   - Support Email (default: `soporte@kaostore.com`)
   - Contact Email (default: `contacto@kaostore.com`)

2. **Page Content** (Rich Text Editors)
   - About Us Content
   - Shipping Policy
   - Return Policy
   - Legal/Terms Content
   - Privacy Policy
   - Terms of Service

3. **FAQ Content** (JSON Editor)
   - Structured FAQ data

4. **Social Media Links**
   - Facebook URL
   - Instagram URL
   - Twitter URL

## 📁 Architecture

### Backend Plugin Structure

```
backend/src/plugins/content-management/
├── content-management.plugin.ts    # Main plugin definition
├── content.resolver.ts             # GraphQL resolver
├── custom-fields.ts                # Custom field definitions
└── index.ts                        # Export barrel
```

### How It Works

```
Admin Dashboard
    ↓ (Admin edits content)
Global Settings Custom Fields (PostgreSQL)
    ↓ (Exposed via GraphQL)
Shop API: /shop-api
    ↓ (Query: siteContent)
Storefront (Next.js)
    ↓ (useContent hook)
Pages Display Content
```

## 🔧 Technical Implementation

### 1. Backend Plugin

**File**: `backend/src/plugins/content-management/content-management.plugin.ts`

The plugin:
- Registers custom fields on GlobalSettings entity
- Exposes `siteContent` query in Shop API
- Provides typed GraphQL schema

**Custom Fields**: `backend/src/plugins/content-management/custom-fields.ts`

12 custom fields added to GlobalSettings:
- Text inputs: supportEmail, contactEmail, socialMedia URLs
- Rich text editors: aboutUs, shippingPolicy, returnPolicy, etc.
- JSON editor: faqContent

**GraphQL Resolver**: `backend/src/plugins/content-management/content.resolver.ts`

Returns all content in a structured format with defaults.

### 2. Storefront Integration

**Content Hook**: `storefront/hooks/useContent.ts`

React hook that:
- Fetches content from Shop API on mount
- Provides loading state
- Returns default values if API fails
- Can be used in any component

**Usage Example**:
```typescript
import { useContent } from '@/hooks/useContent';

export default function MyPage() {
  const { content, loading, error } = useContent();

  return (
    <a href={`mailto:${content.supportEmail}`}>
      Contact Support: {content.supportEmail}
    </a>
  );
}
```

**GraphQL Query**: `storefront/lib/content-queries.ts`

Defines the `GET_SITE_CONTENT` query with TypeScript types.

### 3. Updated Components

The following components now use the content management system:

1. **Footer** (`storefront/components/Footer.tsx`)
   - Uses `content.contactEmail` in footer
   - Conditionally renders social media links if configured

2. **About Page** (`storefront/app/about/page.tsx`)
   - Uses `content.supportEmail` for mailto links

3. **Contact Page** (`storefront/app/contact/page.tsx`)
   - Uses both `content.contactEmail` and `content.supportEmail`

## 🚀 How to Use

### Step 1: Access Admin Dashboard

Navigate to: **http://localhost:3001/admin**

Login with your admin credentials.

### Step 2: Navigate to Settings

1. Click **Settings** in the sidebar
2. Scroll down to find the **Custom Fields** section

### Step 3: Edit Content

You'll see all editable fields:

- **Support Email**: Email for customer support
- **Contact Email**: General contact email
- **About Us Content**: Rich text editor for About page
- **Shipping Policy**: Shipping information
- **Return Policy**: Return and refund policies
- **FAQ Content**: JSON-formatted FAQ items
- **Legal Content**: Terms of service
- **Privacy Policy**: Privacy policy text
- **Terms of Service**: Terms text
- **Social Media URLs**: Facebook, Instagram, Twitter links

### Step 4: Save Changes

Click **Save** at the bottom of the page.

### Step 5: View Changes

The storefront will automatically fetch the new content on the next page load. The `useContent` hook is called on component mount, so:

- Refresh the page to see changes immediately
- Or wait for the next natural page load

## 🧪 Testing the System

### Test the GraphQL API

```bash
curl -X POST http://localhost:3001/shop-api \
  -H "Content-Type: application/json" \
  -d '{"query":"{ siteContent { supportEmail contactEmail } }"}'
```

**Expected Response**:
```json
{
  "data": {
    "siteContent": {
      "supportEmail": "soporte@kaostore.com",
      "contactEmail": "contacto@kaostore.com"
    }
  }
}
```

### Test Pages That Use Content

1. **About Page**: http://localhost:3000/about
   - Check "Enviar Email" button uses correct email

2. **Contact Page**: http://localhost:3000/contact
   - Check both email addresses display correctly

3. **Footer**: Any page
   - Check footer email and social media links (if configured)

## 📝 Default Values

If content is not set in admin, these defaults are used:

| Field | Default Value |
|-------|---------------|
| supportEmail | `soporte@kaostore.com` |
| contactEmail | `contacto@kaostore.com` |
| aboutUs | `null` (empty) |
| shippingPolicy | `null` (empty) |
| returnPolicy | `null` (empty) |
| faqContent | `null` (empty) |
| legalContent | `null` (empty) |
| privacyPolicy | `null` (empty) |
| termsOfService | `null` (empty) |
| socialMediaFacebook | `null` (empty) |
| socialMediaInstagram | `null` (empty) |
| socialMediaTwitter | `null` (empty) |

## 🔌 GraphQL Schema

```graphql
type Query {
  siteContent: SiteContent!
}

type SiteContent {
  supportEmail: String!
  contactEmail: String!
  aboutUs: String
  shippingPolicy: String
  returnPolicy: String
  faqContent: String
  legalContent: String
  privacyPolicy: String
  termsOfService: String
  socialMedia: SocialMedia
}

type SocialMedia {
  facebook: String
  instagram: String
  twitter: String
}
```

## 🔌 Connecting More Pages to Admin

Want to make the hardcoded content admin-editable? Here's how:

### Example: Making the About Page Admin-Editable

Currently, the About page uses hardcoded text in `storefront/app/about/page.tsx`. To make it admin-editable:

#### Step 1: Update the About Page Component

**File**: `storefront/app/about/page.tsx`

```typescript
'use client';

import { useContent } from '@/hooks/useContent';

export default function AboutPage() {
  const { content, loading } = useContent();

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Sobre Nosotros</h1>

      {/* Use content.aboutUs instead of hardcoded text */}
      <div
        className="prose max-w-none"
        dangerouslySetInnerHTML={{ __html: content.aboutUs || 'Default content here' }}
      />

      <a href={`mailto:${content.supportEmail}`} className="btn">
        Contáctanos
      </a>
    </div>
  );
}
```

#### Step 2: Add Content in Admin

1. Go to http://localhost:3001/admin
2. Navigate to **Settings**
3. Scroll to **"About Us Content"** field
4. Add your content (supports rich text/HTML)
5. Click **Save**

#### Step 3: Test

1. Refresh the About page: http://localhost:3000/about
2. Content should now display from admin

### Example: Making FAQ Admin-Editable

**File**: `storefront/app/faq/page.tsx`

```typescript
'use client';

import { useContent } from '@/hooks/useContent';

interface FAQItem {
  question: string;
  answer: string;
}

export default function FAQPage() {
  const { content, loading } = useContent();

  let faqItems: FAQItem[] = [];

  try {
    // Parse JSON FAQ content from admin
    faqItems = content.faqContent ? JSON.parse(content.faqContent) : [];
  } catch (error) {
    console.error('Failed to parse FAQ content:', error);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8">Preguntas Frecuentes</h1>

      {faqItems.map((item, index) => (
        <div key={index} className="mb-6">
          <h3 className="text-xl font-semibold">{item.question}</h3>
          <p className="text-gray-600 mt-2">{item.answer}</p>
        </div>
      ))}
    </div>
  );
}
```

**In Admin Settings**, add FAQ Content as JSON:

```json
[
  {
    "question": "¿Cuál es la política de envíos?",
    "answer": "Enviamos a toda España en 24-48 horas."
  },
  {
    "question": "¿Aceptan devoluciones?",
    "answer": "Sí, aceptamos devoluciones hasta 30 días después de la compra."
  }
]
```

### When to Use Admin-Editable vs Hardcoded

**Use Admin-Editable When:**
- ✅ Client will update content frequently
- ✅ Non-technical users need to edit
- ✅ Content changes don't require developer
- ✅ A/B testing different copy

**Use Hardcoded When:**
- ✅ Content rarely changes
- ✅ Need version control for content
- ✅ Want maximum performance
- ✅ Complex layouts that need code changes anyway

---

## 🎨 Potential Enhancements

Ideas for extending the content management system:

### 1. Admin UI Extension
- Custom "Content Manager" tab in admin
- Better UX for content editing
- Live preview of changes

### 2. Multi-language Support
- Store content in multiple languages
- Language selector in admin
- i18n support on storefront

### 3. Content Versioning
- Track content changes over time
- Revert to previous versions
- Audit log for compliance

### 4. Media Management
- Upload images for content blocks
- Image gallery in admin
- Featured images for pages

### 5. Caching Layer
- Cache content on storefront
- Invalidate cache on admin save
- Reduce API calls for better performance

### 6. Page Builder
- Drag-and-drop content blocks
- Reusable components
- Visual page editor

## 🐛 Troubleshooting

### Content Not Updating on Storefront

**Problem**: Changed content in admin but storefront still shows old values

**Solutions**:
1. Hard refresh the page (Ctrl+Shift+R or Cmd+Shift+R)
2. Clear browser cache
3. Restart storefront container: `docker-compose restart storefront`
4. Check browser console for errors

### GraphQL Query Fails

**Problem**: `siteContent` query returns error

**Solutions**:
1. Verify backend is running: `docker-compose ps`
2. Check backend logs: `docker logs vendure-backend`
3. Verify plugin is registered in `vendure-config.ts`
4. Restart backend: `docker-compose restart backend`

### Custom Fields Not Showing in Admin

**Problem**: Can't see custom fields in Settings page

**Solutions**:
1. Verify plugin is properly imported in `vendure-config.ts`
2. Check backend compilation errors
3. Clear admin UI cache
4. Log out and log back into admin

### TypeScript Errors

**Problem**: Type errors in storefront when using `useContent`

**Solutions**:
1. Verify `content-queries.ts` exports `SiteContent` interface
2. Check `useContent.ts` import paths
3. Restart TypeScript server in IDE
4. Rebuild storefront: `docker-compose build storefront`

## 📊 Performance Considerations

### Current Implementation:
- Content fetched on component mount
- Separate API call per component using `useContent`
- No caching (yet)

### Optimization Tips:
1. **Move to Context**: Create ContentProvider to fetch once and share across components
2. **Add Caching**: Cache responses for 5-10 minutes
3. **SSR**: Fetch content at build time for static pages
4. **Lazy Loading**: Only fetch content when component is visible

## 🔒 Security Notes

- Custom fields are only editable by admin users
- Shop API is read-only for content
- No authentication required to read public content
- Email addresses are validated on input
- Rich text fields are sanitized

## 📚 Additional Resources

- **Vendure Custom Fields Docs**: https://docs.vendure.io/guides/developer-guide/custom-fields/
- **Vendure Plugins Guide**: https://docs.vendure.io/guides/developer-guide/plugins/
- **GraphQL Schema Extension**: https://docs.vendure.io/guides/developer-guide/extending-the-graphql-api/

## ✅ Checklist for Deployment

Before deploying to production:

- [ ] Update default email addresses in `custom-fields.ts`
- [ ] Add all content in admin dashboard
- [ ] Test all pages that use content
- [ ] Configure social media URLs
- [ ] Set up email verification for contact forms
- [ ] Add caching layer for performance
- [ ] Configure CDN for assets
- [ ] Test on mobile devices
- [ ] Verify SEO meta tags
- [ ] Test email links work correctly

---

**Status**: ✅ Fully Implemented and Tested
**Version**: 1.0.0
**Last Updated**: November 2025
**Maintainer**: KaoStore Development Team
