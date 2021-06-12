const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema(
  {
    blog: {
      type: mongoose.Schema.ObjectId,
      ref: "Blog",
    },
    comment_body: {
      type: String,
      required: [true, "Please provide a blog body"],
      minlength: [30, "Blog text cannot be less than 30 characters"],
      maxlength: [1000, "Author name cannot be less than 1000 characters"],
    },
    comment_author: {
      type: String,
      required: [true, "Please provide comment author name"],
      minlength: [3, "Comment author name cannot be less than 3 characters"],
      maxlength: [50, "Comment author name cannot be more than 50 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

module.exports = mongoose.model("Comment", CommentSchema);
