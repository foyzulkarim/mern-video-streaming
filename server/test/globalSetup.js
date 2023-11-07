// import { MongoMemoryServer } from 'mongodb-memory-server';
const { MongoMemoryServer } = require('mongodb-memory-server');

module.exports = async function globalSetup() {
  const instance = await MongoMemoryServer.create();
  const uri = instance.getUri();
  global.__MONGOINSTANCE = instance;
  process.env.MONGODB_URL = uri.slice(0, uri.lastIndexOf('/'));
  console.log('globalSetup executed ', {
    URL: process.env.MONGODB_URL,
    time: new Date(),
  });
};
