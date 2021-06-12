const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const errorHander = require("./middlewares/error");

// Load env variables
dotenv.config({ path: "./config/config.env" });

// Import route files
const blogRoutes = require("./routes/blogRoute");
const commentRoutes = require("./routes/commentRoute");

const app = express();
app.use(express.json());

// Mount routers
app.use("/api/v1/blog", blogRoutes);
app.use("/api/v1/comment", commentRoutes);

// Middlewares are linear. It must appear after all the routes that need it have been mounted
app.use(errorHander);

module.exports = app;
