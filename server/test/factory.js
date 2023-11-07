const { faker } = require('@faker-js/faker');
const { MongoManager } = require('../src/modules/db/mongo');
const {
  VIDEO_STATUS,
  VIDEO_VISIBILITIES,
} = require('../src/modules/db/constant');

const createVideo = async () => {
  await MongoManager.connect();
  const { insert } = require('../src/modules/models/video/service');
  const video = {
    title: faker.lorem.sentence(5),
    visibility: faker.helpers.arrayElement(Object.values(VIDEO_VISIBILITIES)),
    category: faker.helpers.arrayElement([
      'education',
      'entertainment',
      'news',
      'sports',
    ]),
    description: faker.lorem.paragraph(),
    recordingDate: faker.date.past(),
    publishedAt: faker.date.past(),
    fileName: faker.lorem.sentence(5),
    status: faker.helpers.arrayElement(Object.values(VIDEO_STATUS)),
    isDeleted: faker.datatype.boolean(),
    thumbnailUrl: faker.image.imageUrl(),
    duration: parseInt(faker.random.numeric()),
    viewCount: parseInt(faker.random.numeric()),
    createdAt: faker.date.past(),
    updatedAt: faker.date.past(),
    tags: [faker.random.word(), faker.random.word(), faker.random.word()],
    originalName: faker.lorem.sentence(5),
    videoLink: faker.image.imageUrl(),
  };
  const result = await insert(video);
  return {
    ...video,
    _id: result.insertedId,
  };
};

module.exports = { createVideo };
