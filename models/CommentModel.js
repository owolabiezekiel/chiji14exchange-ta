const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CommentSchema = Schema(
  {
    blog: { type: Schema.Types.ObjectId, ref: "Person" },
    commentBody: {
      type: String,
      required: [true, "Please provide comment body"],
      minlength: [1, "Comment body cannot be less than 1 character"],
      maxlength: [1000, "Comment body cannot be more than 1000 characters"],
    },
    commentAuthor: {
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
