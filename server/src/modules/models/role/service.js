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

module.exports = {
  insert,
  update,
  getById: Role.getObjectById
};
