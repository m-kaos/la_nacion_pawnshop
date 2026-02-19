const axios = require('axios');

async function fixZones() {
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

    // Get all countries
    console.log('\n🌍 Getting countries...');
    const countriesResponse = await axios.post(API_URL, {
      query: `
        query {
          countries {
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

    const countries = countriesResponse.data.data.countries.items;
    console.log(`Found ${countries.length} countries`);

    // Add countries to zone one by one
    console.log('\n📍 Adding countries to Default Zone...');

    for (const country of countries) {
      try {
        const addResponse = await axios.post(API_URL, {
          query: `
            mutation {
              addMembersToZone(zoneId: "1", memberIds: ["${country.id}"]) {
                id
                name
                members {
                  ... on Country {
                    code
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

        if (addResponse.data.data?.addMembersToZone) {
          console.log(`✅ Added ${country.name} (${country.code})`);
        } else if (addResponse.data.errors) {
          console.log(`⚠️  ${country.name}: ${addResponse.data.errors[0].message}`);
        }
      } catch (error) {
        console.log(`❌ Error adding ${country.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Verify zone
    console.log('\n✓ Verifying zone setup...');
    const zoneResponse = await axios.post(API_URL, {
      query: `
        query {
          zone(id: "1") {
            id
            name
            members {
              ... on Country {
                code
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

    const zone = zoneResponse.data.data.zone;
    console.log(`\n✅ Default Zone now has ${zone.members.length} countries`);
    console.log('Countries:', zone.members.map(m => m.code).join(', '));

    console.log('\n🎉 Zone setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

fixZones();
