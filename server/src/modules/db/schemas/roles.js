const { baseSchema, ensureCollection } = require('./common');

const name = 'roles';

/**
 * Role properties:
 * name, isActive, isPublic,
 *
 */

const updateSchema = async (db) => {
  const validator = {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: ['name', 'isActive', 'isPublic', ...Object.keys(baseSchema)],
      properties: {
        ...baseSchema,
        name: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        isActive: {
          bsonType: 'bool',
          description: 'must be a boolean and is required',
        },
        isPublic: {
          bsonType: 'bool',
          description: 'must be a boolean and is required',
        },
      },
    },
  };

  const indexes = [
    {
      key: { name: 1 },
      unique: true,
      name: `${name}_name_index`,
    },
  ];

  await ensureCollection({ db, name, validator, indexes });
};

module.exports = {
  updateSchema,
};
