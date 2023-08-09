const { ObjectId } = require('mongodb');
const { Video } = require('../../db/collections');
const { VIDEO_STATUS } = require('../../db/constant')


// TODO: add logging

const insert = async (document) => {
  try {
    return await Video.insert({status: VIDEO_STATUS.PENDING, ...document}); // assigning default satus for all new videos
  } catch (error) {
    return error;
  }
};

const update = async (document) => {
  try {
    return await Video.update(document);
  } catch (error) {
    return error;
  }
};

const search = async (searchObject) => {
  const filter = searchObject.keyword
    ? {
        title: new RegExp(searchObject.keyword),
        isDeleted: false,
      }
    : {
        isDeleted: false,
      };

  const projection = {
    title: 1,
    description: 1,
    category: 1,
    duration: 1,
    viewCount: 1,
    status : 1,
    recordingDate: 1,
    thumbnailUrl : 1
  };

  const sort = searchObject.sort || { viewCount: -1 };
  const pageNumber = searchObject.pageNumber || 1;
  console.log('search', searchObject);

  const videos = await Video.search({ filter, projection, sort, pageNumber });
  return videos;
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
