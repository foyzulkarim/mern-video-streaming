const { ObjectId } = require('mongodb');
const { MongoManager } = require('../../db/mongo');
const { Role } = require('../../db/collections');

const insert = async (role) => {
  try {
    const item = { isPublic: false, isActive: true, ...role };
    return await Role.insert(item);
  } catch (error) {
    return error;
  }
};

const update = async (role) => {
  try {
    return await Role.update(role);
  } catch (error) {
    console.error(error);
    return error;
  }
};

const search = async (searchObject) => {
  const filter = searchObject.keyword
    ? {
        name: new RegExp(searchObject.keyword),
        isDeleted: false,
      }
    : {
        isDeleted: false,
      };

  const projection = {
    name: 1,
  };

  const pageNumber = searchObject.pageNumber || 1;
  const skip = (pageNumber - 1) * 10;
  const limit = 10;

  const sort = searchObject.sort || { createdAt: -1 };

  const cursor = await Role.find(filter, { projection, sort, skip, limit });
  const result = await cursor.toArray();
  return result;
};

module.exports = {
  insert,
  update,
  getById: Role.getObjectById,
};
