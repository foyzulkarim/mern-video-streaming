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
      { _id: new ObjectId(_id) },
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

const getObjectById = async (collectionName, id) => {
  try {
    const item = await MongoManager.Instance.collection(collectionName).findOne({
      _id: new ObjectId(id),
    });
    return item;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const common = (collectionName) => {
  return {
    insert: async (item) => await insertItem(collectionName, item),
    update: async (item) => await updateItem(collectionName, item),
    getObjectById: async (id) => await getObjectById(collectionName, id),
  };
};

const createCollectionObject = (collectionName) =>
  Object.assign(
    MongoManager.Instance.collection(collectionName),
    common(collectionName)
  );

module.exports = {
  Video: createCollectionObject('videos'),
  Role: createCollectionObject('roles'),
};
