const express = require("express");
const {
  createBlogComment,
  getABlogComments,
  getSingleComment,
  updateComment,
  deleteComment,
} = require("../controllers/Comment.controller");

const router = express.Router();

router.post("/:blogID", createBlogComment);
router.get("/:blogID", getABlogComments);
router.get("/:blogID/comment/:commentID", getSingleComment);
router.put("/:blogID/comment/:commentID", updateComment);
router.delete("/:blogID/comment/:commentID", deleteComment);

module.exports = router;
