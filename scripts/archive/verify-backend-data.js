const ADMIN_API = 'http://localhost:3001/admin-api';
const SHOP_API = 'http://localhost:3001/shop-api';

async function adminQuery(query, variables = {}) {
  const response = await fetch(ADMIN_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function shopQuery(query, variables = {}) {
  const response = await fetch(SHOP_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ query, variables }),
  });
  return response.json();
}

async function verifyBackendData() {
  console.log('========================================');
  console.log('BACKEND DATA VERIFICATION');
  console.log('========================================\n');

  try {
    // 1. Check Zones
    console.log('1. CHECKING ZONES...');
    const zonesResult = await adminQuery(`
      query {
        zones {
          items {
            id
            name
            members {
              __typename
              ... on Country {
                id
                code
                name
              }
            }
          }
        }
      }
    `);

    if (zonesResult.errors) {
      console.error('❌ Error fetching zones:', zonesResult.errors);
    } else {
      const zones = zonesResult.data.zones.items;
      console.log(`✅ Found ${zones.length} zone(s)`);
      zones.forEach(zone => {
        console.log(`   - ${zone.name} (ID: ${zone.id}) with ${zone.members.length} countries`);
      });
    }

    // 2. Check Countries
    console.log('\n2. CHECKING COUNTRIES...');
    const countriesResult = await adminQuery(`
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
    `);

    if (countriesResult.errors) {
      console.error('❌ Error fetching countries:', countriesResult.errors);
    } else {
      const countries = countriesResult.data.countries.items.filter(c => c.enabled);
      console.log(`✅ Found ${countries.length} enabled country/countries`);
      countries.forEach(country => {
        console.log(`   - ${country.name} (${country.code})`);
      });
    }

    // 3. Check Shipping Methods
    console.log('\n3. CHECKING SHIPPING METHODS...');
    const shippingResult = await adminQuery(`
      query {
        shippingMethods {
          items {
            id
            code
            name
            calculator {
              code
              args {
                name
                value
              }
            }
            checker {
              code
            }
          }
        }
      }
    `);

    if (shippingResult.errors) {
      console.error('❌ Error fetching shipping methods:', shippingResult.errors);
    } else {
      const shippingMethods = shippingResult.data.shippingMethods.items;
      console.log(`✅ Found ${shippingMethods.length} shipping method(s)`);
      shippingMethods.forEach(method => {
        const priceArg = method.calculator.args.find(arg => arg.name === 'rate');
        const price = priceArg ? (priceArg.value / 100).toFixed(2) : 'N/A';
        console.log(`   - ${method.name} (${method.code}): $${price}`);
      });
    }

    // 4. Check Payment Methods
    console.log('\n4. CHECKING PAYMENT METHODS...');
    const paymentResult = await adminQuery(`
      query {
        paymentMethods {
          items {
            id
            code
            name
            enabled
            handler {
              code
            }
          }
        }
      }
    `);

    if (paymentResult.errors) {
      console.error('❌ Error fetching payment methods:', paymentResult.errors);
    } else {
      const paymentMethods = paymentResult.data.paymentMethods.items.filter(p => p.enabled);
      console.log(`✅ Found ${paymentMethods.length} enabled payment method(s)`);
      paymentMethods.forEach(method => {
        console.log(`   - ${method.name} (${method.code}) - Handler: ${method.handler.code}`);
      });
    }

    // 5. Check Tax Configuration
    console.log('\n5. CHECKING TAX CONFIGURATION...');
    const taxResult = await adminQuery(`
      query {
        taxRates {
          items {
            id
            name
            enabled
            value
            category {
              name
            }
            zone {
              name
            }
          }
        }
      }
    `);

    if (taxResult.errors) {
      console.error('❌ Error fetching tax rates:', taxResult.errors);
    } else {
      const taxRates = taxResult.data.taxRates.items.filter(t => t.enabled);
      console.log(`✅ Found ${taxRates.length} enabled tax rate(s)`);
      taxRates.forEach(rate => {
        console.log(`   - ${rate.name}: ${rate.value}% (${rate.category.name} in ${rate.zone.name})`);
      });
    }

    // 6. Check Channels
    console.log('\n6. CHECKING CHANNEL CONFIGURATION...');
    const channelResult = await adminQuery(`
      query {
        channels {
          id
          code
          defaultTaxZone {
            id
            name
          }
          defaultShippingZone {
            id
            name
          }
        }
      }
    `);

    if (channelResult.errors) {
      console.error('❌ Error fetching channels:', channelResult.errors);
    } else {
      const channels = channelResult.data.channels;
      console.log(`✅ Found ${channels.length} channel(s)`);
      channels.forEach(channel => {
        console.log(`   - ${channel.code}:`);
        console.log(`     • Default Tax Zone: ${channel.defaultTaxZone?.name || '⚠️  NOT SET'}`);
        console.log(`     • Default Shipping Zone: ${channel.defaultShippingZone?.name || '⚠️  NOT SET'}`);
      });
    }

    // 7. Check Products with Variants
    console.log('\n7. CHECKING PRODUCTS...');
    const productsResult = await shopQuery(`
      query {
        products {
          items {
            id
            name
            variants {
              id
              name
              sku
              priceWithTax
            }
          }
        }
      }
    `);

    if (productsResult.errors) {
      console.error('❌ Error fetching products:', productsResult.errors);
    } else {
      const products = productsResult.data.products.items;
      console.log(`✅ Found ${products.length} product(s)`);
      const productsWithoutVariants = products.filter(p => p.variants.length === 0);
      if (productsWithoutVariants.length > 0) {
        console.log(`   ⚠️  WARNING: ${productsWithoutVariants.length} product(s) have NO variants!`);
        productsWithoutVariants.forEach(p => console.log(`      - ${p.name}`));
      } else {
        console.log(`   ✅ All products have variants`);
      }
    }

    console.log('\n========================================');
    console.log('VERIFICATION COMPLETE');
    console.log('========================================\n');

    // Summary
    const issues = [];
    if (zonesResult.data?.zones.items.length === 0) issues.push('No zones configured');
    if (countriesResult.data?.countries.items.filter(c => c.enabled).length === 0) issues.push('No countries enabled');
    if (shippingResult.data?.shippingMethods.items.length === 0) issues.push('No shipping methods');
    if (paymentResult.data?.paymentMethods.items.filter(p => p.enabled).length === 0) issues.push('No payment methods');
    if (taxResult.data?.taxRates.items.filter(t => t.enabled).length === 0) issues.push('No tax rates');
    if (!channelResult.data?.channels[0]?.defaultTaxZone) issues.push('Channel missing default tax zone');
    if (!channelResult.data?.channels[0]?.defaultShippingZone) issues.push('Channel missing default shipping zone');

    if (issues.length > 0) {
      console.log('⚠️  ISSUES FOUND:');
      issues.forEach(issue => console.log(`   - ${issue}`));
      console.log('\n❌ Backend is NOT ready for Stripe integration');
      process.exit(1);
    } else {
      console.log('✅ Backend is ready for Stripe integration!');
      process.exit(0);
    }

  } catch (error) {
    console.error('\n❌ VERIFICATION FAILED:', error.message);
    process.exit(1);
  }
}

verifyBackendData();
