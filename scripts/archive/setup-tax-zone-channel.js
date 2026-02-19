const axios = require('axios');

async function setupTaxZone() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              channels {
                id
                token
              }
            }
          }
        }
      `
    });

    const user = loginResponse.data.data.login;
    const token = user.channels[0].token;
    const channelId = user.channels[0].id;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in\n');

    const headers = {
      'vendure-token': token,
      'Cookie': cookies
    };

    console.log('=== Setting up Tax Zone ===');
    const zonesResponse = await axios.post(API_URL, {
      query: `
        query {
          zones {
            items {
              id
              name
            }
          }
        }
      `
    }, { headers });

    const zones = zonesResponse.data.data.zones.items;
    const defaultZone = zones[0];

    if (!defaultZone) {
      console.log('❌ No zones found!');
      return;
    }

    console.log(`Using zone: ${defaultZone.name} (ID: ${defaultZone.id})`);

    console.log('\n📋 Setting up Tax Category...');
    const createCategoryResponse = await axios.post(API_URL, {
      query: `
        mutation {
          createTaxCategory(input: {
            name: "Standard"
          }) {
            id
            name
          }
        }
      `
    }, { headers });

    const taxCategory = createCategoryResponse.data.data?.createTaxCategory;
    if (taxCategory) {
      console.log(`✅ Created tax category: ${taxCategory.name}`);
    }

    console.log('\n💰 Setting up Tax Rate...');
    const createRateResponse = await axios.post(API_URL, {
      query: `
        mutation {
          createTaxRate(input: {
            name: "Standard Rate"
            enabled: true
            value: 0
            categoryId: "${taxCategory.id}"
            zoneId: "${defaultZone.id}"
          }) {
            id
            name
            value
          }
        }
      `
    }, { headers });

    const taxRate = createRateResponse.data.data?.createTaxRate;
    if (taxRate) {
      console.log(`✅ Created tax rate: ${taxRate.name} (${taxRate.value}%)`);
    }

    console.log('\n⚙️  Setting default zones for channel...');
    const updateChannelResponse = await axios.post(API_URL, {
      query: `
        mutation {
          updateChannel(input: {
            id: "${channelId}"
            defaultTaxZoneId: "${defaultZone.id}"
            defaultShippingZoneId: "${defaultZone.id}"
          }) {
            ... on Channel {
              id
              defaultTaxZone {
                name
              }
              defaultShippingZone {
                name
              }
            }
          }
        }
      `
    }, { headers });

    if (updateChannelResponse.data.data?.updateChannel) {
      console.log(`✅ Channel updated with default zones!`);
    } else if (updateChannelResponse.data.errors) {
      console.log('❌ Error:', updateChannelResponse.data.errors[0].message);
    }

    console.log('\n🎉 Tax zone setup complete!');

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    if (error.response?.data?.errors) {
      console.error('Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

setupTaxZone();
