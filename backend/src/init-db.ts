import { bootstrap, LanguageCode, TransactionalConnection } from '@vendure/core';
import { config } from './vendure-config';

/**
 * Initial data for the Mexico pawnshop.
 * Run once on first startup to set up the default tax zone (required for product creation).
 * Idempotent: skips if a zone already exists.
 */
const initialData = {
  defaultLanguage: LanguageCode.es,
  defaultZone: 'Mexico',
  countries: [
    { name: 'México', code: 'MX', zone: 'Mexico' },
  ],
  taxRates: [
    { name: 'IVA', percentage: 16 },
  ],
  shippingMethods: [],
  paymentMethods: [],
  roles: [],
  collections: [],
};

async function init() {
  console.log('🔧 Checking initial data...');
  const app = await bootstrap(config);

  try {
    const connection = app.get(TransactionalConnection);
    const rows = await connection.rawConnection.query('SELECT COUNT(*) as count FROM zone');
    const zoneCount = parseInt(rows[0].count, 10);

    if (zoneCount === 0) {
      console.log('📋 Setting up default tax zone for Mexico...');
      const { populateInitialData } = await import('@vendure/core/cli');
      await populateInitialData(app, initialData as any);
      console.log('✅ Tax zone configured — products can now be created');
    } else {
      console.log('✅ Tax zone already configured, skipping');
    }

    // Ensure Default Channel uses Spanish and MXN
    await connection.rawConnection.query(
      `UPDATE channel SET "defaultLanguageCode" = 'es', "defaultCurrencyCode" = 'MXN' WHERE code = '__default_channel__'`,
    );
    // Migrate any USD variant prices to MXN
    await connection.rawConnection.query(
      `UPDATE product_variant_price SET "currencyCode" = 'MXN' WHERE "currencyCode" != 'MXN'`,
    );
    console.log('✅ Default channel: language=es, currency=MXN');
  } catch (err) {
    console.error('⚠️  Init check failed:', (err as Error).message);
  }

  process.exit(0);
}

init().catch((err) => {
  console.error('⚠️  Bootstrap failed during init:', (err as Error).message);
  process.exit(0); // exit 0 so the main server still starts
});
