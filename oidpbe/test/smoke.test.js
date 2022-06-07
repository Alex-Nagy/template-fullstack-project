const app = require("../app");
const mockserver = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const mongoose = require("mongoose");

const sum = (a, b) => {
  return a + b;
};

test("one plus one is two", () => {
  // given
  // no setup required

  // when
  const result = sum(1, 2);

  // then
  expect(result).toBe(3);
});

test("/somethin endpoint returns with 404", async () => {
  // given
  const server = mockserver(app);

  // when
  const response = await server.get("/api/random");

  // then
  expect(response.status).toBe(404);
});

test("/mongo in memory server working", async () => {
  // given
  const mongod = await MongoMemoryServer.create();
  const uri = mongod.getUri();
  const connection = await mongoose.connect(uri);

  const Cat = mongoose.model("Cat", { name: String });

  const kitty = new Cat({ name: "Zildjian" });

  // when
  await kitty.save();

  // then
  const catInDB = await Cat.findOne();
  expect(catInDB.name).toBe("Zildjian");
  await connection.disconnect();
  await mongod.stop();
});
