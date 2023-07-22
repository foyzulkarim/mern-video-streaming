const { MongoManager } = require('./mongo');

module.exports = {
  Video: MongoManager.Instance.collection('videos'),
  Role: MongoManager.Instance.collection('roles'),
};
