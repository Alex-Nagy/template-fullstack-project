require("dotenv").config();
const jwt = require("jsonwebtoken");
const app = require("../app");
const mockserver = require("supertest");
const { MongoMemoryServer } = require("mongodb-memory-server");
const User = require("../model/user");
const { startDB, stopDB, deleteAll } = require("./util/inMemoryDB");

describe("/api/user/login get tests", () => {
  let connection;
  let server;
  let client;

  beforeAll(async () => {
    const result = await startDB();
    server = result[0];
    connection = result[1];
    client = mockserver.agent(app);
  });

  afterEach(async () => {
    await deleteAll(User);
  });

  afterAll(async () => {
    await stopDB(server, connection);
  });

  test("return 400 without body (user not created)", async () => {
    // given

    // when
    const response = await client.post("/api/user/login").send({})

    // then
    expect(response.status).toBe(400);
  });

  test("return 400 without provider (user not created)", async () => {
    // given
    const code = "random"

    // when
    const response = await client.post("/api/user/login").send({
        code
    });

    // then
    expect(response.status).toBe(400);
  });

  test("return 400 without code data (user not created)", async () => {
    // given
    const provider = "github"

    // when
    const response = await client.post("/api/user/login").send({
        provider
    });

    // then
    expect(response.status).toBe(400);
  });

  test("return 400 with invalid provider (user not created)", async () => {
    // given
    const code = "random"
    const provider = "twitter"

    // when
    const response = await client.post("/api/user/login").send({
        code, provider
    });

    // then
    expect(response.status).toBe(400);
  });
});
