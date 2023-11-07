const { ObjectId } = require('mongodb');
const { Video } = require('../../db/collections');
const { VIDEO_STATUS } = require('../../db/constant');
const logger = require('../../../logger');

const insert = async (document) => {
  try {
    return await Video.insert({ status: VIDEO_STATUS.PENDING, ...document });
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
  logger.info('searchObject', searchObject);
  const filter = searchObject.filterKey
    ? {
        [searchObject.filterKey]: new RegExp(searchObject.filterValue, 'i'),
        isDeleted: false,
        status: VIDEO_STATUS.PUBLISHED,
      }
    : {
        isDeleted: false,
        status: VIDEO_STATUS.PUBLISHED,
      };

  const projection = {
    title: 1,
    description: 1,
    category: 1,
    duration: 1,
    viewCount: 1,
    status: 1,
    recordingDate: 1,
    thumbnailUrl: 1,
  };

  const sort = searchObject.sortKey
    ? { [searchObject.sortKey]: searchObject.sortValue ?? 1 }
    : { _id: -1 };
  const pageNumber = searchObject.pageNumber || 1;
  const limit = searchObject.limit || 10;

  const videos = await Video.search({
    filter,
    projection,
    sort,
    pageNumber,
    limit,
  });
  return videos;
};

const count = async (searchObject) => {
  logger.info('searchObject', searchObject);
  const filter = searchObject.filterKey
    ? {
        [searchObject.filterKey]: new RegExp(searchObject.filterValue, 'i'),
        isDeleted: false,
        status: VIDEO_STATUS.PUBLISHED,
      }
    : {
        isDeleted: false,
        status: VIDEO_STATUS.PUBLISHED,
      };
  const videos = await Video.count({ filter });
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
    logger.error(error);
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
    if (error.code || error.name === 'BSONError') {
      // Log the error and return a generic error object
      logger.error(error);
      return new Error('An unexpected error occurred');
    } else {
      // Rethrow the error
      return error;
    }
  }
};

module.exports = {
  insert,
  search,
  getById: Video.getObjectById,
  update,
  updateHistory,
  updateViewCount,
  deleteById: Video.deleteById,
  count,
};
