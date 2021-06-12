const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");

// Load env variables
dotenv.config({ path: "./config/config.env" });

const app = express();
app.use(express.json());

module.exports = app;
