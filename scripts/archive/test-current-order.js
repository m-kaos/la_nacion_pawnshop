const axios = require('axios');

async function testCurrentOrder() {
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
    console.log('🔍 Checking for active orders in shop...\n');

    // Try to get active order (might not exist without cookies)
    const orderResponse = await axios.post(SHOP_API_URL, {
      query: `
        query {
          activeOrder {
            id
            code
            state
            totalWithTax
            lines {
              id
              productVariant {
                id
                name
                sku
              }
            }
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

    if (orderResponse.data.data?.activeOrder) {
      console.log('\n🚚 Checking eligible shipping methods for this order...');

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
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
  }
}

testCurrentOrder();
