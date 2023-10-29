// test unknown endpoints
const request = require('supertest');
const app = require('../src/app');

// Test App module
// Test API up and running
describe('App', () => {
  describe('API up and running', () => {
    // test unknown endpoints should return 404
    it('should return 404 for unknown endpoints', async () => {
      const response = await request(app).get('/unknown');
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
    });
  });
});
