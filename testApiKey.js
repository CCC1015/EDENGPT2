import fetch from 'node-fetch';

const API_KEY = 'e03da45e-48c5-4fce-a4db-88fb42365f37';
const API_URL = 'https://api-mainnet.magiceden.dev/v2/collections?offset=0&limit=20&symbol=TENSORIANS';  // Fixed the offset and limit

async function testApiKey() {
  try {
    const response = await fetch(API_URL, {
      headers: {
        'Authorization': `Bearer ${API_KEY}`
      }
    });

    if (!response.ok) {
      console.error(`Error: ${response.status} - ${response.statusText}`);
      const errorText = await response.text();
      console.error('Response:', errorText);
      return;
    }

    const data = await response.json();
    console.log('API Response:', data);
  } catch (error) {
    console.error('Failed to fetch data:', error);
  }
}

testApiKey();
