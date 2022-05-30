const app = require("../app");
const mockserver = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../model/user");
const { startDB, stopDB, deleteAll } = require("./util/inMemoryDB");

describe("/api/dashboards get tests", () => {
  let connection;
  let server;
  let client

  beforeAll(async () => {
    const result = await startDB();
    server = result[0]
    connection = result[1]
    client = mockserver.agent(app)
  });

  afterEach(async() => {
    await deleteAll(User);
  });

  afterAll(async() => {
    await stopDB(server, connection);
  });

  test("new user gets back an empty array", async () => {
    // given
    const newUser = new User({ username: "Zildjian", googleId: 123 });
    await newUser.save();
    client.set("authorization", newUser._id);

    // when
    const response = await client.get("/api/dashboards");

    // then
    expect(response.status).toBe(200);
    const responseData = response.body;
    expect(responseData.user.dashboards).toStrictEqual([]);
  });

  test("deleted user receives nothing", async () => {
    // given
    const newUser = new User({ username: "Zildjian", googleId: 123 });
    await newUser.save();
    client.set("authorization", newUser._id);
    await User.deleteMany();
    
    
    // when
    const response = await client.get("/api/dashboards");
    
    // then
    expect(response.status).toBe(200);
    const responseData = response.body;
    expect(responseData.user).toBeNull();
  });
});
test("Get's back 404 Not Found on /api/nope", async () => {
  // given

  // when
  const server = mockserver(app);
  const response = await server.get("/api/nope");

  // then
  expect(response.status).toBe(404);
});
