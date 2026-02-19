const axios = require('axios');

async function setupCountries() {
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

    // Check existing countries
    console.log('📋 Checking existing countries...');
    const countriesResponse = await axios.post(API_URL, {
      query: `
        query {
          countries {
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

    console.log('Existing countries:', countriesResponse.data.data.countries.items);

    // Enable US and MX if they exist
    const countries = countriesResponse.data.data.countries.items;
    const usCountry = countries.find(c => c.code === 'US');
    const mxCountry = countries.find(c => c.code === 'MX');

    if (usCountry && !usCountry.enabled) {
      console.log('🇺🇸 Enabling United States...');
      await axios.post(API_URL, {
        query: `
          mutation {
            updateCountry(input: {
              id: "${usCountry.id}"
              enabled: true
            }) {
              id
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
      console.log('✅ US enabled!');
    }

    if (mxCountry && !mxCountry.enabled) {
      console.log('🇲🇽 Enabling Mexico...');
      await axios.post(API_URL, {
        query: `
          mutation {
            updateCountry(input: {
              id: "${mxCountry.id}"
              enabled: true
            }) {
              id
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
      console.log('✅ MX enabled!');
    }

    console.log('\n🎉 Countries configured!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
  }
}

setupCountries();
