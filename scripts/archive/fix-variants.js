const axios = require('axios');

async function fixVariants() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    // Step 1: Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              identifier
              channels {
                code
                token
              }
            }
          }
        }
      `
    });

    const token = loginResponse.data.data.login.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in!');

    // Step 2: Get all products
    console.log('📦 Fetching all products...');
    const productsResponse = await axios.post(API_URL, {
      query: `
        query {
          products(options: { take: 100 }) {
            items {
              id
              name
              slug
              variants {
                id
              }
            }
          }
        }
      `
    }, {
      headers: {
        'vendure-token': token,
        'Cookie': cookies
      }
    });

    const products = productsResponse.data.data.products.items;
    console.log(`Found ${products.length} products`);

    // Step 3: Add variants to products that don't have them
    for (const product of products) {
      if (product.variants.length === 0) {
        console.log(`\n💰 Adding variant to: ${product.name}`);

        try {
          const variantResponse = await axios.post(API_URL, {
            query: `
              mutation {
                createProductVariants(input: [
                  {
                    productId: "${product.id}"
                    sku: "${product.slug}-001"
                    price: 2999
                    translations: [
                      {
                        languageCode: en
                        name: "${product.name}"
                      }
                    ]
                  }
                ]) {
                  id
                  name
                  sku
                  price
                }
              }
            `
          }, {
            headers: {
              'vendure-token': token,
              'Cookie': cookies
            }
          });

          if (variantResponse.data.errors) {
            console.log('   ❌ Error:', variantResponse.data.errors[0].message);
          } else {
            console.log('   ✅ Variant created!');
          }
        } catch (error) {
          console.log('   ❌ Failed:', error.response?.data?.errors?.[0]?.message || error.message);
        }
      } else {
        console.log(`✓ ${product.name} already has variants`);
      }
    }

    console.log('\n🎉 Done! All products should now have variants.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

fixVariants();
