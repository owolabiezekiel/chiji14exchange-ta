const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Comment = require("./CommentModel");

const BlogSchema = Schema(
  {
    _id: Schema.Types.ObjectId,
    title: {
      type: String,
      required: [true, "Please provide a title"],
      minlength: [3, "Title cannot be less than 3 characters"],
      maxlength: [50, "Title cannot be more than 50 characters"],
    },
    body: {
      type: String,
      required: [true, "Please provide a blog body"],
      minlength: [30, "Blog text cannot be less than 30 characters"],
      maxlength: [1000, "Author name cannot be less than 1000 characters"],
    },
    author: {
      type: String,
      required: [true, "Please provide an author name"],
      minlength: [3, "Author name cannot be less than 3 characters"],
      maxlength: [50, "Author name cannot be more than 50 characters"],
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

BlogSchema.virtual("comments", {
  ref: "Comment",
  localField: "_id",
  foreignField: "blog",
  justOne: false,
});

BlogSchema.post("remove", (document) => {
  const blogID = document._id;
  Comment.remove({ blog: blogID }).exec();
});

module.exports = mongoose.model("Blog", BlogSchema);
