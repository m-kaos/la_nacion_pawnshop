# Admin Dashboard Setup Guide

Complete guide to setting up and using the Vendure admin dashboard for your e-commerce store.

---

## Table of Contents

1. [Accessing the Admin Dashboard](#accessing-the-admin-dashboard)
2. [First-Time Setup](#first-time-setup)
3. [Dashboard Overview](#dashboard-overview)
4. [Product Management](#product-management)
5. [Collections (Categories)](#collections-categories)
6. [Inventory Management](#inventory-management)
7. [Order Management](#order-management)
8. [Customer Management](#customer-management)
9. [Settings Configuration](#settings-configuration)
10. [Content Management](#content-management)
11. [Shipping & Tax](#shipping--tax)
12. [Users & Roles](#users--roles)
13. [Best Practices](#best-practices)

--- 

## Accessing the Admin Dashboard

### Local Development

**URL:** http://localhost:3001/admin

**Default Credentials:**
- Username: `superadmin`
- Password: `superadmin`

⚠️ **IMPORTANT:** Change these credentials before deploying to production!

### Production

**URL:** `https://your-backend-domain.com/admin`

Example:
- Railway: `https://backend-production-abc123.up.railway.app/admin`
- Custom domain: `https://api.yourstore.com/admin`

---

## First-Time Setup

### Step 1: Login

1. Navigate to admin URL
2. Enter superadmin credentials
3. Click **"Sign In"**

### Step 2: Change Admin Password

🔒 **Do this immediately in production!**

1. Click your profile icon (top right)
2. Select **"My Account"**
3. Go to **"Password"** tab
4. Enter new password (strong, 16+ characters recommended)
5. Click **"Save"**

### Step 3: Configure Global Settings

1. Navigate to **Settings** (left sidebar, bottom)
2. Scroll to **"Custom Fields"** section
3. Update site content fields:
   - Support Email: `support@yourstore.com`
   - Contact Email: `contact@yourstore.com`
   - Social Media URLs (Facebook, Instagram, Twitter)
4. Click **"Save"**

See [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md) for details on managing site content.

### Step 4: Configure Shipping Methods

1. Go to **Settings** → **Shipping Methods**
2. Click **"Create new Shipping Method"**
3. Configure first method (example: Standard Shipping):
   - Name: "Standard Shipping"
   - Description: "Delivery in 5-7 business days"
   - Calculator: Flat Rate
   - Price: $9.99 (or free)
4. Click **"Create"**
5. Add more methods as needed (Express, Free Shipping, etc.)

### Step 5: Configure Payment Methods

Payment is handled via Stripe in the storefront. No configuration needed in admin unless adding additional payment methods.

### Step 6: Create Initial Collection

1. Go to **Catalog** → **Collections**
2. Click **"Create new Collection"**
3. Basic info:
   - Name: "Featured Products" (or your category name)
   - Slug: `featured` (auto-generated from name)
   - Description: Optional
4. Filters: Choose how products are included:
   - **Manual:** Select products individually
   - **Automatic:** Based on facets/attributes
5. Click **"Create"**

You're now ready to add products!

---

## Dashboard Overview

### Main Navigation (Left Sidebar)

| Section | Purpose |
|---------|---------|
| **Dashboard** | Overview stats, recent orders |
| **Catalog** | Products, collections, facets, assets |
| **Sales** | Orders, order history, reports |
| **Customers** | Customer accounts, groups |
| **Marketing** | Promotions, discounts (if enabled) |
| **Settings** | Global config, shipping, taxes, channels |

### Top Bar

- **Language Selector:** Switch interface language (if multilingual enabled)
- **Channel Selector:** Switch between sales channels (if using multiple)
- **Notifications:** System alerts
- **Profile Menu:** Account settings, logout

---

## Product Management

### Creating a New Product

1. **Go to Catalog → Products**
2. **Click "Create new Product"**

3. **Fill in Basic Info:**
   ```
   Name: Premium Leather Wallet
   Slug: premium-leather-wallet (auto-generated)
   Description: Handcrafted genuine leather wallet with RFID protection
   ```

4. **Product Variants:**
   - Click **"Add variant"**
   - Each variant can have different:
     - SKU (e.g., `WALLET-BLK-001`)
     - Price (e.g., `$49.99`)
     - Stock level (e.g., `50`)
     - Options (e.g., Color: Black, Size: Standard)

5. **Add Images:**
   - Click **"Assets"** tab
   - Click **"Select assets"** or drag & drop
   - Upload product photos (recommended: 1200x1200px)
   - Set featured image (drag to reorder)

6. **Assign to Collections:**
   - Click **"Collections"** tab
   - Select relevant collections (e.g., "Accessories", "Featured")

7. **Facets (Filters):**
   - Click **"Facets"** tab
   - Add facet values for filtering:
     - Material: Leather
     - Color: Black
     - Brand: YourBrand

8. **SEO (Optional):**
   - Add meta description
   - Set SEO-friendly slug

9. **Click "Create"**

### Bulk Product Import

For adding many products at once:

1. Go to **Catalog** → **Products**
2. Click **"Import"** button
3. Download CSV template
4. Fill template with product data
5. Upload CSV file
6. Map columns to product fields
7. Click **"Import"**

**CSV Format Example:**
```csv
name,slug,description,sku,price,stockOnHand
"Leather Wallet","leather-wallet","Genuine leather wallet","WALL-001",49.99,100
"Canvas Bag","canvas-bag","Durable canvas tote bag","BAG-001",29.99,50
```

### Editing Existing Products

1. Go to **Catalog** → **Products**
2. Click on product name
3. Make changes in any tab
4. Click **"Update"** to save

### Deleting Products

1. Select product(s) with checkboxes
2. Click **"Delete"** button
3. Confirm deletion

⚠️ **Note:** Deleting a product removes it from storefront and order history.

---

## Collections (Categories)

Collections are groups of products, similar to categories.

### Creating a Collection

1. **Go to Catalog → Collections**
2. **Click "Create new Collection"**

3. **Basic Info:**
   ```
   Name: Winter Collection
   Slug: winter-collection
   Description: Warm and cozy products for winter
   ```

4. **Parent Collection (Optional):**
   - Leave empty for top-level
   - Select parent for nested collections
   - Example: "Men's Shoes" → parent: "Men's"

5. **Filters:**
   Choose how products are added:

   **Manual Selection:**
   - Click **"Add products"**
   - Select individual products
   - Click **"Add"**

   **Automatic Rules:**
   - Click **"Add filter"**
   - Example: All products with facet "Season: Winter"
   - Products matching rules auto-added

6. **SEO & Images:**
   - Upload featured image
   - Set meta description
   - Add custom fields if configured

7. **Click "Create"**

### Collection Hierarchy

Build nested structures:
```
Home & Living
├── Furniture
│   ├── Chairs
│   └── Tables
└── Decor
    ├── Wall Art
    └── Lighting
```

**How to:**
1. Create parent: "Home & Living"
2. Create child, select parent: "Furniture" (parent: Home & Living)
3. Create grandchild: "Chairs" (parent: Furniture)

### Reordering Collections

1. Go to **Catalog** → **Collections**
2. Drag and drop to reorder
3. Changes save automatically

---

## Inventory Management

### Tracking Stock Levels

#### Per Variant:
1. Go to product → Variants tab
2. Each variant has **"Stock on Hand"** field
3. Update quantity as needed
4. Click **"Update"**

#### Bulk Update:
1. **Catalog** → **Products**
2. Select multiple products
3. Click **"Update"** → **"Stock levels"**
4. Enter quantities
5. Apply changes

### Stock Tracking Strategies

**Strategy 1: Track Inventory (Recommended)**
- Enable stock tracking for each variant
- System auto-decrements on orders
- Prevents overselling
- Shows "Out of Stock" when inventory = 0

**Strategy 2: Don't Track**
- Set "Track inventory" to OFF
- Allows unlimited orders
- Good for: Digital products, made-to-order

### Low Stock Alerts

Currently manual - check dashboard regularly.

**Manual Check:**
1. Go to **Catalog** → **Products**
2. Look for "Stock on Hand" column
3. Sort by quantity (low to high)
4. Restock items below threshold

---

## Order Management

### Viewing Orders

1. Go to **Sales** → **Orders**
2. See all orders with:
   - Order number (e.g., `#100001`)
   - Customer name
   - Total amount
   - Status
   - Date

### Order Statuses

| Status | Meaning | Action Needed |
|--------|---------|---------------|
| **AddingItems** | Cart, not checked out | None - customer is shopping |
| **ArrangingPayment** | In checkout | None - awaiting payment |
| **PaymentAuthorized** | Payment confirmed | Ship the order |
| **PaymentSettled** | Payment captured | None - system sets this |
| **PartiallyShipped** | Some items shipped | Ship remaining items |
| **Shipped** | All items shipped | None - order complete |
| **Delivered** | Customer confirmed | None - order complete |
| **Cancelled** | Order cancelled | Refund if needed |

### Processing an Order

#### 1. View Order Details
1. Click on order number
2. See:
   - Customer information
   - Shipping address
   - Items ordered
   - Payment status
   - Order history

#### 2. Fulfill Order
1. Click **"Fulfill"** button
2. Select fulfillment method:
   - **Manual:** You ship it
   - **Automatic:** Third-party fulfillment
3. Select items to fulfill (or all)
4. Click **"Create Fulfillment"**

#### 3. Add Tracking Information
1. In order details, find fulfillment
2. Click **"Add tracking code"**
3. Enter:
   - Carrier: USPS, FedEx, UPS, etc.
   - Tracking number: `1Z999AA10123456784`
4. Click **"Save"**
5. Customer receives email with tracking link

#### 4. Mark as Shipped
1. Order status auto-updates to **"Shipped"**
2. Tracking info visible in customer's order page

### Handling Returns/Refunds

#### Process Refund:
1. Open order
2. Click **"Refund"** button
3. Select items to refund
4. Enter refund amount (can be partial)
5. Add reason/notes
6. Click **"Refund"**
7. Stripe processes refund (2-10 business days)

#### Update Order Status:
- Manually change to **"Cancelled"** if needed
- Add note explaining reason

### Order Search & Filters

**Search by:**
- Order number: `#100001`
- Customer name: `John Smith`
- Customer email: `john@example.com`

**Filter by:**
- Status: PaymentAuthorized, Shipped, etc.
- Date range: Last 7 days, Last month, Custom
- Channel: Default, Wholesale, etc.

---

## Customer Management

### Viewing Customers

1. Go to **Customers** → **Customers**
2. See list of registered customers

### Customer Details

Click on customer to view:
- **Personal Info:** Name, email, phone
- **Addresses:** Saved shipping/billing addresses
- **Orders:** Complete order history
- **Notes:** Internal notes about customer

### Creating Manual Customers

1. Click **"Create new Customer"**
2. Fill in:
   - First name
   - Last name
   - Email address
   - Phone number (optional)
3. Click **"Create"**

Useful for: Phone orders, wholesale customers

### Customer Groups

Create groups for special pricing or access:

1. Go to **Customers** → **Customer groups**
2. Click **"Create new Group"**
3. Name: "Wholesale Customers"
4. Add customers to group
5. Use for:
   - Special promotions
   - Different pricing tiers
   - Exclusive products

---

## Settings Configuration

### General Settings

**Location:** Settings → General

- **Store Name:** Displayed in admin (not storefront)
- **Default Language:** English, Spanish, etc.
- **Default Currency:** USD, EUR, etc.
- **Timezone:** For order timestamps

### Custom Fields (Content Management)

**Location:** Settings → Scroll to "Custom Fields"

Available fields for editing site content:

**Email Addresses:**
- Support Email
- Contact Email

**Social Media:**
- Facebook URL
- Instagram URL
- Twitter URL

**Page Content (Optional):**
- About Us
- Shipping Policy
- Return Policy
- FAQ Content (JSON format)
- Legal Content
- Privacy Policy
- Terms of Service

**How to Edit:**
1. Click in field
2. Type or paste content
3. For rich text fields: Use formatting toolbar
4. For FAQ: Use JSON format:
   ```json
   [
     {
       "question": "What is your return policy?",
       "answer": "30-day returns on all items"
     }
   ]
   ```
5. Click **"Save"** at bottom

Changes appear on storefront after page refresh.

See [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md) for detailed guide.

### Email Settings

Configured via environment variables (see [DEPLOYMENT.md](DEPLOYMENT.md)):

- **Development:** Emails saved to `backend/static/email/test-emails/`
- **Production:** Uses SMTP server (SendGrid, Mailgun, etc.)

**Test Emails:**
1. Place test order
2. Check: http://localhost:3001/mailbox (development only)
3. Or check SMTP provider dashboard (production)

### Payment Settings

Stripe is configured via environment variables:
- `STRIPE_SECRET_KEY` (backend)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` (storefront)

No admin configuration needed.

---

## Shipping & Tax

### Shipping Methods

**Location:** Settings → Shipping Methods

#### Create Shipping Method:

1. Click **"Create new Shipping Method"**
2. **Basic Info:**
   - Name: "Standard Shipping"
   - Code: `standard-shipping`
   - Description: "Delivery in 5-7 business days"
3. **Checker:** When is this method available?
   - "Default Shipping Eligibility Checker" (always)
   - Or add rules (order total, weight, etc.)
4. **Calculator:** How much does it cost?
   - **Flat Rate:** Fixed price (e.g., $9.99)
   - **Rate per Item:** $5 × quantity
   - **Order Total Percentage:** 10% of order
   - **Weight-based:** Custom
5. **Fulfillment Handler:** How is it fulfilled?
   - Manual: Default
   - Automatic: If using third-party
6. Click **"Create"**

#### Example Configurations:

**Free Shipping (over $50):**
- Checker: Order total > $50
- Calculator: Flat Rate = $0

**Express Shipping:**
- Checker: Default
- Calculator: Flat Rate = $19.99

**Local Pickup:**
- Checker: Shipping country = USA
- Calculator: Flat Rate = $0

### Tax Configuration

**Location:** Settings → Tax Categories & Tax Rates

#### Create Tax Rate:

1. **Settings** → **Tax Rates**
2. Click **"Create new Tax Rate"**
3. Configure:
   - Name: "California Sales Tax"
   - Zone: California (create zone if needed)
   - Rate: 8.25%
   - Category: Standard (or create specific)
4. Click **"Create"**

#### Tax Zones:

1. **Settings** → **Zones**
2. Click **"Create new Zone"**
3. Add:
   - Name: "California"
   - Members: Add countries/states
4. Use zone in tax rates

---

## Users & Roles

### Creating Admin Users

**Location:** Settings → Administrators

1. Click **"Create new Administrator"**
2. Fill in:
   - Email: `manager@yourstore.com`
   - First name & Last name
   - Password
3. Assign role:
   - **SuperAdmin:** Full access (be careful!)
   - **Administrator:** Most permissions
   - **ReadOnly:** View-only access
   - **Custom:** Create custom roles
4. Click **"Create"**

### Custom Roles (Advanced)

Create roles with specific permissions:

1. **Settings** → **Roles**
2. Click **"Create new Role"**
3. Name: "Warehouse Manager"
4. Select permissions:
   - ✅ View orders
   - ✅ Update orders
   - ✅ Create fulfillments
   - ❌ Delete orders
   - ❌ Access settings
5. Click **"Create"**
6. Assign role to admin users

**Use Cases:**
- Warehouse staff: Can fulfill orders only
- Marketing team: Can manage products and promotions
- Customer support: Can view orders and customers

---

## Content Management

This template supports **hybrid content management** - some content is hardcoded, some is admin-editable.

### Admin-Editable Content

**Currently Available:**
- Support email address
- Contact email address
- Social media links (Facebook, Instagram, Twitter)

**How to Edit:**
1. Go to **Settings**
2. Scroll to **"Custom Fields"** section
3. Update fields
4. Click **"Save"**
5. Refresh storefront to see changes

### Hardcoded Content (Requires Code Changes)

**Currently Hardcoded:**
- About Us page text
- Shipping policy
- Return policy
- FAQ questions and answers
- Legal/Terms content

**To Edit:**
- See [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)
- Or connect to admin (see [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md))

---

## Best Practices

### Product Management

✅ **Do:**
- Use high-quality product images (1200x1200px minimum)
- Write detailed, SEO-friendly descriptions
- Set accurate stock levels
- Use consistent SKU naming (e.g., `PROD-CAT-001`)
- Add products to relevant collections
- Set up facets for filtering (color, size, brand)

❌ **Don't:**
- Use stock photos without permission
- Leave descriptions empty
- Forget to add prices
- Create products without images

### Inventory

✅ **Do:**
- Enable stock tracking for physical products
- Check low-stock items weekly
- Update inventory after receiving shipments
- Set up reorder points (manual tracking)

❌ **Don't:**
- Allow overselling (enable stock tracking!)
- Forget to update stock levels
- Mix up variant quantities

### Orders

✅ **Do:**
- Process orders within 24 hours
- Add tracking numbers to all shipments
- Send updates to customers
- Handle refunds promptly (2-3 business days)
- Keep internal notes on complex orders

❌ **Don't:**
- Leave orders in "PaymentAuthorized" for days
- Ship without adding tracking info
- Ignore customer messages
- Refund without documenting reason

### Security

✅ **Do:**
- Change default admin password immediately
- Use strong, unique passwords (16+ characters)
- Create separate admin accounts for each team member
- Use least-privilege access (custom roles)
- Log out when finished
- Enable 2FA if available (check Vendure docs)

❌ **Don't:**
- Share admin credentials
- Use "admin" or "password" as password
- Give everyone SuperAdmin access
- Stay logged in on shared computers

### Backups

✅ **Do:**
- Enable automatic database backups (Railway, etc.)
- Export product catalog periodically (CSV)
- Keep copy of environment variables
- Document custom configurations

❌ **Don't:**
- Rely on single backup
- Forget to test restore process
- Delete old backups too quickly

---

## Keyboard Shortcuts

Speed up your workflow:

| Shortcut | Action |
|----------|--------|
| `Ctrl/Cmd + K` | Quick search (products, orders, customers) |
| `Ctrl/Cmd + S` | Save current form |
| `Ctrl/Cmd + /` | Show shortcuts panel |
| `Escape` | Close modal/drawer |

---

## Common Tasks Quick Reference

### How to...

**Add a new product:**
Catalog → Products → Create new Product → Fill info → Create

**Create a sale/discount:**
Marketing → Promotions → Create → Set conditions → Create
(Note: Promotions plugin may need to be enabled)

**Export order data:**
Sales → Orders → Export → Select format (CSV/Excel) → Download

**Change product prices:**
Catalog → Products → Click product → Variants tab → Update price → Update

**Add a new admin user:**
Settings → Administrators → Create new Administrator → Assign role → Create

**Configure free shipping:**
Settings → Shipping Methods → Create → Flat Rate ($0) → Create

**Find an order:**
Sales → Orders → Use search box → Enter order # or customer email

**Add tracking to order:**
Sales → Orders → Click order → Add tracking code → Save

**Issue refund:**
Sales → Orders → Click order → Refund → Select items → Refund

**Update site email:**
Settings → Custom Fields → Update Support/Contact Email → Save

---

## Troubleshooting

### Can't Login

- Verify URL is correct: `http://localhost:3001/admin` (development)
- Check credentials: Default is `superadmin` / `superadmin`
- Clear browser cache and cookies
- Check backend is running: `docker-compose ps`

### Changes Not Saving

- Look for red error messages below fields
- Check required fields are filled
- Verify you have permission (check role)
- Try logging out and back in

### Products Not Showing in Storefront

- Ensure product is **enabled** (toggle in product edit)
- Check product has at least one variant
- Verify variant has price set
- Add product to a collection
- Refresh storefront

### Images Not Uploading

- Check file size (< 10MB recommended)
- Use supported formats: JPG, PNG, GIF, WebP
- Verify asset server is running
- Check browser console for errors

### Orders Missing

- Check you're viewing correct channel (if using multiple)
- Verify date range filter isn't too narrow
- Search by customer email or order number
- Check order status filter (not set to single status)

---

## Getting Help

**Template Documentation:**
- [README.md](README.md) - Template overview
- [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) - Branding and content
- [DEPLOYMENT.md](DEPLOYMENT.md) - Production deployment
- [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md) - Content system

**Vendure Resources:**
- Official Docs: https://docs.vendure.io/
- GraphQL API: http://localhost:3001/admin-api (development)
- Community Discord: https://vendure.io/community

---

**You're all set!** Start adding products and configuring your store. 🎉
