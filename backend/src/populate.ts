import { bootstrap, LanguageCode } from '@vendure/core';
import { config } from './vendure-config';

async function populateDatabase() {
  console.log('🚀 Starting Vendure...');
  const app = await bootstrap(config);

  console.log('📦 Creating sample product...');

  const { ProductService, ChannelService } = app.get('ServiceRegistry');

  try {
    // Get default channel
    const channels = await ChannelService.findAll();
    const defaultChannel = channels[0];

    console.log('Channel:', defaultChannel.code);

    // Create a product
    const product = await ProductService.create({
      translations: [
        {
          languageCode: LanguageCode.en,
          name: 'Awesome T-Shirt',
          slug: 'awesome-t-shirt',
          description: 'A super comfortable cotton t-shirt',
        },
      ],
    });

    console.log('✅ Product created:', product.name);

    // Create variant
    await ProductService.createVariants(product.id, [
      {
        sku: 'TSHIRT-001',
        price: 2999,
        translations: [
          {
            languageCode: LanguageCode.en,
            name: 'Awesome T-Shirt',
          },
        ],
      },
    ]);

    console.log('✅ Variant created!');

    // Enable product
    await ProductService.update({
      id: product.id,
      enabled: true,
    });

    console.log('✅ Product enabled and ready!');

  } catch (err) {
    console.error('❌ Error:', err);
  }

  await app.close();
  process.exit(0);
}

populateDatabase();
