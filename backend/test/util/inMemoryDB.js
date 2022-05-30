const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const startDB = async () => {
  const server = await MongoMemoryServer.create();
  const uri = server.getUri();
  const connection = await mongoose.connect(uri);
  return [server, connection];
};

const stopDB = async (server, connection) => {
  await connection.disconnect();
  await server.stop();
};

const deleteAll = async (...collections) => {
  const promises = collections.map((collection) => collection.deleteMany());
  await Promise.all(promises);
};

module.exports = { startDB, stopDB, deleteAll };
