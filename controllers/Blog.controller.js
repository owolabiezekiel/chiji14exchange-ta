/**
 * This file contains all the CRUD API endpoints for the Blog model
 * @author Owolabi Tobiloba
 */

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Blog = require("../models/BlogModel");

// Get all blog posts
exports.getAllBlogs = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find();
  res.status(200).json({
    success: true,
    data: blogs,
  });
});

// Get all blog posts
exports.getAllBlogsWithComments = asyncHandler(async (req, res, next) => {
  const blogs = await Blog.find().populate("comments");
  res.status(200).json({
    success: true,
    data: blogs,
  });
});
