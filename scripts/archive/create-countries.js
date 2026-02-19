const axios = require('axios');

async function createCountries() {
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

    // Create countries
    const countries = [
      { code: 'US', name: 'United States' },
      { code: 'MX', name: 'Mexico' },
      { code: 'CA', name: 'Canada' },
      { code: 'GB', name: 'United Kingdom' },
      { code: 'DE', name: 'Germany' },
      { code: 'FR', name: 'France' },
      { code: 'ES', name: 'Spain' },
      { code: 'IT', name: 'Italy' },
      { code: 'BR', name: 'Brazil' },
      { code: 'AR', name: 'Argentina' },
      { code: 'CL', name: 'Chile' },
      { code: 'CO', name: 'Colombia' },
    ];

    console.log('\n🌍 Creating countries...');

    for (const country of countries) {
      try {
        const result = await axios.post(API_URL, {
          query: `
            mutation {
              createCountry(input: {
                code: "${country.code}"
                enabled: true
                translations: [
                  {
                    languageCode: en
                    name: "${country.name}"
                  }
                ]
              }) {
                id
                code
                name
                enabled
              }
            }
          `
        }, {
          headers: {
            'vendure-token': token,
            'Cookie': cookies
          }
        });

        if (result.data.data?.createCountry) {
          console.log(`✅ Created: ${country.name} (${country.code})`);
        } else if (result.data.errors) {
          console.log(`⚠️  ${country.name}: ${result.data.errors[0].message}`);
        }
      } catch (error) {
        console.log(`❌ Error creating ${country.name}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Verify countries were created
    console.log('\n📋 Verifying countries...');
    const countriesResponse = await axios.post(API_URL, {
      query: `
        query {
          countries {
            totalItems
            items {
              id
              code
              name
              enabled
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

    console.log(`\n✅ Total countries in database: ${countriesResponse.data.data.countries.totalItems}`);
    console.log('Countries:', countriesResponse.data.data.countries.items.map(c => `${c.name} (${c.code})`).join(', '));

    console.log('\n🎉 Countries setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data?.errors) {
      console.error('Details:', JSON.stringify(error.response.data.errors, null, 2));
    }
  }
}

createCountries();
