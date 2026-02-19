const axios = require('axios');

async function setupTaxZone() {
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

    // Step 2: Check existing tax zones
    console.log('📋 Checking existing tax zones...');
    const taxZonesResponse = await axios.post(API_URL, {
      query: `
        query {
          taxRates {
            items {
              id
              name
              enabled
              value
              zone {
                id
                name
              }
            }
          }
          zones {
            items {
              id
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

    console.log('Existing zones:', taxZonesResponse.data.data.zones.items);
    console.log('Existing tax rates:', taxZonesResponse.data.data.taxRates.items);

    // Step 3: Create a default zone if needed
    if (taxZonesResponse.data.data.zones.items.length === 0) {
      console.log('\n🌍 Creating default tax zone...');
      const createZoneResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createZone(input: {
              name: "Default Zone"
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

      const zoneId = createZoneResponse.data.data.createZone.id;
      console.log('✅ Zone created! ID:', zoneId);

      // Step 4: Create a default tax rate
      console.log('💰 Creating default tax rate...');
      await axios.post(API_URL, {
        query: `
          mutation {
            createTaxRate(input: {
              name: "Standard Tax"
              enabled: true
              value: 0
              categoryId: "1"
              zoneId: "${zoneId}"
            }) {
              id
              name
              value
            }
          }
        `
      }, {
        headers: {
          'vendure-token': token,
          'Cookie': cookies
        }
      });

      console.log('✅ Tax rate created!');

      // Step 5: Get the default channel and set the default tax zone
      console.log('🔧 Setting default tax zone for channel...');
      const channelResponse = await axios.post(API_URL, {
        query: `
          query {
            channels {
              items {
                id
                code
                defaultTaxZone {
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

      const defaultChannel = channelResponse.data.data.channels.items.find(c => c.code === '__default_channel__');

      if (defaultChannel) {
        await axios.post(API_URL, {
          query: `
            mutation {
              updateChannel(input: {
                id: "${defaultChannel.id}"
                defaultTaxZoneId: "${zoneId}"
              }) {
                id
                code
                defaultTaxZone {
                  id
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

        console.log('✅ Default tax zone set for channel!');
      }
    } else {
      console.log('✅ Tax zones already configured!');
    }

    console.log('\n🎉 Tax zone setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

setupTaxZone();
