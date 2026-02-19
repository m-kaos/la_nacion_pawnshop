const axios = require('axios');

async function testRegister() {
  const API_URL = 'http://localhost:3001/shop-api';

  try {
    console.log('Testing registration...');
    const result = await axios.post(API_URL, {
      query: `
        mutation RegisterCustomer($input: RegisterCustomerInput!) {
          registerCustomerAccount(input: $input) {
            ... on Success {
              success
            }
            ... on MissingPasswordError {
              errorCode
              message
            }
            ... on NativeAuthStrategyError {
              errorCode
              message
            }
          }
        }
      `,
      variables: {
        input: {
          emailAddress: 'test@example.com',
          password: 'password123',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    });

    console.log('Response:', JSON.stringify(result.data, null, 2));
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

testRegister();
