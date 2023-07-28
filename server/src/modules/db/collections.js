const { ObjectId } = require('mongodb');
const { MongoManager } = require('./mongo');
const { baseDefaults } = require('./schemas/common');

const insertItem = async (collection, item) => {
  try {
    return await MongoManager.Instance.collection(collection).insertOne({
      ...baseDefaults(),
      ...item,
    });
  } catch (error) {
    console.error(error);
    return null;
  }
};

const updateItem = async (collection, item) => {
  try {
    const { _id, ...properties } = item;
    return await MongoManager.Instance.collection(collection).updateOne(
      { _id: ObjectId(_id) },
      {
        $set: {
          updatedAt: new Date(),
          ...properties,
        },
      }
    );
  } catch (error) {
    console.error(error);
    return null;
  }
};

const common = (collectionName) => {
  return {
    insert: async (item) => await insertItem(collectionName, item),
    update: async (item) => await updateItem(collectionName, item),
  };
};

module.exports = {
  Video: { ...MongoManager.Instance.collection('videos'), ...common('videos') },
  Role: { ...MongoManager.Instance.collection('roles'), ...common('roles') },
};
