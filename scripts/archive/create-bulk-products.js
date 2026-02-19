const axios = require('axios');

const products = [
  { name: "Classic Denim Jeans", slug: "classic-denim-jeans", description: "Comfortable blue denim jeans with a timeless fit", price: 5999, sku: "JEANS-001" },
  { name: "Leather Jacket", slug: "leather-jacket", description: "Premium black leather jacket for all seasons", price: 14999, sku: "JACKET-001" },
  { name: "Running Sneakers", slug: "running-sneakers", description: "Lightweight sneakers perfect for your daily run", price: 7999, sku: "SHOES-001" },
  { name: "Cotton Hoodie", slug: "cotton-hoodie", description: "Soft and cozy hoodie for casual wear", price: 4499, sku: "HOODIE-001" },
  { name: "Baseball Cap", slug: "baseball-cap", description: "Stylish cap to complete your outfit", price: 1999, sku: "CAP-001" },
  { name: "Canvas Backpack", slug: "canvas-backpack", description: "Durable backpack with multiple compartments", price: 6499, sku: "BAG-001" },
  { name: "Wireless Headphones", slug: "wireless-headphones", description: "Premium sound quality with noise cancellation", price: 12999, sku: "AUDIO-001" },
  { name: "Smart Watch", slug: "smart-watch", description: "Track your fitness and stay connected", price: 19999, sku: "WATCH-001" },
  { name: "Sunglasses", slug: "sunglasses", description: "UV protection with classic aviator style", price: 8999, sku: "GLASS-001" },
  { name: "Winter Scarf", slug: "winter-scarf", description: "Warm wool scarf in multiple colors", price: 2999, sku: "SCARF-001" }
];

async function createBulkProducts() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    // Login
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

    // Create products
    for (let i = 0; i < products.length; i++) {
      const product = products[i];
      console.log(`📦 [${i + 1}/10] Creating "${product.name}"...`);

      try {
        // Create product
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

        // Create variant
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

        // Enable product
        await axios.post(API_URL, {
          query: `
            mutation {
              updateProduct(input: { id: "${productId}", enabled: true }) { id }
            }
          `
        }, {
          headers: { 'vendure-token': token, 'Cookie': cookies }
        });

        console.log(`   ✅ "${product.name}" created and published!`);
      } catch (err) {
        console.log(`   ❌ Failed to create "${product.name}":`, err.response?.data?.errors?.[0]?.message || err.message);
      }
    }

    console.log('\n🎉 All products created! Check http://localhost:3000');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createBulkProducts();
