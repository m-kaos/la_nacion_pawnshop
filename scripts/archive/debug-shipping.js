const axios = require('axios');

async function debugShipping() {
  const API_URL = 'http://localhost:3001/admin-api';
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              channels {
                id
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

    // Get detailed shipping method info
    console.log('\n📦 Getting detailed shipping method configuration...');
    const methodsResponse = await axios.post(API_URL, {
      query: `
        query {
          shippingMethods {
            items {
              id
              code
              name
              description
              fulfillmentHandlerCode
              checker {
                code
                args {
                  name
                  value
                }
              }
              calculator {
                code
                args {
                  name
                  value
                }
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

    console.log('Shipping Methods:', JSON.stringify(methodsResponse.data.data.shippingMethods.items, null, 2));

    // Create a test order in shop API
    console.log('\n🛒 Creating test order in shop API...');

    // First, get a product variant
    const productsResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          products(options: { take: 1 }) {
            items {
              id
              name
              variants {
                id
                name
              }
            }
          }
        }
      `
    });

    const variant = productsResponse.data.data.products.items[0]?.variants[0];
    if (!variant) {
      console.log('❌ No products found!');
      return;
    }

    console.log(`Found product variant: ${variant.name} (${variant.id})`);

    // Add to order
    console.log('\n➕ Adding item to order...');
    const addItemResponse = await axios.post(SHOP_API_URL, {
      query: `
        mutation {
          addItemToOrder(productVariantId: "${variant.id}", quantity: 1) {
            ... on Order {
              id
              code
              state
              lines {
                id
              }
            }
            ... on ErrorResult {
              errorCode
              message
            }
          }
        }
      `
    });

    console.log('Add item result:', JSON.stringify(addItemResponse.data, null, 2));

    const orderId = addItemResponse.data.data?.addItemToOrder?.id;
    if (!orderId) {
      console.log('❌ Failed to create order');
      return;
    }

    console.log(`✅ Order created: ${orderId}`);

    // Set shipping address
    console.log('\n📍 Setting shipping address...');
    const addressResponse = await axios.post(SHOP_API_URL, {
      query: `
        mutation {
          setOrderShippingAddress(input: {
            fullName: "Test User"
            streetLine1: "123 Test St"
            city: "New York"
            province: "NY"
            postalCode: "10001"
            countryCode: "US"
            phoneNumber: "555-1234"
          }) {
            ... on Order {
              id
              shippingAddress {
                fullName
                streetLine1
                country
              }
            }
            ... on ErrorResult {
              errorCode
              message
            }
          }
        }
      `
    });

    console.log('Set address result:', JSON.stringify(addressResponse.data, null, 2));

    // Now check eligible shipping methods
    console.log('\n🚚 Checking eligible shipping methods...');
    const eligibleResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          eligibleShippingMethods {
            id
            name
            description
            priceWithTax
          }
        }
      `
    });

    console.log('Eligible methods:', JSON.stringify(eligibleResponse.data, null, 2));

    if (eligibleResponse.data.data.eligibleShippingMethods.length === 0) {
      console.log('\n⚠️  No eligible methods found. Let me check the active order details...');

      const orderResponse = await axios.post(SHOP_API_URL, {
        query: `
          query {
            activeOrder {
              id
              code
              state
              totalWithTax
              shippingAddress {
                fullName
                country
                countryCode
              }
            }
          }
        `
      });

      console.log('Active order:', JSON.stringify(orderResponse.data, null, 2));
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

debugShipping();
