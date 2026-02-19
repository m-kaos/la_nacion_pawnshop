const axios = require('axios');

async function checkPayment() {
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

    // Check payment methods
    console.log('\n💳 Checking payment methods...');
    const methodsResponse = await axios.post(API_URL, {
      query: `
        query {
          paymentMethods {
            items {
              id
              code
              name
              enabled
              handler {
                code
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

    console.log('Payment Methods:', JSON.stringify(methodsResponse.data.data.paymentMethods, null, 2));

    // Check eligible payment methods for shop
    console.log('\n💰 Checking eligible payment methods for shop...');
    const eligibleResponse = await axios.post('http://localhost:3001/shop-api', {
      query: `
        query {
          eligiblePaymentMethods {
            id
            code
            name
            isEligible
          }
        }
      `
    }, {
      headers: {
        'Cookie': cookies
      }
    });

    console.log('Eligible Payment Methods:', JSON.stringify(eligibleResponse.data, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkPayment();
