const express = require("express");
const {
  getAllBlogs,
  getAllBlogsWithComments,
  getBlog,
  createBlog,
  updateBlog,
  deleteBlog,
} = require("../controllers/Blog.controller");

const router = express.Router();

router.get("/", getAllBlogs);
router.get("/comments", getAllBlogsWithComments);
router.get("/:blogID", getBlog);
router.post("/", createBlog);
router.put("/:blogID", updateBlog);
router.delete("/:blogID", deleteBlog);

module.exports = router;
