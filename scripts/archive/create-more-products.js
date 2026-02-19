const axios = require('axios');

const products = [
  { name: "Vintage Vinyl Record", slug: "vintage-vinyl-record", description: "Rare classic rock album from the 70s", price: 3499, sku: "VINYL-001" },
  { name: "Gaming Mouse", slug: "gaming-mouse", description: "RGB gaming mouse with 12000 DPI", price: 5999, sku: "MOUSE-001" },
  { name: "Yoga Mat", slug: "yoga-mat", description: "Non-slip eco-friendly yoga mat", price: 3999, sku: "YOGA-001" },
  { name: "Coffee Maker", slug: "coffee-maker", description: "Programmable coffee maker with thermal carafe", price: 8999, sku: "COFFEE-001" },
  { name: "Desk Lamp", slug: "desk-lamp", description: "LED desk lamp with adjustable brightness", price: 4499, sku: "LAMP-001" },
  { name: "Water Bottle", slug: "water-bottle", description: "Insulated stainless steel water bottle", price: 2499, sku: "BOTTLE-001" },
  { name: "Phone Case", slug: "phone-case", description: "Shockproof protective phone case", price: 1999, sku: "CASE-001" },
  { name: "Wall Clock", slug: "wall-clock", description: "Modern minimalist wall clock", price: 3499, sku: "CLOCK-001" },
  { name: "Throw Pillow", slug: "throw-pillow", description: "Soft decorative throw pillow", price: 2999, sku: "PILLOW-001" },
  { name: "Notebook Set", slug: "notebook-set", description: "Set of 3 hardcover notebooks", price: 1999, sku: "NOTE-001" }
];

async function createBulkProducts() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              channels { token }
            }
          }
        }
      `
    });

    const token = loginResponse.data.data.login.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in!\n');

    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`📦 [${i + 1}/10] Creating "${product.name}"...`);

      try {
        const createProductResponse = await axios.post(API_URL, {
          query: `
            mutation {
              createProduct(input: {
                translations: [
                  {
                    languageCode: en
                    name: "${product.name}"
                    slug: "${product.slug}"
                    description: "${product.description}"
                  }
                ]
              }) {
                id
              }
            }
          `
        }, {
          headers: { 'vendure-token': token, 'Cookie': cookies }
        });

        const productId = createProductResponse.data.data.createProduct.id;

        await axios.post(API_URL, {
          query: `
            mutation {
              createProductVariants(input: [
                {
                  productId: "${productId}"
                  sku: "${product.sku}"
                  price: ${product.price}
                  translations: [{ languageCode: en, name: "${product.name}" }]
                }
              ]) { id }
            }
          `
        }, {
          headers: { 'vendure-token': token, 'Cookie': cookies }
        });

        await axios.post(API_URL, {
          query: `
            mutation {
              updateProduct(input: { id: "${productId}", enabled: true }) { id }
            }
          `
        }, {
          headers: { 'vendure-token': token, 'Cookie': cookies }
        });

        console.log(`   ✅ "${product.name}" created!`);
      } catch (err) {
        console.log(`   ❌ Failed:`, err.response?.data?.errors?.[0]?.message || err.message);
      }
    }

    console.log('\n🎉 Done! Wait 10 seconds and refresh http://localhost:3000');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createBulkProducts();
