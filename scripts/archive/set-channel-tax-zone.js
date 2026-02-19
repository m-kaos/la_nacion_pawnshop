const axios = require('axios');

async function setChannelTaxZone() {
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

    // Get channels
    console.log('📋 Getting channels...');
    const channelsResponse = await axios.post(API_URL, {
      query: `
        query {
          channels {
            items {
              id
              code
              token
              defaultTaxZone {
                id
                name
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

    console.log('Channels:', JSON.stringify(channelsResponse.data.data.channels.items, null, 2));

    const defaultChannel = channelsResponse.data.data.channels.items[0];
    console.log(`\nUsing channel: ${defaultChannel.code} (ID: ${defaultChannel.id})`);

    // Update channel with default tax zone
    console.log('🔧 Setting default tax zone (ID: 1) for channel...');
    const updateResponse = await axios.post(API_URL, {
      query: `
        mutation {
          updateChannel(input: {
            id: "${defaultChannel.id}"
            defaultTaxZoneId: "1"
          }) {
            ... on Channel {
              id
              code
              defaultTaxZone {
                id
                name
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

    console.log('✅ Result:', JSON.stringify(updateResponse.data, null, 2));

    console.log('\n🎉 Channel tax zone set successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

setChannelTaxZone();
