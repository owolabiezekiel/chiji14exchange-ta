/**
 * This file contains all the CRUD API endpoints for the Comment model
 * @author Owolabi Tobiloba
 */

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Blog = require("../models/BlogModel");
const Comment = require("../models/CommentModel");

// Get all blog posts
exports.getAllBlogComments = asyncHandler(async (req, res, next) => {
  /**
   * First check if the blog ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Do a sanity check to see if the blog with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   */
  const blogID = req.params.blogID;
  if (!blogID) {
    return next(new ErrorResponse("Please provide blog ID", 400));
  }

  const comments = await Comment.find({ blog: blogID });

  res.status(200).json({
    success: true,
    data: comments,
  });
});

// Create a comment on a blog
exports.createBlogComment = asyncHandler(async (req, res, next) => {
  /**
   * First check if the blog ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Check if the blog with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   */
  const blogID = req.params.blogID;
  if (!blogID) {
    return next(new ErrorResponse("Please provide blog ID", 400));
  }

  const blog = await Blog.findById(blogID);

  if (!blog) {
    return next(
      new ErrorResponse(
        "Blog not found. It has either been deleted or not created yet",
        404
      )
    );
  }

  /**
   * We get all the fields we need from the request body. This might not be great for request body with many parameters
   * For that, its better to create a DTO
   */
  const { commentBody, commentAuthor } = req.body;
  const comment = await Comment.create({
    blog: blogID,
    commentBody,
    commentAuthor,
  });

  /**
   * Send response. If there is an error, our error handler middleware will catch it and
   * return a suitable response
   */
  res.status(201).json({
    success: true,
    data: comment,
  });
});
