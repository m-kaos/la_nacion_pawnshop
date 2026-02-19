# Scripts Directory

This directory contains utility scripts for setting up and managing the e-commerce template.

## 📁 Directory Structure

```
scripts/
├── README.md                    # This file
├── check-env.js                 # Validate environment variables
├── generate-secrets.js          # Generate secure random secrets
├── setup-template.sh            # Setup wizard (Linux/Mac)
├── setup-template.bat           # Setup wizard (Windows)
├── dev-utils/                   # Development utilities (optional)
└── archive/                     # Old development scripts (not needed for template)
```

---

## 🚀 Main Scripts (Use These)

### 1. Setup Template

**Purpose:** Quick setup wizard for new client projects

**Usage:**
```bash
# Linux/Mac
npm run setup
# or
bash scripts/setup-template.sh

# Windows
npm run setup:windows
# or
scripts\setup-template.bat
```

**What it does:**
- Checks prerequisites (Docker, Node.js)
- Creates `.env` file from `.env.example`
- Optionally prompts for store name
- Starts Docker containers
- Displays next steps

---

### 2. Check Environment

**Purpose:** Validate environment variables before deployment

**Usage:**
```bash
npm run check-env
# or
node scripts/check-env.js
```

**What it does:**
- ✅ Verifies all required variables are set
- ⚠️ Warns about insecure defaults in production
- 🔍 Validates Stripe key configuration
- 🌐 Checks URL configuration
- 📊 Provides summary report

**When to use:**
- Before deploying to production
- After updating `.env` file
- When troubleshooting configuration issues

---

### 3. Generate Secrets

**Purpose:** Generate cryptographically secure secrets for production

**Usage:**
```bash
npm run generate-secrets
# or
node scripts/generate-secrets.js
```

**What it does:**
- Generates random secrets for:
  - `COOKIE_SECRET` (64 bytes)
  - `DB_PASSWORD` (32 bytes)
  - `MEILI_MASTER_KEY` (32 bytes)
  - `MINIO_ROOT_PASSWORD` (24 bytes)
  - `SUPERADMIN_PASSWORD` (16 bytes)
- Optionally saves to `.env.generated` file
- Provides instructions for next steps

**When to use:**
- Before first production deployment
- When rotating secrets for security

---

## 📦 Development Utilities (Optional)

The `dev-utils/` directory is for optional development scripts you might want to add:

**Examples:**
- Database seeders
- Data migration scripts
- Testing utilities
- Custom development tools

**Note:** These are not required for the template to work.

---

## 🗄️ Archive Directory

The `archive/` directory contains old development scripts that were used during the template's creation but are **not needed for template users**:

**What's in there:**
- Debug scripts
- Setup scripts for specific features
- Product creation utilities
- Testing scripts
- Shipping/tax configuration scripts

**Should you use them?**
- ❌ No - These were for development only
- ❌ They may not work with the current template version
- ❌ They may have hardcoded values specific to development

**Why keep them?**
- For reference if you need to create similar scripts
- For understanding how certain features were implemented
- For potential debugging in edge cases

---

## 🛠️ Creating Your Own Scripts

If you need custom scripts for your client projects, follow these guidelines:

### 1. Location

- **Production scripts** → `scripts/` (root level)
- **Development utilities** → `scripts/dev-utils/`
- **Old/deprecated** → `scripts/archive/`

### 2. Naming Convention

Use descriptive kebab-case names:
- ✅ `setup-custom-shipping.js`
- ✅ `import-products.js`
- ✅ `migrate-data.js`
- ❌ `script.js`
- ❌ `temp.js`

### 3. Documentation

Add a header comment to each script:

```javascript
#!/usr/bin/env node

/**
 * Script Name
 *
 * Description of what this script does and when to use it.
 *
 * Usage:
 *   node scripts/your-script.js
 *   npm run your-script
 */
```

### 4. Add to package.json

Make scripts easily runnable:

```json
{
  "scripts": {
    "your-script": "node scripts/your-script.js"
  }
}
```

---

## 📝 Script Development Best Practices

1. **Environment Variables**
   - Use `process.env` for configuration
   - Provide sensible defaults
   - Validate required variables

2. **Error Handling**
   - Wrap in try-catch blocks
   - Provide helpful error messages
   - Exit with appropriate codes (0 = success, 1 = error)

3. **User Feedback**
   - Use colored output for clarity
   - Show progress for long operations
   - Confirm destructive actions

4. **Idempotency**
   - Scripts should be safe to run multiple times
   - Check current state before making changes
   - Skip already-completed steps

5. **Documentation**
   - Comment complex logic
   - Include usage examples
   - Document expected behavior

---

## 🔗 Related Documentation

- [README.md](../README.md) - Main template overview
- [CUSTOMIZATION_GUIDE.md](../CUSTOMIZATION_GUIDE.md) - Customization instructions
- [DEPLOYMENT.md](../DEPLOYMENT.md) - Deployment guide
- [.env.example](../.env.example) - Environment variables reference

---

## ❓ Need Help?

If you're having issues with scripts:

1. **Check prerequisites**: Docker, Node.js 20+
2. **Verify environment**: Run `npm run check-env`
3. **Review logs**: Check error messages carefully
4. **Consult docs**: See main documentation files

---

**Happy scripting!** 🚀
