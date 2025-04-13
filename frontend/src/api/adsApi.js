import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '/api';

export const getAdForGame = async (gameType) => {
  const response = await axios.get(`${API_BASE_URL}/ads/${gameType}`);
  return response.data;
};

export const recordAdView = async (adId, userId) => {
  const response = await axios.post(`${API_BASE_URL}/ads/view`, { adId, userId });
  return response.data;
};
