const axios = require('axios');

async function testAdsApi() {
  console.log('Testing Ads API...');

  try {
    const healthCheck = await axios.get('http://localhost:5000/api/health');
    console.log('Health Check Response:', healthCheck.data);
  } catch (error) {
    console.error('Health Check Error:', error.response?.data || error.message);
  }

  try {
    const getAdResponse = await axios.get('http://localhost:5000/api/ads/memory');
    console.log('GET /api/ads/memory Response:', getAdResponse.data);
  } catch (error) {
    console.error('GET /api/ads/memory Error:', error.response?.data || error.message);
  }
}

testAdsApi();