const { MongoManager } = require("../../db/mongo");

const VIDEO_VISIBILITIES = ["Public", "Private", "Unlisted"];
const VIDEO_STATUS = ["pending", "processed", "published"];

const name = 'videos'

/**
 *  Video properties: 
    title, description, videoLink, fileName, visibility, 
    thumbnailUrl, playlistId, language, recordingDate, 
    category, viewsCount, likesCount, dislikesCount, 
 */
const updateSchema = async () => {
  const db = MongoManager.Instance;
  const validator = {
    $jsonSchema: {
      bsonType: "object",
      required: [
        "title",
        "fileName",
        "originalName",
        "visibility",
        "recordingDate",
        "videoLink",
      ],
      properties: {
        title: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        description: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        viewsCount: {
          bsonType: "int",
          minimum: 0,
          description: "must be an integer",
        },
        visibility: {
          enum: VIDEO_VISIBILITIES,
          description: "can only be one of the enum values and is required",
        },
        status: {
          enum: VIDEO_STATUS,
          description: "can only be one of the enum values and is required",
        },
        playlistId: {
          bsonType: "objectId",
          description: "must be an objectId and is required",
        },
        language: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        recordingDate: {
          bsonType: "date",
          description: "must be a date and is required",
        },
        category: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        likesCount: {
          bsonType: "int",
          minimum: 0,
          description: "must be an integer",
        },
        dislikesCount: {
          bsonType: "int",
          minimum: 0,
          description: "must be an integer",
        },
        videoLink: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        fileName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        originalName: {
          bsonType: "string",
          description: "must be a string and is required",
        },
        thumbnailUrl: {
          bsonType: "string",
          description: "must be a string and is required",
        },
      },
    },
  };

  const collections = await db.listCollections({ name }).toArray();
  if (collections.length === 0) {
    console.log(`creating collection ${name}`);
    await db.createCollection(name, { validator });
  } else {
    console.log(`updating collection ${name}`);
    await db.command({
      collMod: name,
      validator,
    });
  }

  // indexes: title, visibility, playlistId, recordingDate, status
  await db.command({
    createIndexes: name,
    indexes: [
      {
        key: { title: -1 },
        name: "custom_title_index",
      },
      {
        key: { title: "text" },
        name: "title_text_index",
      },
      {
        key: { visibility: -1 },
        name: "custom_visibility_index",
      },
      {
        key: { playlistId: -1 },
        name: "custom_playlistId_index",
      },
      {
        key: { recordingDate: -1 },
        name: "custom_recordingDate_index",
      },
      {
        key: { status: -1 },
        name: "custom_status_index",
      },
    ],
  });
};

module.exports = {
  updateSchema,
};
