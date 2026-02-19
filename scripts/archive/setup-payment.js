const axios = require('axios');

async function setupPayment() {
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

    // Create dummy payment method for development
    console.log('\n💳 Creating dummy payment method...');
    const createResponse = await axios.post(API_URL, {
      query: `
        mutation {
          createPaymentMethod(input: {
            code: "dummy-payment-method"
            enabled: true
            handler: {
              code: "dummy-payment-handler"
              arguments: [
                { name: "automaticSettle", value: "true" }
              ]
            }
            translations: [
              {
                languageCode: en
                name: "Test Payment"
                description: "Dummy payment handler for development"
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

    if (createResponse.data.data?.createPaymentMethod) {
      const method = createResponse.data.data.createPaymentMethod;
      console.log(`✅ Created payment method: ${method.name} (ID: ${method.id})`);

      // Assign to default channel
      console.log('   -> Assigning to default channel...');
      const assignResponse = await axios.post(API_URL, {
        query: `
          mutation {
            assignPaymentMethodsToChannel(input: {
              channelId: "1"
              paymentMethodIds: ["${method.id}"]
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

      if (assignResponse.data.data?.assignPaymentMethodsToChannel) {
        console.log('   -> ✅ Assigned to channel');
      }
    } else if (createResponse.data.errors) {
      console.log('❌ Error:', createResponse.data.errors[0].message);
    }

    // Verify
    console.log('\n✓ Verifying payment methods...');
    const verifyResponse = await axios.post('http://localhost:3001/shop-api', {
      query: `
        query {
          eligiblePaymentMethods {
            id
            code
            name
            isEligible
          }
        }
      `
    }, {
      headers: {
        'Cookie': cookies
      }
    });

    console.log('Eligible payment methods:', JSON.stringify(verifyResponse.data.data.eligiblePaymentMethods, null, 2));

    console.log('\n🎉 Payment method setup complete!');

  } catch (error) {
    console.error('❌ Error:', error.response?.data?.errors || error.message);
    if (error.response?.data) {
      console.error('Full response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

setupPayment();
