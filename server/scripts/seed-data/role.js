const { faker } = require('@faker-js/faker');
const { MongoManager } = require('../../src/modules/db/mongo');
const logger = require('../../src/logger');

const getFakeRolesData = (x) => {
  const roles = []
  for (let i = 0; i < 1000; i++) {
    roles.push({
      createdAt: faker.date.past(),
      // isActive: faker.datatype.boolean(),
      // isPublic: faker.datatype.boolean(),
      isDeleted: faker.datatype.boolean(),
      name: faker.random.word(),
      updatedAt: faker.date.past(),

    });
  }
  return roles;
};

const seedData = async () => {
  await MongoManager.connect();

  const { insert } = require('../../src/modules/models/role/service')

  for (let index = 0; index < 1000; index++) {
    const roles = getFakeRolesData(index);
    let i = 0;
    for await (const role of roles) {
      const result = await insert(role);
      logger.info(`${index} - ${i++}`, '\t', result.insertedId);
    }
  }
};

(async () => {
  await seedData();
  process.exit(0);
})();
