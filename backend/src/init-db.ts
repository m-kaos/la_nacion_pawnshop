import { bootstrap } from '@vendure/core';
import { config } from './vendure-config';
import { populate } from '@vendure/core/cli';

const initialData = require('@vendure/core/cli/assets/initial-data.json');

populate(
  () => bootstrap(config),
  initialData,
  initialData
)
  .then(() => {
    console.log('✅ Database initialized with permissions and roles!');
    process.exit(0);
  })
  .catch((err) => {
    console.error('❌ Error:', err);
    process.exit(1);
  });
