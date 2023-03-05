const { faker } = require('@faker-js/faker');

/** Expected payload schema: 
Video:
	uploadedBy: User
	thumbnailUrl: URL string
	duration: number
	title: string
	viewCount: number
	publishedAt: Date
	description: string
	comments: [Comment]
	createdAt: Date
	updatedAt: Date
	videoHlsUrl: string
	videoProcessedUrl: string
	tags: [string]

Comment: 
	text: string
	commentedBy: User
	likeCount: number
	unlikeCount: number
	isLoved: boolean
	replies: 
		text : string
		commentedBy: User
	createdAt
	updatedAt

User:
	profilePictureUrl
	name
	createdAt
	updatedAt
 */

const getFakeVideosData = () => {
  const videos = [];
  for (let i = 0; i < 10; i++) {
    videos.push({
      id: faker.datatype.uuid(),
      uploadedBy: faker.name.firstName(),
      thumbnailUrl: faker.image.imageUrl(),
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

module.exports = {
  getFakeVideosData,
};
