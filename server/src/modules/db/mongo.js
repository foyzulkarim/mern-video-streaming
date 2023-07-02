const { MongoClient } = require('mongodb');

let _db = null;
// create a connect
console.log('MONGODB_URL', process.env.MONGODB_URL);
const connect = async () => {
  const client = new MongoClient(process.env.MONGODB_URL, {
    useNewUrlParser: true,
  });
  console.log('connecting to MongoDB');
  await client.connect();
  _db = client.db('videodb');
  console.log('connected to MongoDB');
  return _db;
};

// create a getdb
const getDb = () => {
  return _db;
};

// export them
module.exports = {
  connect,
  getDb,
};
