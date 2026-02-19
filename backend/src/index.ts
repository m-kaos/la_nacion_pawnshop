import { bootstrap, JobQueueService } from '@vendure/core';
import { config } from './vendure-config';

/**
 * This bootstraps the Vendure server. Learn more at:
 * https://www.vendure.io/docs/developer-guide/configuration/
 */
bootstrap(config)
  .then(app => {
    console.log('🚀 Vendure server started successfully!');
    console.log(`📊 Admin UI: http://localhost:${config.apiOptions.port}/admin`);
    console.log(`🛍️  Shop API: http://localhost:${config.apiOptions.port}/shop-api`);
    console.log(`⚙️  Admin API: http://localhost:${config.apiOptions.port}/admin-api`);
  })
  .catch(err => {
    console.error('❌ Error starting Vendure server:', err);
    process.exit(1);
  });
