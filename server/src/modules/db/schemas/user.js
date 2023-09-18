const { baseSchema, ensureCollection } = require('./common');


const collectionName = 'user';


const updateSchema = async (db) => {
  const validator = {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: [
        'email',
        'password',
        ...Object.keys(baseSchema),
      ],
      properties: {
        ...baseSchema,
        name: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        email: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        password: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        isActive: {
            bsonType: 'bool',
            description: 'Whether the user is active',
          },


      },
    },
  };

  const indexes = [
    {
      key: { name: 'text'},
      name: 'name_index',
    },
    {
      key: { email: 1 },
      unique: true,
      name: 'email_index',
    }
  ];

  await ensureCollection({ db, name:collectionName, validator, indexes });
};

module.exports = {
  updateSchema,
  collectionName,
};
