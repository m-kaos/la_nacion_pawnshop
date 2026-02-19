const axios = require('axios');

async function setupShipping() {
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

    // Create shipping method
    console.log('📦 Creating shipping method...');
    const shippingResult = await axios.post(API_URL, {
      query: `
        mutation {
          createShippingMethod(input: {
            code: "standard-shipping"
            fulfillmentHandler: "manual-fulfillment"
            translations: [
              {
                languageCode: en
                name: "Standard Shipping"
                description: "5-7 business days"
              }
            ]
            checker: {
              code: "default-shipping-eligibility-checker"
              arguments: []
            }
            calculator: {
              code: "default-shipping-calculator"
              arguments: [
                {
                  name: "rate"
                  value: "500"
                }
                {
                  name: "taxRate"
                  value: "0"
                }
              ]
            }
          }) {
            id
            code
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

    console.log('✅ Shipping method created:', shippingResult.data.data.createShippingMethod);

    // Create express shipping
    console.log('🚀 Creating express shipping...');
    const expressResult = await axios.post(API_URL, {
      query: `
        mutation {
          createShippingMethod(input: {
            code: "express-shipping"
            fulfillmentHandler: "manual-fulfillment"
            translations: [
              {
                languageCode: en
                name: "Express Shipping"
                description: "2-3 business days"
              }
            ]
            checker: {
              code: "default-shipping-eligibility-checker"
              arguments: []
            }
            calculator: {
              code: "default-shipping-calculator"
              arguments: [
                {
                  name: "rate"
                  value: "1500"
                }
                {
                  name: "taxRate"
                  value: "0"
                }
              ]
            }
          }) {
            id
            code
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

    console.log('✅ Express shipping created:', expressResult.data.data.createShippingMethod);

    console.log('\n🎉 Shipping methods set up successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data?.errors) {
      console.error('Details:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

setupShipping();
