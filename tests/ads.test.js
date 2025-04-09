const request = require('supertest');
const app = require('../app'); // Assuming app.js initializes and exports the Express app

describe('Ads API', () => {
  describe('GET /ads/:gameType', () => {
    it('should fetch an ad for the specified game type', async () => {
      const response = await request(app).get('/ads/memory');
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
      expect(response.body.ad).toHaveProperty('gameType', 'memory');
    });

    it('should return 404 if no ad is found for the game type', async () => {
      const response = await request(app).get('/ads/unknownGameType');
      expect(response.status).toBe(404);
      expect(response.body.success).toBe(false);
    });
  });

  describe('POST /ads/view', () => {
    it('should record an ad view successfully', async () => {
      const response = await request(app)
        .post('/ads/view')
        .send({ adId: '12345', userId: '67890' });
      expect(response.status).toBe(200);
      expect(response.body.success).toBe(true);
    });

    it('should return 400 if required fields are missing', async () => {
      const response = await request(app).post('/ads/view').send({});
      expect(response.status).toBe(400);
      expect(response.body.success).toBe(false);
    });
  });
});