const axios = require('axios');

async function assignShippingToChannel() {
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
                id
                code
                token
              }
            }
          }
        }
      `
    });

    const user = loginResponse.data.data.login;
    const token = user.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in!');
    console.log('Channel:', user.channels[0].code, 'ID:', user.channels[0].id);

    // Get shipping methods with their channel assignments
    console.log('\n📦 Checking shipping methods...');
    const methodsResponse = await axios.post(API_URL, {
      query: `
        query {
          shippingMethods {
            items {
              id
              code
              name
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

    const methods = methodsResponse.data.data.shippingMethods.items;
    console.log('Found methods:', methods.map(m => m.name).join(', '));

    // Assign each shipping method to the default channel
    console.log('\n🔗 Assigning shipping methods to default channel...');

    for (const method of methods) {
      try {
        const assignResponse = await axios.post(API_URL, {
          query: `
            mutation {
              assignShippingMethodsToChannel(input: {
                channelId: "1"
                shippingMethodIds: ["${method.id}"]
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

        if (assignResponse.data.data?.assignShippingMethodsToChannel) {
          console.log(`✅ Assigned: ${method.name}`);
        } else if (assignResponse.data.errors) {
          console.log(`⚠️  ${method.name}: ${assignResponse.data.errors[0].message}`);
        }
      } catch (error) {
        console.log(`❌ Error assigning ${method.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    console.log('\n✓ Verifying...');
    const verifyResponse = await axios.post('http://localhost:3001/shop-api', {
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

    console.log('\n📋 Eligible shipping methods:');
    const eligible = verifyResponse.data.data.eligibleShippingMethods;
    if (eligible.length > 0) {
      eligible.forEach(m => {
        console.log(`  - ${m.name}: $${(m.priceWithTax / 100).toFixed(2)}`);
      });
      console.log('\n🎉 Shipping methods are now available!');
    } else {
      console.log('  ⚠️  Still no eligible methods - there may be another issue');
    }

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

assignShippingToChannel();
