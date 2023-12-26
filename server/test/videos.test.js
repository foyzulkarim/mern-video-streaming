const { expect, test, describe } = require('@jest/globals');
const request = require('supertest');

const factory = require('./factory');
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
    test('should return 200 for "/"', async () => {
      const response = await request(app).get(BASE_URL);
      expect(response.status).toBe(200);
      expect(response.error).toBe(false);
    });

    test('should return 404 for "/detail/:id" when id is not provided', async () => {
      const response = await request(app).get(`${BASE_URL}/detail`);
      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
      expect(response.error.text).toContain('Not Found');
    });

    test('should return 400 for "/detail/:id" when id is invalid', async () => {
      const id = 'invalid-id';
      const response = await request(app).get(`${BASE_URL}/detail/${id}`);
      expect(response.status).toBe(400);
      expect(response.error).not.toBeNull();
      expect(response.error.text).toContain('An unexpected error occurred');
    });

    test('should return 404 for "/detail/:id" when id is not found', async () => {
      const id = '121212121212';
      const response = await request(app).get(`${BASE_URL}/detail/${id}`);

      expect(response.status).toBe(404);
      expect(response.error).not.toBeNull();
      expect(response.error.text).toContain('Video not found');
    });

    test('should return video object and increase viewCount for "/detail/:id" when id is valid', async () => {
      const video = await factory.createVideo();
      const response = await request(app).get(
        `${BASE_URL}/detail/${video._id.toString()}`
      );
      expect(response.status).toBe(200);
      expect(response.body).not.toBeNull();
      const responsedVideo = response.body;

      expect(responsedVideo._id).toBe(video._id.toString());
      expect(responsedVideo.viewCount).toBe(video.viewCount);

      const { getById } = require('../src/modules/models/video/service');
      const dbVideo = await getById(video._id);
      expect(dbVideo.viewCount).toBe(video.viewCount + 1);
    });
  });
});
