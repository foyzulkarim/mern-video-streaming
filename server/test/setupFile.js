const { beforeAll, afterAll } = require('@jest/globals');

const { MongoManager } = require('../src/modules/db/mongo');

beforeAll(async () => {
  console.log('put your client connection code here, example with mongoose');
  await MongoManager.connect();
  expect(MongoManager.Instance).not.toBeNull();
});

afterAll(async () => {
  console.log('put your client disconnection code here, example with mongodb:');
});
