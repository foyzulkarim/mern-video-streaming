// test unknown endpoints
const request = require('supertest');

let app = null;
beforeAll(async () => {
  console.log('1 - beforeAll');
  app = require('../src/app');
  app.setupRoutes();
});
afterAll(async () => {
  console.log('1 - afterAll');
  app = null;
});
beforeEach(async () => console.log('1 - beforeEach'));
afterEach(async () => console.log('1 - afterEach'));

// Test App module
// Test API up and running
describe('App', () => {
  describe('API routes setup completed and running', () => {
    // test unknown endpoints should return 404
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
    });
    // test default or root path should return 200
    it('should return 200 for default or root path', async () => {
      const response = await request(app).get('/');
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });
  });
});
