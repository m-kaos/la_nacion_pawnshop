const axios = require('axios');

async function setupZonesAndShipping() {
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

    // Add all countries to Default Zone
    console.log('\n📍 Adding countries to Default Zone...');
    const countryIds = countries.map(c => c.id);

    const updateZoneResponse = await axios.post(API_URL, {
      query: `
        mutation {
          updateZone(input: {
            id: "1"
            name: "Default Zone"
            memberIds: ${JSON.stringify(countryIds)}
          }) {
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
      `
    }, {
      headers: {
        'vendure-token': token,
        'Cookie': cookies
      }
    });

    if (updateZoneResponse.data.data?.updateZone) {
      console.log('✅ Updated Default Zone with countries:',
        updateZoneResponse.data.data.updateZone.members.map(m => m.code).join(', '));
    }

    // Get existing shipping methods
    console.log('\n📦 Getting shipping methods...');
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

    const shippingMethods = methodsResponse.data.data.shippingMethods.items;
    console.log('Found shipping methods:', shippingMethods.map(m => m.name).join(', '));

    // Update each shipping method to use the zone
    console.log('\n🚚 Assigning shipping methods to zone...');

    for (const method of shippingMethods) {
      const updateMethodResponse = await axios.post(API_URL, {
        query: `
          mutation {
            updateShippingMethod(input: {
              id: "${method.id}"
              translations: [
                {
                  languageCode: en
                  name: "${method.name}"
                }
              ]
              checker: {
                code: "default-shipping-eligibility-checker"
                arguments: [
                  {
                    name: "orderMinimum"
                    value: "0"
                  }
                ]
              }
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

      if (updateMethodResponse.data.data?.updateShippingMethod) {
        console.log(`✅ Updated: ${method.name}`);
      } else if (updateMethodResponse.data.errors) {
        console.log(`⚠️  Error updating ${method.name}:`, updateMethodResponse.data.errors[0].message);
      }
    }

    // Verify - check eligible shipping methods again
    console.log('\n✓ Verifying setup...');
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

    console.log('\nEligible shipping methods:', JSON.stringify(verifyResponse.data.data.eligibleShippingMethods, null, 2));

    console.log('\n🎉 Zones and shipping setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

setupZonesAndShipping();
