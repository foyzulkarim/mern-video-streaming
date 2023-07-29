const { ObjectId } = require('mongodb');
const { Video, Role } = require('../../db/collections');

const insert = async (document) => {
  try {
    return await Video.insertOne(document);
  } catch (error) {
    return error;
  }
};

const update = async (document) => {
  try {
    return await Video.update(document);
  } catch (error) {
    console.error(error);
    return error;
  }
};

// TODO: use regex or like search
const search = async (searchObject) => {
  const result = await Video.find(searchObject).toArray();
  return result;
};

const updateHistory = async (id, { history, ...rest }) => {
  try {
    const updatedDoc = await Video.updateOne(
      { _id: new ObjectId(id) },
      { $push: { history }, $set: { ...rest } }
    );
    return updatedDoc;
  } catch (error) {
    console.error(error);
    return error;
  }
};

const updateViewCount = async (id) => {
  try {
    const updatedDoc = await Video.findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $inc: { viewCount: 1 } }
    );
    return updatedDoc.value;
  } catch (error) {
    return error;
  }
};

const deleteById = async (id) => {
  try {
    const deleted = await Video.deleteOne({
      _id: new ObjectId(id),
    });
    return deleted;
  } catch (error) {
    console.error(error);
    return error;
  }
};


module.exports = {
  insert,
  search,
  getById: Video.getObjectById,
  update,
  updateHistory,
  updateViewCount,
  deleteById,
};
