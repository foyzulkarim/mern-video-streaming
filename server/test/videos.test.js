// test unknown endpoints
const request = require('supertest');

let app = null;
beforeAll(async () => {
  app = require('../src/app');
  app.setupRoutes();
});
afterAll(async () => {
  app = null;
});

// Test App module
// Test API up and running

const BASE_URL = '/api/videos';

describe('Videos', () => {
  describe('API ("/api/videos") routes setup completed and running', () => {
    // test default or root path should return 200
    it('should return 200 for "/"', async () => {
      const response = await request(app).get(BASE_URL);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });

    it('should return 404 for "/detail/:id" when id is not provided', async () => {
      const response = await request(app).get(`${BASE_URL}/detail`);
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
    });
  });
});
