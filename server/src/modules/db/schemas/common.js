const { ObjectId } = require('mongodb');
const logger = require('../../../logger');

/**
 * Common properties for all of the collections
 * createdAt, updatedAt, isDeleted
 */

const baseSchema = {
  _id: {
    bsonType: 'objectId',
    description: 'Unique identifier for the document',
  },
  createdAt: {
    bsonType: 'date',
    description: 'Date of creation',
  },
  updatedAt: {
    bsonType: 'date',
    description: 'Date of last update',
  },
  isDeleted: {
    bsonType: 'bool',
    description: 'Whether the document is deleted',
  },
};

const baseIndexes = (prefix) => {
  return [
    {
      key: { createdAt: -1 },
      name: `${prefix}_createdAt_index`,
    },
    {
      key: { updatedAt: -1 },
      name: `${prefix}_updatedAt_index`,
    },
    {
      key: { isDeleted: -1 },
      name: `${prefix}_isDeleted_index`,
    },
  ];
};

const baseDefaults = () => ({
  _id: new ObjectId(),
  createdAt: new Date(),
  updatedAt: new Date(),
  isDeleted: false,
});

const ensureCollection = async ({ db, name, validator, indexes }) => {
  const collections = await db.listCollections({ name }).toArray();
  if (collections.length === 0) {
    logger.info(`creating collection ${name}`);
    await db.createCollection(name, { validator });
  } else {
    logger.info(`updating collection ${name}`);
    await db.command({
      collMod: name,
      validator,
    });
  }

  await db.command({
    createIndexes: name,
    indexes: [...indexes, ...baseIndexes(name)],
  });
};

module.exports = { baseSchema, baseDefaults, ensureCollection };
