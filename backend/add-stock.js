const axios = require('axios');

async function addStock() {
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
              channels {
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

    // Get all product variants
    console.log('\n📦 Getting all product variants...');
    const variantsResponse = await axios.post(API_URL, {
      query: `
        query {
          productVariants(options: { take: 100 }) {
            items {
              id
              name
              sku
              stockOnHand
              trackInventory
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

    const variants = variantsResponse.data.data.productVariants.items;
    console.log(`Found ${variants.length} variants`);

    // Update each variant to add stock
    console.log('\n📈 Adding stock to all variants...');

    for (const variant of variants) {
      try {
        // Update variant to track inventory and set stock
        const updateResponse = await axios.post(API_URL, {
          query: `
            mutation {
              updateProductVariants(input: [{
                id: "${variant.id}"
                trackInventory: INHERIT
                stockOnHand: 1000
              }]) {
                id
                name
                stockOnHand
                trackInventory
              }
            }
          `
        }, {
          headers: {
            'vendure-token': token,
            'Cookie': cookies
          }
        });

        if (updateResponse.data.data?.updateProductVariants) {
          const updated = updateResponse.data.data.updateProductVariants[0];
          console.log(`✅ ${variant.name}: Stock set to ${updated.stockOnHand}`);
        }
      } catch (error) {
        console.log(`❌ Error updating ${variant.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    console.log('\n🎉 Stock added to all products!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

addStock();
