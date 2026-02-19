const axios = require('axios');

async function createProduct() {
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

    console.log('✅ Logged in! Token:', token);

    // Step 2: Create Product
    console.log('📦 Creating product...');
    const createProductResponse = await axios.post(API_URL, {
      query: `
        mutation {
          createProduct(input: {
            translations: [
              {
                languageCode: en
                name: "Awesome Pants"
                slug: "awesome-Pants"
                description: "A super comfortable cotton Pants"
              }
            ]
          }) {
            id
            name
          }
        }
      `
    }, {
      headers: {
        'vendure-token': token,
        'Cookie': cookies
      }
    });

    const productId = createProductResponse.data.data.createProduct.id;
    console.log('✅ Product created! ID:', productId);

    // Step 3: Create Variant
    console.log('💰 Creating variant...');
    await axios.post(API_URL, {
      query: `
        mutation {
          createProductVariants(input: [
            {
              productId: "${productId}"
              sku: "TSHIRT-001"
              price: 2999
              translations: [
                {
                  languageCode: en
                  name: "Awesome T-Shirt"
                }
              ]
            }
          ]) {
            id
            name
          }
        }
      `
    }, {
      headers: {
        'vendure-token': token,
        'Cookie': cookies
      }
    });

    console.log('✅ Variant created!');

    // Step 4: Enable product
    console.log('🚀 Publishing product...');
    await axios.post(API_URL, {
      query: `
        mutation {
          updateProduct(input: {
            id: "${productId}"
            enabled: true
          }) {
            id
            enabled
          }
        }
      `
    }, {
      headers: {
        'vendure-token': token,
        'Cookie': cookies
      }
    });

    console.log('✅ Product published and live!');
    console.log('🎉 Check http://localhost:3000 to see your product!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createProduct();
