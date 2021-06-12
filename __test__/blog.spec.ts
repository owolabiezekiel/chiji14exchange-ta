const request = require("supertest");
const app = require("../app");
const connectTestDB = require("../config/testdb");

beforeAll(() => {
  connectTestDB();
});
