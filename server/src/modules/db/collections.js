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
    console.error(error.errInfo?.details);
    if (error.code.toString() === '121') {
      // MongoServerError: Document failed validation
      console.log('schemaErrors', JSON.stringify(error.errInfo?.details));
    }
    return error;
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
    const item = await MongoManager.Instance.collection(collectionName).findOne(
      {
        _id: new ObjectId(id),
      }
    );
    return item;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const search = async (
  collectionName,
  { filter, projection, sort, pageNumber = 1, limit = 10 }
) => {
  const skip = (pageNumber - 1) * limit;
  console.log(
    'filter, projection, sort, pageNumber',
    filter,
    projection,
    sort,
    pageNumber,
    limit
  );

  const cursor = await MongoManager.Instance.collection(collectionName).find(
    filter,
    { projection, sort: sort || { createdAt: -1 }, skip, limit }
  );
  const result = await cursor.toArray();
  return result;
};

const deleteObjectById = async (collectionName, id) => {
  try {
    const result = await MongoManager.Instance.collection(
      collectionName
    ).deleteOne({
      _id: new ObjectId(id),
    });

    return result;
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
    search: async (params) => await search(collectionName, params),
    deleteById: async (id) => await deleteObjectById(collectionName, id),
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
