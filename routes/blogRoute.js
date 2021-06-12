const express = require("express");
const {
  getAllBlogs,
  getAllBlogsWithComments,
} = require("../controllers/Blog.controller");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/comments", getAllBlogsWithComments);

module.exports = router;
