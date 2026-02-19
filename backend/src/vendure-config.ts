/**
 * Vendure Configuration File
 *
 * This is the main configuration file for the Vendure backend.
 * It configures:
 * - API endpoints and security
 * - Database connection
 * - Authentication and sessions
 * - Plugins (Admin UI, Email, Assets, Content Management)
 *
 * For customization instructions, see:
 * - README.md
 * - CUSTOMIZATION_GUIDE.md
 * - DEPLOYMENT.md
 */

import {
  dummyPaymentHandler,
  DefaultJobQueuePlugin,
  DefaultSearchPlugin,
  VendureConfig,
  DefaultStockAllocationStrategy,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import path from 'path';
import { ContentManagementPlugin } from './plugins/content-management';

// Detect environment (development vs production)
const IS_DEV = process.env.NODE_ENV !== 'production';

/**
 * Main Vendure Configuration
 *
 * This configuration object defines all settings for the Vendure backend.
 * Environment variables are used for sensitive values and deployment-specific settings.
 */
export const config: VendureConfig = {
  /**
   * API Options
   *
   * Configures the GraphQL API endpoints and security settings.
   * - Admin API: Used by admin dashboard (port 3001/admin-api)
   * - Shop API: Used by storefront (port 3001/shop-api)
   * - Playground: GraphQL IDE (enabled in development only)
   * - CORS: Allow cross-origin requests from storefront
   */
  apiOptions: {
    port: 3001, // Backend server port
    adminApiPath: 'admin-api', // Admin GraphQL endpoint
    shopApiPath: 'shop-api', // Storefront GraphQL endpoint
    adminApiPlayground: IS_DEV, // GraphQL playground for admin API
    adminApiDebug: IS_DEV, // Debug mode (shows full errors)
    shopApiPlayground: IS_DEV, // GraphQL playground for shop API
    shopApiDebug: IS_DEV, // Debug mode for shop API
    cors: {
      origin: true, // Allow all origins (restrict in production if needed)
      credentials: true, // Allow cookies to be sent
    },
  },

  /**
   * Authentication Options
   *
   * Configures how users authenticate and sessions are managed.
   * ⚠️ IMPORTANT: Change SUPERADMIN credentials before production!
   * ⚠️ IMPORTANT: Change COOKIE_SECRET before production!
   */
  authOptions: {
    tokenMethod: ['bearer', 'cookie'], // Support both token types
    requireVerification: false, // Skip email verification (set true in production)
    superadminCredentials: {
      // Admin dashboard login credentials
      // ⚠️ Change these in production via environment variables!
      identifier: process.env.SUPERADMIN_USERNAME || 'superadmin',
      password: process.env.SUPERADMIN_PASSWORD || 'superadmin',
    },
    cookieOptions: {
      secret: process.env.COOKIE_SECRET || 'cookie-secret-change-me', // Encryption key
      httpOnly: true, // Prevent JavaScript access to cookies
      sameSite: 'lax', // CSRF protection
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days in milliseconds
    },
    sessionDuration: '30d', // Keep users logged in for 30 days
  },
  /**
   * Database Connection Options
   *
   * Configures PostgreSQL database connection.
   * ⚠️ IMPORTANT: Set synchronize=false in production!
   * Use migrations instead of auto-sync in production.
   */
  dbConnectionOptions: {
    type: 'postgres', // Database type
    synchronize: IS_DEV, // Auto-sync schema (ONLY in development!)
    logging: false, // Disable SQL query logging (set true for debugging)
    database: process.env.DB_NAME || 'vendure',
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 5432,
    username: process.env.DB_USERNAME || 'postgres',
    password: process.env.DB_PASSWORD || 'postgres',
    migrations: [path.join(__dirname, './migrations/*.+(js|ts)')],
  },

  /**
   * Payment Options
   *
   * Currently using dummy handler for testing.
   * In production, integrate with Stripe via the storefront.
   * Stripe integration is handled in the Next.js app, not here.
   */
  paymentOptions: {
    paymentMethodHandlers: [dummyPaymentHandler], // Dummy handler for testing
  },

  /**
   * Order Options
   *
   * Configures order-related behavior including stock allocation.
   * Stock is allocated (deducted from inventory) immediately when payment is authorized,
   * ensuring products are reserved as soon as purchase is completed.
   */
  orderOptions: {
    stockAllocationStrategy: new DefaultStockAllocationStrategy(),
  },

  /**
   * Custom Fields
   *
   * Custom fields are added via plugins (see ContentManagementPlugin below).
   * This keeps the configuration clean and modular.
   */
  customFields: {},

  /**
   * Plugins
   *
   * Vendure functionality is extended through plugins.
   * Each plugin adds specific features to the system.
   */
  plugins: [
    /**
     * Asset Server Plugin
     *
     * Handles file uploads (product images, etc.).
     * Files are stored in backend/static/assets/ directory.
     *
     * For production: Consider using AWS S3, Cloudflare R2, or DigitalOcean Spaces
     * See: https://docs.vendure.io/guides/core-concepts/assets/
     */
    AssetServerPlugin.init({
      route: 'assets', // Access uploaded files at /assets
      assetUploadDir: path.join(__dirname, '../static/assets'), // Local storage
      // For production S3 configuration, see DEPLOYMENT.md
    }),

    /**
     * Job Queue Plugin
     *
     * Handles background tasks (sending emails, updating search index, etc.).
     * Uses database for persistent job storage.
     */
    DefaultJobQueuePlugin.init({ useDatabaseForBuffer: true }),

    /**
     * Search Plugin
     *
     * Enables product search functionality.
     * Indexes product data for fast searching.
     */
    DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: true }),

    /**
     * Email Plugin
     *
     * Handles sending transactional emails (order confirmations, password resets, etc.).
     * Development: Saves emails to disk (view at /mailbox)
     * Production: Configure SMTP server via environment variables
     *
     * See CUSTOMIZATION_GUIDE.md for SMTP setup instructions.
     */
    EmailPlugin.init({
      devMode: true, // Set to false in production (uses SMTP instead)
      outputPath: path.join(__dirname, '../static/email/test-emails'), // Dev: Save emails here
      route: 'mailbox', // Dev: View emails at http://localhost:3001/mailbox
      handlers: defaultEmailHandlers, // Built-in email templates
      templatePath: path.join(__dirname, '../static/email/templates'), // Custom templates
      globalTemplateVars: {
        // Update store name and email in production:
        fromAddress: '"Vendure Store" <noreply@vendure-store.com>',
        verifyEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/verify',
        passwordResetUrl: process.env.SHOP_URL || 'http://localhost:3000/reset-password',
        changeEmailAddressUrl: process.env.SHOP_URL || 'http://localhost:3000/change-email',
      },
      // For production SMTP, add transport configuration (see DEPLOYMENT.md)
    }),

    /**
     * Admin UI Plugin
     *
     * Provides the web-based admin dashboard.
     * Access at: http://localhost:3001/admin
     *
     * To customize branding (logo, colors), see CUSTOMIZATION_GUIDE.md
     */
    AdminUiPlugin.init({
      route: 'admin', // Admin dashboard at /admin
      port: 3002, // Admin UI build server port (internal)
    }),

    /**
     * Content Management Plugin (Custom)
     *
     * Enables admin-editable site content (emails, social media, policies, etc.).
     * Adds custom fields to GlobalSettings accessible via GraphQL.
     *
     * See ADMIN_CONTENT_MANAGEMENT.md for usage instructions.
     */
    ContentManagementPlugin,
  ],
};
