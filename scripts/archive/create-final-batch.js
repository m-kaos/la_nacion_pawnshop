const axios = require('axios');

const products = [
  { name: "Mechanical Keyboard", slug: "mechanical-keyboard", description: "RGB mechanical keyboard with cherry switches", price: 11999, sku: "KEYBOARD-001" },
  { name: "Portable Charger", slug: "portable-charger", description: "20000mAh power bank with fast charging", price: 3999, sku: "CHARGER-001" },
  { name: "Running Shorts", slug: "running-shorts", description: "Lightweight moisture-wicking shorts", price: 2999, sku: "SHORTS-001" },
  { name: "Ceramic Mug", slug: "ceramic-mug", description: "Handcrafted ceramic coffee mug", price: 1499, sku: "MUG-001" },
  { name: "Plant Pot", slug: "plant-pot", description: "Modern ceramic plant pot with drainage", price: 1999, sku: "POT-001" },
  { name: "USB Cable", slug: "usb-cable", description: "Braided USB-C cable 6ft", price: 1299, sku: "CABLE-001" },
  { name: "Bike Lock", slug: "bike-lock", description: "Heavy-duty bike lock with keys", price: 3499, sku: "LOCK-001" },
  { name: "Fitness Tracker", slug: "fitness-tracker", description: "Water-resistant fitness band", price: 6999, sku: "TRACKER-001" },
  { name: "Bluetooth Speaker", slug: "bluetooth-speaker", description: "Portable speaker with 360° sound", price: 7999, sku: "SPEAKER-001" },
  { name: "Travel Mug", slug: "travel-mug", description: "Insulated stainless steel travel mug", price: 2499, sku: "TMUG-001" }
];

async function createProducts() {
  const API_URL = 'http://localhost:3001/admin-api';

  try {
    console.log('🔐 Logging in...');
    const loginResponse = await axios.post(API_URL, {
      query: `mutation { login(username: "superadmin", password: "superadmin") { ... on CurrentUser { id channels { token } } } }`
    });

    const token = loginResponse.data.data.login.channels[0].token;
    const cookies = loginResponse.headers['set-cookie'];
    console.log('✅ Logged in!\n');

    for (let i = 0; i < products.length; i++) {
      const p = products[i];
      console.log(`📦 [${i + 1}/10] Creating "${p.name}"...`);

      try {
        const createResp = await axios.post(API_URL, {
          query: `mutation { createProduct(input: { translations: [{ languageCode: en name: "${p.name}" slug: "${p.slug}" description: "${p.description}" }] }) { id } }`
        }, { headers: { 'vendure-token': token, 'Cookie': cookies } });

        const productId = createResp.data.data.createProduct.id;

        await axios.post(API_URL, {
          query: `mutation { createProductVariants(input: [{ productId: "${productId}" sku: "${p.sku}" price: ${p.price} translations: [{ languageCode: en name: "${p.name}" }] }]) { id } }`
        }, { headers: { 'vendure-token': token, 'Cookie': cookies } });

        await axios.post(API_URL, {
          query: `mutation { updateProduct(input: { id: "${productId}", enabled: true }) { id } }`
        }, { headers: { 'vendure-token': token, 'Cookie': cookies } });

        console.log(`   ✅ Created!`);
      } catch (err) {
        console.log(`   ❌ Failed:`, err.response?.data?.errors?.[0]?.message || err.message);
      }
    }

    console.log('\n🎉 Done! Refresh http://localhost:3000 (should load instantly now!)');

  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

createProducts();
