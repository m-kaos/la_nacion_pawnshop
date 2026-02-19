# KaoStore E-commerce Template

![Version](https://img.shields.io/badge/version-1.0.0-blue)
![License](https://img.shields.io/badge/license-MIT-green)
![Node](https://img.shields.io/badge/node-%3E%3D20.0.0-brightgreen)
![Docker](https://img.shields.io/badge/docker-ready-blue)

Professional, production-ready e-commerce template built with **Vendure** & **Next.js**. Perfect for quickly spinning up custom online stores for clients.

---

## ✨ Features

### 🛒 **Complete E-commerce Functionality**
- Product catalog with categories and variants
- Shopping cart with real-time updates
- Multi-step checkout flow
- Stripe payment integration
- Order tracking with status timeline
- Customer account management

### 👤 **Account Management**
- User registration and authentication
- Profile and password management
- Address book (multiple addresses)
- Order history with search
- 30-day sessions with "Remember Me"

### 📦 **Order Management**
- Complete order tracking page
- 4-stage status timeline
- Payment information display
- Shipping tracking codes
- Order confirmation emails

### 🎨 **Professional UI/UX**
- Modern, responsive design
- Spanish language interface
- Mobile-first approach
- Red accent color scheme (easily customizable)
- Smooth animations and transitions

### ⚙️ **Admin Content Management**
- **Hybrid approach**: Choose between hardcoded or admin-editable content
- 12 custom fields for site content
- Email addresses, social media links
- Policies and FAQ (optional admin editing)
- GraphQL API for content retrieval

### 📄 **Static Pages**
- About Us
- Contact form
- Shipping policy
- Return policy
- FAQ (17 questions)
- Legal/Terms & Privacy
- Sitemap

### 🔧 **Developer-Friendly**
- Docker Compose for easy setup
- TypeScript throughout
- Well-documented code
- Environment variable configuration
- Hot reload in development
- Production-ready build process

---

## 🚀 Quick Start

### Prerequisites
- **Docker** & **Docker Compose** installed
- **Node.js 20+** (optional, for local development)
- **Git**

### 5-Minute Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd ecommerce-template
   ```

2. **Configure environment**
   ```bash
   cp .env.example .env
   # Edit .env if needed (defaults work for development)
   ```

3. **Start all services**
   ```bash
   docker-compose up
   ```

4. **Access the applications**
   - 🛍️ **Storefront**: http://localhost:3000
   - 🔧 **Admin Dashboard**: http://localhost:3001/admin
   - 📧 **Dev Mailbox**: http://localhost:3001/mailbox
   - 🔌 **Shop API**: http://localhost:3001/shop-api
   - ⚙️ **Admin API**: http://localhost:3001/admin-api

5. **Login to Admin**
   - Username: `superadmin`
   - Password: `superadmin`
   - **⚠️ Change these in production!**

6. **Populate sample data** (optional)
   ```bash
   docker exec vendure-backend npm run populate
   ```

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| **[CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)** | How to customize branding, colors, and content |
| **[DEPLOYMENT.md](DEPLOYMENT.md)** | Deploy to Vercel, Railway, or Cloudflare Workers |
| **[ADMIN_SETUP.md](ADMIN_SETUP.md)** | Admin dashboard walkthrough and configuration |
| **[ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md)** | How to use the content management system |
| **[IMPLEMENTATION_STATUS.md](IMPLEMENTATION_STATUS.md)** | Feature completion status |

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        DOCKER COMPOSE                       │
├─────────────────┬─────────────────┬─────────────────────────┤
│                 │                 │                         │
│  STOREFRONT     │   BACKEND       │   POSTGRESQL            │
│  (Next.js 14)   │   (Vendure)     │   (Database)            │
│  Port: 3000     │   Port: 3001    │   Port: 5432            │
│                 │                 │                         │
│  - React 19     │   - Node 20     │   - v15                 │
│  - TypeScript   │   - GraphQL API │   - Persistent Data     │
│  - Tailwind CSS │   - REST APIs   │                         │
│  - Stripe UI    │   - Admin UI    │                         │
│                 │                 │                         │
└─────────────────┴─────────────────┴─────────────────────────┘
         │                  │                    │
         └──────────────────┼────────────────────┘
                            │
                     GraphQL/REST APIs
```

### Tech Stack

**Frontend (Storefront)**
- [Next.js 14](https://nextjs.org/) - React framework with App Router
- [React 19](https://react.dev/) - UI library
- [TypeScript](https://www.typescriptlang.org/) - Type safety
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS
- [urql](https://formidable.com/open-source/urql/) - GraphQL client
- [Stripe Elements](https://stripe.com/payments/elements) - Payment UI

**Backend (API & Admin)**
- [Vendure 3.5.0](https://vendure.io/) - Headless commerce framework
- [NestJS](https://nestjs.com/) - Server framework
- [GraphQL](https://graphql.org/) - API query language
- [TypeORM](https://typeorm.io/) - Database ORM
- [PostgreSQL](https://www.postgresql.org/) - Relational database

**DevOps**
- [Docker](https://www.docker.com/) - Containerization
- [Docker Compose](https://docs.docker.com/compose/) - Multi-container orchestration

---

## 🎨 Customization Quick Reference

### Change Store Name
- `storefront/app/layout.tsx` - Line 12 (page title)
- `storefront/components/Header.tsx` - Line 15 (logo/brand)
- `backend/src/vendure-config.ts` - Line 76 (email sender)

### Change Colors
- `storefront/tailwind.config.ts` - Lines 12-24 (primary palette)
- Replace `#dc2626` (red) with your brand color

### Update Content
- **Pages**: `storefront/app/about/`, `/contact/`, etc.
- **Admin**: Settings → Custom Fields section
- See [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md) for details

---

## 🎯 Content Management Modes

This template supports **two content management approaches**:

### 1. **Hardcoded Content** (Current Default)
- ✅ Fast setup, no admin configuration needed
- ✅ Version controlled, easy to track changes
- ✅ Best for stable content like policies and legal text
- **Location**: Static page files in `storefront/app/`

### 2. **Admin-Editable Content** (Partially Implemented)
- ✅ Non-technical users can update content
- ✅ No code changes or redeployment needed
- ✅ Currently active for: emails, social media links
- **Location**: Admin → Settings → Custom Fields

**You can choose which approach fits your needs**, or use both (hybrid). See [ADMIN_CONTENT_MANAGEMENT.md](ADMIN_CONTENT_MANAGEMENT.md) for details on connecting more pages to admin.

---

## 📦 Project Structure

```
ecommerce-template/
├── backend/                    # Vendure backend
│   ├── src/
│   │   ├── index.ts           # Entry point
│   │   ├── vendure-config.ts  # Main configuration ⚙️
│   │   ├── plugins/
│   │   │   └── content-management/  # Custom CMS plugin
│   │   ├── migrations/        # Database migrations
│   │   └── populate.ts        # Sample data seeder
│   ├── static/                # Static assets & email templates
│   └── Dockerfile
│
├── storefront/                # Next.js storefront
│   ├── app/                   # App Router pages
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Homepage
│   │   ├── products/          # Product catalog
│   │   ├── cart/              # Shopping cart
│   │   ├── checkout/          # Checkout flow
│   │   ├── account/           # User account pages
│   │   ├── orders/            # Order tracking
│   │   ├── about/             # Static content pages
│   │   ├── contact/
│   │   ├── shipping/
│   │   ├── returns/
│   │   ├── faq/
│   │   ├── legal/
│   │   └── sitemap/
│   ├── components/            # React components
│   │   ├── Header.tsx         # Main navigation
│   │   ├── Footer.tsx         # Site footer
│   │   ├── ProductCard.tsx
│   │   └── StripePaymentForm.tsx
│   ├── contexts/              # React contexts
│   │   ├── AuthContext.tsx    # Authentication
│   │   └── CartContext.tsx    # Shopping cart
│   ├── hooks/                 # Custom hooks
│   │   └── useContent.ts      # Content management hook
│   ├── lib/                   # Utilities
│   │   ├── graphql-client.ts
│   │   └── content-queries.ts
│   ├── tailwind.config.ts     # Tailwind configuration 🎨
│   └── Dockerfile
│
├── docker-compose.yml          # Multi-container orchestration
├── .env.example               # Environment template
├── README.md                  # This file
├── CUSTOMIZATION_GUIDE.md     # How to customize
├── DEPLOYMENT.md              # Deployment instructions
├── ADMIN_SETUP.md             # Admin dashboard guide
└── LICENSE                    # MIT License
```

---

## 🔧 Development Commands

### Docker Commands
```bash
# Start all services
docker-compose up

# Start in background
docker-compose up -d

# Rebuild containers
docker-compose build

# Stop all services
docker-compose down

# Stop and remove volumes (CAUTION: deletes database)
docker-compose down -v

# View logs
docker-compose logs -f

# View specific service logs
docker-compose logs -f storefront
docker-compose logs -f backend
```

### Database Commands
```bash
# Populate sample data
docker exec vendure-backend npm run populate

# Run migrations
docker exec vendure-backend npm run migrate:run

# Access PostgreSQL CLI
docker exec -it vendure-postgres psql -U postgres -d vendure
```

### Container Management
```bash
# Restart specific service
docker-compose restart storefront
docker-compose restart backend

# Rebuild and restart
docker-compose build storefront && docker-compose restart storefront

# Enter container shell
docker exec -it vendure-storefront sh
docker exec -it vendure-backend sh
```

---

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Find process using port 3000
lsof -i :3000  # macOS/Linux
netstat -ano | findstr :3000  # Windows

# Kill the process or change port in docker-compose.yml
```

### Database Connection Error
```bash
# Check if postgres container is running
docker-compose ps

# Restart postgres
docker-compose restart postgres

# If persistent, delete volume and restart
docker-compose down -v
docker-compose up
```

### Containers Won't Start
```bash
# View full logs
docker-compose logs

# Clean Docker system
docker system prune -f

# Rebuild from scratch
docker-compose down -v
docker-compose build --no-cache
docker-compose up
```

### Permission Errors (Linux)
```bash
# Fix file permissions
sudo chown -R $USER:$USER .

# Or run with sudo (not recommended)
sudo docker-compose up
```

### Storefront Shows 502 Bad Gateway
- Backend is still starting up (wait 30-60 seconds)
- Check backend logs: `docker-compose logs backend`
- Verify backend is healthy: `curl http://localhost:3001/health`

### Admin Dashboard Won't Load
- Wait for backend to fully initialize
- Clear browser cache
- Check: `docker-compose logs backend` for errors
- Verify admin plugin is configured in `vendure-config.ts`

---

## 🚀 Deployment

This template can be deployed to multiple platforms. See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed guides:

- **Vercel** (Storefront) - Automatic deployments from Git
- **Railway** (Backend + Database) - One-click deployment
- **Cloudflare Workers** (Docker Container) - Edge deployment

Quick deployment checklist:
- [ ] Update environment variables for production
- [ ] Change admin credentials
- [ ] Set up production database
- [ ] Configure Stripe live keys
- [ ] Set up SMTP for emails
- [ ] Configure custom domain
- [ ] Enable SSL/HTTPS
- [ ] Test complete checkout flow

---

## 📝 Environment Variables

Key variables you'll need to configure:

| Variable | Description | Default |
|----------|-------------|---------|
| `DB_HOST` | Database hostname | `postgres` |
| `DB_NAME` | Database name | `vendure` |
| `DB_USERNAME` | Database user | `postgres` |
| `DB_PASSWORD` | Database password | `postgres` |
| `COOKIE_SECRET` | Session encryption key | **CHANGE IN PROD!** |
| `SUPERADMIN_USERNAME` | Admin login username | `superadmin` |
| `SUPERADMIN_PASSWORD` | Admin login password | **CHANGE IN PROD!** |
| `SHOP_URL` | Storefront URL | `http://localhost:3000` |
| `STRIPE_SECRET_KEY` | Stripe API key | `sk_test_...` |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe public key | `pk_test_...` |

See `.env.example` for complete list with detailed comments.

---

## 🤝 Contributing

This is a template project. Feel free to:
- Fork and customize for your needs
- Report bugs or issues
- Suggest improvements
- Share your implementations

---

## 📄 License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.

You are free to:
- ✅ Use commercially
- ✅ Modify
- ✅ Distribute
- ✅ Sublicense

With the only requirement of including the original copyright notice.

---

## 🙏 Credits

Built with these amazing technologies:

- [Vendure](https://vendure.io/) - Headless Commerce Framework
- [Next.js](https://nextjs.org/) - React Framework
- [Stripe](https://stripe.com/) - Payment Processing
- [Tailwind CSS](https://tailwindcss.com/) - CSS Framework
- [PostgreSQL](https://www.postgresql.org/) - Database

---

## 📞 Support

For template-related questions:
- Check the documentation in this repository
- Review [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)
- See [Vendure docs](https://docs.vendure.io/) for backend issues
- See [Next.js docs](https://nextjs.org/docs) for frontend issues

---

## 🎯 What's Next?

After setup, you should:

1. **Read the customization guide** - [CUSTOMIZATION_GUIDE.md](CUSTOMIZATION_GUIDE.md)
2. **Configure admin dashboard** - [ADMIN_SETUP.md](ADMIN_SETUP.md)
3. **Add your products** - Use admin panel at localhost:3001/admin
4. **Customize branding** - Colors, logo, store name
5. **Update content** - Policies, about us, contact info
6. **Test checkout flow** - With Stripe test cards
7. **Deploy to production** - See [DEPLOYMENT.md](DEPLOYMENT.md)

---

**Happy Selling! 🛍️**

Made with ❤️ using Vendure & Next.js
