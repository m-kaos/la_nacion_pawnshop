#!/usr/bin/env node

/**
 * Secret Generator
 *
 * Generates secure random secrets for production deployment.
 * Use these values to replace the insecure defaults in .env file.
 *
 * Usage:
 *   node scripts/generate-secrets.js
 *   npm run generate-secrets
 */

const crypto = require('crypto');

// ANSI color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

console.log(`\n${colors.blue}${colors.bold}🔐 Secure Secret Generator${colors.reset}\n`);
console.log('Copy these values to your .env file before deploying to production.\n');
console.log(`${colors.yellow}⚠️  Never commit these secrets to version control!${colors.reset}\n`);
console.log('─'.repeat(70));
console.log();

// Generate secrets
const secrets = {
  COOKIE_SECRET: crypto.randomBytes(64).toString('hex'),
  DB_PASSWORD: crypto.randomBytes(32).toString('base64').replace(/[+/=]/g, ''),
  MEILI_MASTER_KEY: crypto.randomBytes(32).toString('base64').replace(/[+/=]/g, ''),
  MINIO_ROOT_PASSWORD: crypto.randomBytes(24).toString('base64').replace(/[+/=]/g, ''),
  SUPERADMIN_PASSWORD: crypto.randomBytes(16).toString('base64').replace(/[+/=]/g, '') + crypto.randomInt(100),
};

// Display generated secrets
Object.entries(secrets).forEach(([key, value]) => {
  console.log(`${colors.cyan}${key}${colors.reset}=${colors.green}${value}${colors.reset}`);
  console.log();
});

console.log('─'.repeat(70));
console.log();

// Instructions
console.log(`${colors.bold}📋 Next Steps:${colors.reset}\n`);
console.log('1. Copy the values above');
console.log('2. Update your .env file with these new secrets');
console.log('3. If deploying to a platform (Vercel, Railway, etc.):');
console.log('   - Add these as environment variables in the platform dashboard');
console.log('   - Do NOT commit the .env file to Git');
console.log();
console.log(`${colors.yellow}💡 Tip:${colors.reset} Run this script again to generate new secrets if needed.\n`);

// Save to file option
const readline = require('readline').createInterface({
  input: process.stdin,
  output: process.stdout,
});

readline.question(`${colors.cyan}Save to file? (y/N):${colors.reset} `, (answer) => {
  if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
    const fs = require('fs');
    const path = require('path');

    const outputPath = path.join(__dirname, '..', '.env.generated');
    const content = Object.entries(secrets)
      .map(([key, value]) => `${key}=${value}`)
      .join('\n');

    fs.writeFileSync(outputPath, content + '\n');
    console.log(`\n${colors.green}✓ Secrets saved to: ${outputPath}${colors.reset}`);
    console.log(`${colors.yellow}⚠️  Remember to add .env.generated to .gitignore!${colors.reset}\n`);
  } else {
    console.log(`\n${colors.cyan}ℹ  Secrets not saved. Copy them manually.${colors.reset}\n`);
  }

  readline.close();
});
