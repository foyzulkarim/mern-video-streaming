import { faker } from '@faker-js/faker';

const images = [
  faker.image.nature(),
  faker.image.transport(),
  faker.image.technics(),
  faker.image.abstract(),
  faker.image.animals(),
  faker.image.business(),
  faker.image.food(),
  faker.image.nightlife(),
  faker.image.fashion(),
  faker.image.people(),
];

const getFakeVideosData = () => {
  const videos = [];
  for (let i = 0; i < 10; i++) {
    videos.push({
      id: faker.datatype.uuid(),
      uploadedBy: faker.name.firstName(),
      thumbnailUrl: images[i],
      duration: faker.random.numeric(),
      title: faker.lorem.sentence(5),
      viewCount: faker.random.numeric(),
      publishedAt: faker.date.past(),
      description: faker.lorem.paragraph(),
      comments: [
        {
          text: faker.lorem.paragraph(),
          commentedBy: faker.name.firstName(),
          likeCount: faker.random.numeric(),
          unlikeCount: faker.random.numeric(),
          isLoved: i % 2 === 0,
          replies: [
            {
              text: faker.lorem.paragraph(),
              commentedBy: faker.name.firstName(),
              createdAt: faker.date.past(),
              updatedAt: faker.date.past(),
            },
          ],
          createdAt: faker.date.past(),
          updatedAt: faker.date.past(),
        },
      ],
      createdAt: faker.date.past(),
      updatedAt: faker.date.past(),
      videoHlsUrl: faker.image.imageUrl(),
      videoProcessedUrl: faker.image.imageUrl(),
      tags: [faker.random.word(), faker.random.word(), faker.random.word()],
    });
  }
  return videos;
};

export default getFakeVideosData();
