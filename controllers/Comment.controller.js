/**
 * This file contains all the CRUD API endpoints for the Comment model
 * @author Owolabi Tobiloba
 */

const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middlewares/async");
const Blog = require("../models/BlogModel");
const Comment = require("../models/CommentModel");

// Get all comments of a blog post
exports.getABlogComments = asyncHandler(async (req, res, next) => {
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
    data: {
      blogID,
      comments,
    },
  });
});

// Get a comment of a blog post by ID
exports.getSingleComment = asyncHandler(async (req, res, next) => {
  /**
   * First check if the blog ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Do a sanity check to see if the blog with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   * Then check if a comment ID was passed to the header, if not, throw a 400 bad request error with message
   */
  const blogID = req.params.blogID;

  if (!blogID) {
    return next(new ErrorResponse("Please provide blog ID", 400));
  }

  const commentID = req.params.commentID;

  if (!commentID) {
    return next(new ErrorResponse("Please provide comment ID", 400));
  }

  const comment = await Comment.findById(commentID);

  if (!comment) {
    return next(new ErrorResponse("Comment not found", 404));
  }

  res.status(200).json({
    success: true,
    data: {
      blogID,
      comment,
    },
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

// Update a comment by ID
exports.updateComment = asyncHandler(async (req, res, next) => {
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
   * Check if the comment ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Check if the comment with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   */
  const commentID = req.params.commentID;
  if (!commentID) {
    return next(new ErrorResponse("Please provide Comment ID", 400));
  }

  const comment = await Comment.findById(commentID);

  if (!comment) {
    return next(
      new ErrorResponse(
        "Comment not found. It has either been deleted or not created yet",
        404
      )
    );
  }

  /**
   * We get all the fields we need from the request body. This might not be great for request body with many parameters
   * For that, its better to create a DTO
   * Currently, we dont want the user to be able to change comment author so we dont get it from the request body
   */
  const { commentBody } = req.body;

  const updatedComment = await Comment.findByIdAndUpdate(
    commentID,
    { commentBody },
    {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    }
  );

  if (!updatedComment) {
    return next(new ErrorResponse("Comment could not be updated", 500));
  }

  res.status(201).json({
    success: true,
    comment: updatedComment,
  });
});

// Delete a comment by ID
exports.deleteComment = asyncHandler(async (req, res, next) => {
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
   * Check if the comment ID was passed in as a parameter, if not, throw a 400 bad request error with message
   * Check if the comment with the ID exists and return it. If it doesnt exist, throw a 404 not found error
   */
  const commentID = req.params.commentID;
  if (!commentID) {
    return next(new ErrorResponse("Please provide Comment ID", 400));
  }

  const comment = await Comment.findById(commentID);

  if (!comment) {
    return next(
      new ErrorResponse(
        "Comment not found. It has either been deleted or not created yet",
        404
      )
    );
  }

  await comment.remove();

  res.status(200).json({
    success: true,
    message: "Comment successfully deleted.",
  });
});
