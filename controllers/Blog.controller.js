/**
 * This file contains all the CRUD API endpoints for the Blog model
 * @author Owolabi Tobiloba
 */

const mongoose = require("mongoose");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Blog = require("../models/BlogModel");
const Comment = require("../models/CommentModel");

// Get all blog posts
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

// Get all blog posts with comments
exports.getAllBlogsWithComments = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().populate({ path: "comments" });

  res.status(200).json({
    success: true,
    data: blogs,
  });
});

// Get a particular blog by ID
exports.getBlog = asyncHandler(async (req, res, next) => {
  /**
   * First check if the blog ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Check if the blog with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   */
  const blogID = req.params.blogID;
  if (!blogID) {
    return next(new ErrorResponse("Please provide blog ID", 400));
  }

  const blog = await Blog.findById(blogID).populate({ path: "comments" });

  if (!blog) {
    return next(new ErrorResponse("Blog not found", 404));
  }

  res.status(200).json({
    success: true,
    data: blog,
  });
});

// Create a blog
exports.createBlog = asyncHandler(async (req, res, next) => {
  /**
   * We get all the fields we need from the request body. This might not be great for request body with many parameters
   * For that, its better to create a DTO
   */
  const { title, body, author } = req.body;
  const blog = await Blog.create({
    _id: new mongoose.Types.ObjectId(),
    title,
    body,
    author,
  });

  /**
   * Send response. If there is an error, our error handler middleware will catch it and
   * return a suitable response
   */
  res.status(201).json({
    success: true,
    data: blog,
  });
});

// Update a blog by ID
exports.updateBlog = asyncHandler(async (req, res, next) => {
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
   * Currently, we dont want the user to be able to change blog author so we dont get it from the request body
   */
  const { title, body } = req.body;

  const updatedBlog = await Blog.findByIdAndUpdate(
    blogID,
    { title, body },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!updatedBlog) {
    return next(new ErrorResponse("Blog could not be updated", 500));
  }

  res.status(201).json({
    success: true,
    blog: updatedBlog,
  });
});

// Delete a blog by ID
exports.deleteBlog = asyncHandler(async (req, res, next) => {
  /**
   * First check if the blog ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Check if the blog with the ID exists and delete it. If it doesnt exist, throw a 404 not found error
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

  await blog.remove();

  res.status(200).json({
    success: true,
    message: "Blog successfully deleted alongside all related comments",
  });
});
