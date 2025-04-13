const API_BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:5000' 
  : ''; // Use relative paths in production

async function fetchAds(gameType) {
  try {
    const response = await fetch(`${API_BASE_URL}/api/ads/${gameType}`);
    if (!response.ok) {
      throw new Error('Failed to fetch ads');
    }
    const data = await response.json();
    console.log('Ad Data:', data);
    // Use the ad data in your frontend
  } catch (error) {
    console.error('Fetch Ads Error:', error.message);
  }
}

fetchAds('memory'); // Example API call
