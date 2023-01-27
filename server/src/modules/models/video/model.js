const { getDb } = require("../../db/mongo");

const collectionName = "videos";

const getCollection = () => {
  console.log(`getCollection: ${collectionName}`);
  const db = getDb();
  const collection = db.collection(collectionName);
  return collection;
};

module.exports = {
  Video: getCollection(),
  name: collectionName,
};
