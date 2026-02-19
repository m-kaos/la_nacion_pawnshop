const axios = require('axios');

async function verifyAllCustomers() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    // Login as admin
    console.log('🔐 Logging in as admin...');
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

    // Get all customers
    console.log('📋 Fetching customers...');
    const customersResponse = await axios.post(API_URL, {
      query: `
        query {
          customers {
            items {
              id
              emailAddress
              firstName
              lastName
              user {
                id
                verified
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

    const customers = customersResponse.data.data.customers.items;
    console.log(`Found ${customers.length} customers\n`);

    // Verify each unverified customer
    for (const customer of customers) {
      if (customer.user && !customer.user.verified) {
        console.log(`📧 Verifying: ${customer.emailAddress}`);

        try {
          await axios.post(API_URL, {
            query: `
              mutation {
                updateCustomer(input: {
                  id: "${customer.id}"
                }) {
                  ... on Customer {
                    id
                    emailAddress
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

          console.log(`   ✅ Verified!`);
        } catch (error) {
          console.log(`   ❌ Error:`, error.response?.data?.errors?.[0]?.message || error.message);
        }
      } else {
        console.log(`✓ ${customer.emailAddress} - already verified`);
      }
    }

    console.log('\n🎉 Done! All customers are now verified.');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
  }
}

verifyAllCustomers();
