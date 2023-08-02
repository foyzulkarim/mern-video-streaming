const { baseSchema, ensureCollection } = require('./common');

const VIDEO_VISIBILITIES = ['Public', 'Private', 'Unlisted'];

const name = 'videos';

/**
 *  Video properties: 
    title, description, videoLink, fileName, visibility, 
    thumbnailUrl, playlistId, language, recordingDate, 
    category, viewsCount, likesCount, dislikesCount, 
 */
const updateSchema = async (db) => {
  const validator = {
    $jsonSchema: {
      bsonType: 'object',
      additionalProperties: false,
      required: [
        'title',
        'fileName',
        'originalName',
        'visibility',
        'recordingDate',
        'videoLink',
        ...Object.keys(baseSchema),
      ],
      properties: {
        ...baseSchema,
        title: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        description: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        viewCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'must be an integer',
        },
        visibility: {
          enum: VIDEO_VISIBILITIES,
          description: 'can only be one of the enum values and is required',
        },
        duration: {
          bsonType: 'int',
          minimum: 1,
          description: 'must be an integer',
        },
        playlistId: {
          bsonType: 'objectId',
          description: 'must be an objectId and is required',
        },
        language: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        recordingDate: {
          bsonType: 'date',
          description: 'must be a date and is required',
        },
        category: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        likesCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'must be an integer',
        },
        dislikesCount: {
          bsonType: 'int',
          minimum: 0,
          description: 'must be an integer',
        },
        videoLink: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        fileName: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        originalName: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        thumbnailUrl: {
          bsonType: 'string',
          description: 'must be a string and is required',
        },
        tags: {
          bsonType: 'array',
          description: 'must be an array and is required',
        },
        publishedAt: {
          bsonType: 'date',
          description: 'must be a date and is required',
        },
      },
    },
  };

  const indexes = [
    {
      key: { title: -1 },
      name: 'custom_title_index',
    },
    {
      key: { title: 'text' },
      name: 'title_text_index',
    },
    {
      key: { visibility: -1 },
      name: 'custom_visibility_index',
    },
    {
      key: { playlistId: -1 },
      name: 'custom_playlistId_index',
    },
    {
      key: { recordingDate: -1 },
      name: 'custom_recordingDate_index',
    },
    {
      key: { viewCount: -1 },
      name: 'custom_viewCount_index',
    },
  ];

  await ensureCollection({ db, name, validator, indexes });
};

module.exports = {
  updateSchema,
};
