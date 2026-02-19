#!/usr/bin/env node

/**
 * Environment Variables Checker
 *
 * This script validates that all required environment variables are set
 * and warns about insecure default values in production.
 *
 * Usage:
 *   node scripts/check-env.js
 *   npm run check-env
 */

const fs = require('fs');
const path = require('path');

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

// Helper functions
const log = {
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ ${msg}${colors.reset}`),
  header: (msg) => console.log(`\n${colors.blue}${msg}${colors.reset}`),
};

// Required environment variables for each component
const requirements = {
  backend: {
    required: [
      'DB_HOST',
      'DB_PORT',
      'DB_NAME',
      'DB_USERNAME',
      'DB_PASSWORD',
      'SUPERADMIN_USERNAME',
      'SUPERADMIN_PASSWORD',
      'COOKIE_SECRET',
      'SHOP_URL',
    ],
    optional: [
      'STRIPE_SECRET_KEY',
      'SMTP_HOST',
      'SMTP_PORT',
      'SMTP_USER',
      'SMTP_PASSWORD',
      'REDIS_HOST',
      'REDIS_PORT',
    ],
  },
  storefront: {
    required: [
      'NEXT_PUBLIC_VENDURE_SHOP_API_URL',
      'NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY',
    ],
    optional: [
      'STRIPE_SECRET_KEY',
    ],
  },
};

// Insecure default values that should be changed in production
const insecureDefaults = {
  SUPERADMIN_USERNAME: 'superadmin',
  SUPERADMIN_PASSWORD: 'superadmin',
  COOKIE_SECRET: 'cookie-secret-change-in-production',
  DB_PASSWORD: 'postgres',
  MINIO_ROOT_USER: 'minioadmin',
  MINIO_ROOT_PASSWORD: 'minioadmin',
  MEILI_MASTER_KEY: 'masterKey',
};

// Load environment variables from .env file
function loadEnv(envPath) {
  if (!fs.existsSync(envPath)) {
    return null;
  }

  const envContent = fs.readFileSync(envPath, 'utf-8');
  const env = {};

  envContent.split('\n').forEach((line) => {
    // Skip comments and empty lines
    if (line.trim().startsWith('#') || !line.trim()) {
      return;
    }

    const match = line.match(/^([^=]+)=(.*)$/);
    if (match) {
      const key = match[1].trim();
      const value = match[2].trim();
      env[key] = value;
    }
  });

  return env;
}

// Check if value looks like a placeholder
function isPlaceholder(value) {
  const placeholders = [
    'your-',
    'your_',
    'change-this',
    'replace-me',
    'todo',
    'example',
    'test_',
    'sk_test_',
    'pk_test_',
  ];

  return placeholders.some((p) => value.toLowerCase().includes(p));
}

// Check environment variables
function checkEnvironment() {
  log.header('🔍 Environment Variables Checker');
  console.log('Validating environment configuration...\n');

  const rootDir = path.resolve(__dirname, '..');
  const envPath = path.join(rootDir, '.env');
  const envExamplePath = path.join(rootDir, '.env.example');

  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    log.error('.env file not found');
    log.info(`Copy .env.example to .env: cp .env.example .env`);
    process.exit(1);
  }

  log.success('.env file found');

  // Load environment variables
  const env = loadEnv(envPath);
  const isProduction = env.NODE_ENV === 'production';

  let errors = 0;
  let warnings = 0;

  // Check required variables
  log.header('📋 Required Variables');

  const allRequired = [
    ...requirements.backend.required,
    ...requirements.storefront.required,
  ];

  const uniqueRequired = [...new Set(allRequired)];

  uniqueRequired.forEach((varName) => {
    if (!env[varName] || env[varName].trim() === '') {
      log.error(`${varName} is not set`);
      errors++;
    } else {
      log.success(`${varName} is set`);
    }
  });

  // Check for insecure defaults in production
  if (isProduction) {
    log.header('🔒 Security Check (Production Mode)');

    Object.entries(insecureDefaults).forEach(([varName, defaultValue]) => {
      if (env[varName] === defaultValue) {
        log.error(`${varName} is using insecure default value: "${defaultValue}"`);
        errors++;
      }
    });
  } else {
    log.header('🔒 Security Check (Development Mode)');
    log.info('Insecure defaults are OK in development');
  }

  // Check for placeholder values
  log.header('🎯 Placeholder Check');

  uniqueRequired.forEach((varName) => {
    const value = env[varName];
    if (value && isPlaceholder(value)) {
      log.warning(`${varName} appears to be a placeholder: "${value}"`);
      warnings++;
    }
  });

  // Check Stripe configuration
  log.header('💳 Stripe Configuration');

  const stripeSecret = env.STRIPE_SECRET_KEY;
  const stripePublic = env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

  if (stripeSecret && stripePublic) {
    // Check if keys match environment
    const secretIsTest = stripeSecret.startsWith('sk_test_');
    const publicIsTest = stripePublic.startsWith('pk_test_');

    if (secretIsTest && publicIsTest) {
      log.success('Stripe test keys detected (good for development)');
    } else if (!secretIsTest && !publicIsTest) {
      log.success('Stripe live keys detected (good for production)');
      if (!isProduction) {
        log.warning('Using live Stripe keys in non-production environment');
        warnings++;
      }
    } else {
      log.error('Stripe keys mismatch (one is test, one is live)');
      errors++;
    }
  } else {
    log.warning('Stripe keys not configured - payments will not work');
    warnings++;
  }

  // Check SHOP_URL matches environment
  log.header('🌐 URL Configuration');

  const shopUrl = env.SHOP_URL;
  const apiUrl = env.NEXT_PUBLIC_VENDURE_SHOP_API_URL;

  if (shopUrl) {
    if (isProduction && shopUrl.includes('localhost')) {
      log.error('SHOP_URL contains localhost in production');
      errors++;
    } else if (isProduction && !shopUrl.startsWith('https://')) {
      log.warning('SHOP_URL should use HTTPS in production');
      warnings++;
    } else {
      log.success(`SHOP_URL: ${shopUrl}`);
    }
  }

  if (apiUrl) {
    if (isProduction && apiUrl.includes('localhost')) {
      log.error('API URL contains localhost in production');
      errors++;
    } else {
      log.success(`API URL: ${apiUrl}`);
    }
  }

  // Summary
  log.header('📊 Summary');

  if (errors === 0 && warnings === 0) {
    log.success('All checks passed! Environment is properly configured.');
    return 0;
  } else if (errors === 0) {
    log.warning(`${warnings} warning(s) found. Review recommended but not critical.`);
    return 0;
  } else {
    log.error(`${errors} error(s) and ${warnings} warning(s) found.`);
    log.info('Please fix the errors before deploying to production.');
    return 1;
  }
}

// Run the checker
const exitCode = checkEnvironment();
process.exit(exitCode);
