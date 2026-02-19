const axios = require('axios');

async function recreateShipping() {
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

    // Delete existing shipping methods
    console.log('\n🗑️  Deleting existing shipping methods...');
    const deleteIds = ['1', '2'];

    for (const id of deleteIds) {
      try {
        const deleteResponse = await axios.post(API_URL, {
          query: `
            mutation {
              deleteShippingMethod(id: "${id}") {
                result
                message
              }
            }
          `
        }, {
          headers: {
            'vendure-token': token,
            'Cookie': cookies
          }
        });

        if (deleteResponse.data.data?.deleteShippingMethod?.result === 'DELETED') {
          console.log(`✅ Deleted shipping method ${id}`);
        }
      } catch (error) {
        console.log(`⚠️  Could not delete ${id}:`, error.response?.data?.errors?.[0]?.message || error.message);
      }
    }

    // Create new shipping methods with proper configuration
    console.log('\n📦 Creating new shipping methods...');

    const shippingMethods = [
      {
        code: 'standard-shipping',
        name: 'Standard Shipping',
        description: '5-7 business days',
        rate: '500', // $5.00
      },
      {
        code: 'express-shipping',
        name: 'Express Shipping',
        description: '2-3 business days',
        rate: '1500', // $15.00
      },
    ];

    for (const method of shippingMethods) {
      const createResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createShippingMethod(input: {
              code: "${method.code}"
              fulfillmentHandler: "manual-fulfillment"
              checker: {
                code: "default-shipping-eligibility-checker"
                arguments: [
                  { name: "orderMinimum", value: "0" }
                ]
              }
              calculator: {
                code: "default-shipping-calculator"
                arguments: [
                  { name: "rate", value: "${method.rate}" }
                  { name: "taxRate", value: "0" }
                  { name: "includesTax", value: "auto" }
                ]
              }
              translations: [
                {
                  languageCode: en
                  name: "${method.name}"
                  description: "${method.description}"
                }
              ]
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

      if (createResponse.data.data?.createShippingMethod) {
        const created = createResponse.data.data.createShippingMethod;
        console.log(`✅ Created: ${created.name} (ID: ${created.id})`);

        // Assign to default channel
        const assignResponse = await axios.post(API_URL, {
          query: `
            mutation {
              assignShippingMethodsToChannel(input: {
                channelId: "1"
                shippingMethodIds: ["${created.id}"]
              }) {
                id
              }
            }
          `
        }, {
          headers: {
            'vendure-token': token,
            'Cookie': cookies
          }
        });

        console.log(`   → Assigned to default channel`);
      } else if (createResponse.data.errors) {
        console.log(`❌ Error creating ${method.name}:`, createResponse.data.errors[0].message);
      }
    }

    console.log('\n🎉 Shipping methods recreated successfully!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

recreateShipping();
