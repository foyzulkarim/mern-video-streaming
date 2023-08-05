const { faker } = require('@faker-js/faker');
const { MongoManager } = require('../../src/modules/db/mongo');
const { VIDEO_STATUS, VIDEO_VISIBILITIES } = require('../../src/modules/db/schemas/videos');

const getFakeVideosData = (x) => {
  const videos = [];
  console.log('getting new batch', x);
  for (let i = 0; i < 1000; i++) {
    videos.push({
      title: faker.lorem.sentence(5),
      visibility: faker.helpers.arrayElement(VIDEO_VISIBILITIES),
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
      status: faker.helpers.arrayElement(VIDEO_STATUS),
      isDeleted : faker.datatype.boolean(),
      thumbnailUrl: faker.image.imageUrl(),
      duration: parseInt(faker.random.numeric()),
      viewCount: parseInt(faker.random.numeric()),
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      tags: [faker.random.word(), faker.random.word(), faker.random.word()],
      originalName: faker.lorem.sentence(5),
      videoLink: faker.image.imageUrl(),
    });
  }
  return videos;
};

const seedData = async () => {
  await MongoManager.connect();

  const { insert } = require('../../src/modules/models/video/service');

  for (let index = 0; index < 1000; index++) {
    const videos = getFakeVideosData(index);
    let i = 0;
    for await (const video of videos) {
      const result = await insert(video);
      console.log(`${index} - ${i++}`, '\t', result.insertedId);
    }
  }
};

(async () => {
  await seedData();
  process.exit(0);
})();
