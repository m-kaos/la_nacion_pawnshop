const axios = require('axios');

async function checkShippingSetup() {
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

    // Check shipping methods
    console.log('\n📦 Checking shipping methods...');
    const methodsResponse = await axios.post(API_URL, {
      query: `
        query {
          shippingMethods {
            items {
              id
              code
              name
              description
              calculator {
                code
                args {
                  name
                  value
                }
              }
              checker {
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

    console.log('Shipping Methods:', JSON.stringify(methodsResponse.data.data.shippingMethods, null, 2));

    // Check eligible shipping methods for active order
    console.log('\n🚚 Checking eligible shipping methods for active order...');
    const eligibleResponse = await axios.post('http://localhost:3001/shop-api', {
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
    }, {
      headers: {
        'Cookie': cookies
      }
    });

    console.log('Eligible Methods:', JSON.stringify(eligibleResponse.data, null, 2));

    // Check zones
    console.log('\n🌍 Checking zones...');
    const zonesResponse = await axios.post(API_URL, {
      query: `
        query {
          zones {
            items {
              id
              name
              members {
                ... on Country {
                  id
                  code
                  name
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

    console.log('Zones:', JSON.stringify(zonesResponse.data.data.zones, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

checkShippingSetup();
