const express = require("express");
const { createBlogComment } = require("../controllers/Comment.controller");

const router = express.Router();

router.post("/:blogID", createBlogComment);

module.exports = router;
