const axios = require('axios');

async function completeSetup() {
  const API_URL = 'http://localhost:3001/admin-api';
  const SHOP_API_URL = 'http://localhost:3001/shop-api';

  try {
    // Login
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `
        mutation {
          login(username: "superadmin", password: "superadmin") {
            ... on CurrentUser {
              id
              identifier
              channels {
                id
                token
                code
              }
            }
          }
        }
      `
    });

    const token = loginResponse.data.data.login.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in as superadmin\n');

    const headers = {
      'vendure-token': token,
      'Cookie': cookies
    };

    // Step 1: Check and create countries
    console.log('=== STEP 1: Setting up Countries ===');
    const countriesResponse = await axios.post(API_URL, {
      query: `
        query {
          countries(options: { take: 10 }) {
            items {
              id
              code
              name
              enabled
            }
          }
        }
      `
    }, { headers });

    let countries = countriesResponse.data.data.countries.items;
    console.log(`Found ${countries.length} existing countries`);

    // If no countries exist, create US
    if (countries.length === 0) {
      console.log('Creating United States...');
      const createUSResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createCountry(input: {
              code: "US"
              enabled: true
              translations: [{
                languageCode: en
                name: "United States"
              }]
            }) {
              id
              code
              name
              enabled
            }
          }
        `
      }, { headers });

      if (createUSResponse.data.data?.createCountry) {
        console.log('✅ Created United States');
        countries = [createUSResponse.data.data.createCountry];
      } else {
        console.log('❌ Failed to create country:', createUSResponse.data.errors);
      }
    } else {
      // Enable existing countries
      for (const country of countries) {
        if (!country.enabled) {
          console.log(`Enabling ${country.name}...`);
          await axios.post(API_URL, {
            query: `
              mutation {
                updateCountry(input: {
                  id: "${country.id}"
                  enabled: true
                }) {
                  id
                  name
                  enabled
                }
              }
            `
          }, { headers });
          console.log(`✅ Enabled ${country.name}`);
        }
      }
    }

    // Step 2: Setup Zone with countries
    console.log('\n=== STEP 2: Setting up Zone ===');

    // Get zones
    const zonesResponse = await axios.post(API_URL, {
      query: `
        query {
          zones {
            items {
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
        }
      `
    }, { headers });

    const zones = zonesResponse.data.data.zones.items;
    let defaultZone = zones.find(z => z.name === 'Default Zone' || z.id === '1');

    console.log(`Found ${zones.length} zones`);

    if (!defaultZone) {
      console.log('Creating Default Zone...');
      const createZoneResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createZone(input: {
              name: "Default Zone"
              memberIds: ${JSON.stringify(countries.map(c => c.id))}
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
      }, { headers });

      if (createZoneResponse.data.data?.createZone) {
        defaultZone = createZoneResponse.data.data.createZone;
        console.log('✅ Created Default Zone with countries:', defaultZone.members.map(m => m.code).join(', '));
      }
    } else {
      // Update existing zone with countries
      console.log(`Updating zone: ${defaultZone.name}`);
      const memberIds = [...new Set([...defaultZone.members.map(m => m.id), ...countries.map(c => c.id)])];

      const updateZoneResponse = await axios.post(API_URL, {
        query: `
          mutation {
            addMembersToZone(zoneId: "${defaultZone.id}", memberIds: ${JSON.stringify(countries.map(c => c.id))}) {
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
      }, { headers });

      if (updateZoneResponse.data.data?.addMembersToZone) {
        defaultZone = updateZoneResponse.data.data.addMembersToZone;
        console.log('✅ Updated zone with countries:', defaultZone.members.map(m => m.code).join(', '));
      } else if (updateZoneResponse.data.errors) {
        console.log('⚠️  Note:', updateZoneResponse.data.errors[0].message);
        console.log('   (Countries might already be in zone)');
      }
    }

    // Step 3: Create Shipping Methods
    console.log('\n=== STEP 3: Setting up Shipping Methods ===');

    // Check existing shipping methods
    const shippingMethodsResponse = await axios.post(API_URL, {
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
    }, { headers });

    const existingMethods = shippingMethodsResponse.data.data.shippingMethods.items;
    console.log(`Found ${existingMethods.length} existing shipping methods`);

    const shippingMethodsToCreate = [
      {
        code: 'standard-shipping',
        name: 'Standard Shipping',
        description: '5-7 business days',
        rate: '500'
      },
      {
        code: 'express-shipping',
        name: 'Express Shipping',
        description: '2-3 business days',
        rate: '1500'
      }
    ];

    for (const method of shippingMethodsToCreate) {
      const exists = existingMethods.find(m => m.code === method.code);
      if (exists) {
        console.log(`✓ ${method.name} already exists`);
        continue;
      }

      console.log(`Creating ${method.name}...`);
      const createShippingResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createShippingMethod(input: {
              code: "${method.code}"
              fulfillmentHandler: "manual-fulfillment"
              translations: [{
                languageCode: en
                name: "${method.name}"
                description: "${method.description}"
              }]
              checker: {
                code: "default-shipping-eligibility-checker"
                arguments: [{
                  name: "orderMinimum"
                  value: "0"
                }]
              }
              calculator: {
                code: "default-shipping-calculator"
                arguments: [
                  {
                    name: "rate"
                    value: "${method.rate}"
                  }
                  {
                    name: "taxRate"
                    value: "0"
                  }
                ]
              }
            }) {
              id
              code
              name
            }
          }
        `
      }, { headers });

      if (createShippingResponse.data.data?.createShippingMethod) {
        console.log(`✅ Created ${method.name}`);
      } else if (createShippingResponse.data.errors) {
        console.log(`❌ Error creating ${method.name}:`, createShippingResponse.data.errors[0].message);
      }
    }

    // Step 4: Setup Payment Method
    console.log('\n=== STEP 4: Setting up Payment Method ===');

    const paymentMethodsResponse = await axios.post(API_URL, {
      query: `
        query {
          paymentMethods {
            items {
              id
              code
              name
              enabled
            }
          }
        }
      `
    }, { headers });

    const existingPaymentMethods = paymentMethodsResponse.data.data.paymentMethods.items;
    const dummyPayment = existingPaymentMethods.find(m => m.code === 'dummy-payment-method');

    if (!dummyPayment) {
      console.log('Creating dummy payment method...');
      const createPaymentResponse = await axios.post(API_URL, {
        query: `
          mutation {
            createPaymentMethod(input: {
              code: "dummy-payment-method"
              enabled: true
              handler: {
                code: "dummy-payment-handler"
                arguments: [{
                  name: "automaticSettle"
                  value: "true"
                }]
              }
              translations: [{
                languageCode: en
                name: "Test Payment"
                description: "Dummy payment handler for development"
              }]
            }) {
              id
              code
              name
              enabled
            }
          }
        `
      }, { headers });

      if (createPaymentResponse.data.data?.createPaymentMethod) {
        console.log('✅ Created Test Payment method');
      } else if (createPaymentResponse.data.errors) {
        console.log('❌ Error:', createPaymentResponse.data.errors[0].message);
      }
    } else {
      console.log('✓ Test Payment method already exists');

      // Make sure it's enabled
      if (!dummyPayment.enabled) {
        await axios.post(API_URL, {
          query: `
            mutation {
              updatePaymentMethod(input: {
                id: "${dummyPayment.id}"
                enabled: true
              }) {
                id
                enabled
              }
            }
          `
        }, { headers });
        console.log('✅ Enabled Test Payment method');
      }
    }

    // Step 5: Verify Setup
    console.log('\n=== STEP 5: Verifying Setup ===');

    // Check eligible shipping methods from shop API
    const eligibleShippingResponse = await axios.post(SHOP_API_URL, {
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
    });

    const eligibleShipping = eligibleShippingResponse.data.data?.eligibleShippingMethods || [];
    console.log(`✓ Found ${eligibleShipping.length} eligible shipping methods`);
    if (eligibleShipping.length > 0) {
      eligibleShipping.forEach(m => {
        console.log(`  - ${m.name}: $${(m.priceWithTax / 100).toFixed(2)}`);
      });
    }

    // Check eligible payment methods from shop API
    const eligiblePaymentResponse = await axios.post(SHOP_API_URL, {
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
    });

    const eligiblePayment = eligiblePaymentResponse.data.data?.eligiblePaymentMethods || [];
    console.log(`✓ Found ${eligiblePayment.length} eligible payment methods`);
    if (eligiblePayment.length > 0) {
      eligiblePayment.forEach(m => {
        console.log(`  - ${m.name} (${m.isEligible ? 'Eligible' : 'Not eligible'})`);
      });
    }

    console.log('\n🎉 Complete setup finished!');
    console.log('\n📝 Summary:');
    console.log(`   - Countries: ${countries.length}`);
    console.log(`   - Zones: Configured`);
    console.log(`   - Shipping Methods: ${eligibleShipping.length} available`);
    console.log(`   - Payment Methods: ${eligiblePayment.length} available`);
    console.log('\n✅ Your cart should now work! Try adding a product.');

  } catch (error) {
    console.error('\n❌ Error during setup:', error.message);
    if (error.response?.data?.errors) {
      console.error('GraphQL Errors:', JSON.stringify(error.response.data.errors, null, 2));
    }
    if (error.response?.data) {
      console.error('Response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

completeSetup();
