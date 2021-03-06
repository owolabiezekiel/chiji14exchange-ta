const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/BlogModel");
const connectTestDB = require("../config/testdb");
const mongoose = require("mongoose");
const { deleteComment } = require("../controllers/Comment.controller");
const request = supertest(app);

beforeAll(() => {
  connectTestDB();
});

afterAll(async () => {
  await Blog.deleteMany();
  await mongoose.connection.close();
});

const validBlog = {
  title: "My First Blog Post",
  body: "This is my first blog post. it was created for the chiji14exchange technical assessment",
  author: "Tobiloba Owolabi",
};

const invalidBlog = {
  title: "M",
  body: "This is my first blog post. it was created for the chiji14exchange technical assessment",
  author: "Tobiloba Owolabi",
};

let blog;

const validComment = {
  commentBody: "My First Blog Post Comment",
  commentAuthor: "Samuel Peter",
};

const invalidComment = {
  commentBody: "My First Blog Post Comment",
  commentAuthor: "Sa",
};

let comment;

const createBlog = (blog) => {
  return request.post("/api/v1/blog").send(blog);
};

const getAllBlogs = () => {
  return request.get("/api/v1/blog");
};

const getAllBlogsWithComments = () => {
  return request.get("/api/v1/blog/comments");
};

const getSingleBlog = (blogID) => {
  return request.get("/api/v1/blog/" + blogID);
};

const updateBlog = (blogID) => {
  return request.put("/api/v1/blog/" + blogID).send({
    title: "My First Blog Post Updated",
    body: "This is my first blog post. it was created for the chiji14exchange technical assessment. And now it has been updated",
    author: "Updated author",
  });
};

const deleteBlog = (blogID) => {
  return request.delete("/api/v1/blog/" + blogID);
};

const createComment = (blogID, comment) => {
  return request.post("/api/v1/comment/" + blogID).send(comment);
};

const getABlogComments = (blogID) => {
  return request.get("/api/v1/comment/" + blogID);
};

const getSingleComment = (blogID, commentID) => {
  return request.get("/api/v1/comment/" + blogID + "/comment/" + commentID);
};

const updateComment = (blogID, commentID) => {
  return request
    .put("/api/v1/comment/" + blogID + "/comment/" + commentID)
    .send({
      commentBody: "My First Blog Post Comment now updated",
      commentAuthor: "Samuel Jackson",
    });
};

const deleteSingleComment = (blogID, commentID) => {
  return request.delete("/api/v1/comment/" + blogID + "/comment/" + commentID);
};

describe("Blog Creation Test", () => {
  it("returns 200 OK when blog create request is valid", async () => {
    const response = await createBlog(validBlog);
    blog = response.body.data;
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
  });

  it("returns 400 error when blog title is too short", async () => {
    const response = await createBlog(invalidBlog);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(undefined);
    expect(response.body.error).not.toBe(null);
    expect(response.body.error).toBe("Title cannot be less than 3 characters");
  });
});

describe("All Blogs Query Test", () => {
  it("returns 200 OK when blog query request is valid", async () => {
    var response = await getAllBlogs();
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data.length).toBe(1);
    await createBlog(validBlog);
    response = await getAllBlogs();
    expect(response.body.data.length).toBe(2);
  });

  it("Confirms comments is populated with data", async () => {
    var response = await getAllBlogsWithComments();
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data.length).toBe(2);
    expect(response.body.data[0].comments).toEqual([]);
    expect(response.body.data[0].comments.length).toEqual(0);
  });
});

describe("Single Blog Query Test", () => {
  it("Returns 200 OK when blogID is valid", async () => {
    const response = await getSingleBlog(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data).not.toBe(undefined);
    expect(response.body.data.id).toBe(blog.id);
    expect(response.body.data.title).toBe(blog.title);
    expect(response.body.data.body).toBe(blog.body);
    expect(response.body.data.id).toBe(blog.id);
  });

  it("Returns 404 NOTFOUND when blogID is invalid", async () => {
    const response = await getSingleBlog("123");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message).not.toBe(null);
  });
});

describe("Single Blog Update Test", () => {
  it("returns 200 OK when blogID is valid", async () => {
    const response = await updateBlog(blog.id);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.blog).not.toBe(null);
    expect(response.body.blog).not.toBe(undefined);
    expect(response.body.blog.id).toBe(blog.id);
    expect(response.body.blog.title).not.toBe(blog.title);
    expect(response.body.blog.body).not.toBe(blog.body);
    expect(response.body.blog.author).toBe(blog.author);
  });

  it("returns 404 NOTFOUND when blogID is invalid", async () => {
    const response = await updateBlog("123456789101112");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message).not.toBe(null);
  });
});

describe("Comment Creation Test", () => {
  it("returns 200 OK when comment create request is valid", async () => {
    const response = await createComment(blog.id, validComment);
    comment = response.body.data;
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data.commentBody).toEqual(
      "My First Blog Post Comment"
    );
    expect(response.body.data.commentAuthor).toEqual("Samuel Peter");
  });

  it("returns 400 error when comment author is too short", async () => {
    const response = await createComment(blog.id, invalidComment);
    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(undefined);
    expect(response.body.error).not.toBe(null);
    expect(response.body.error).toBe(
      "Comment author name cannot be less than 3 characters"
    );
  });

  it("returns 1 as size of comment array", async () => {
    const response = await getABlogComments(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.comments.length).toBe(1);
  });
});

describe("Blog Comments Query tests", () => {
  it("Details of first comment inserted is confirmed", async () => {
    const response = await getABlogComments(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data.blogID).toEqual(blog.id);
    expect(response.body.data.comments[0].id).toEqual(comment.id);
  });

  it("returns 2 as size of comment array after inserting a new comment", async () => {
    await createComment(blog.id, validComment);
    const response = await getABlogComments(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data.comments.length).toEqual(2);
  });
});

describe("Single Comment Query Test", () => {
  it("Returns 200 OK when comment ID is valid", async () => {
    const response = await getSingleComment(blog.id, comment.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data).not.toBe(null);
    expect(response.body.data).not.toBe(undefined);
    expect(response.body.data.blogID).toEqual(blog.id);
    expect(response.body.data.comment.id).toEqual(comment.id);
    expect(response.body.data.comment.commentBody).toBe(comment.commentBody);
    expect(response.body.data.comment.commentAuthor).toBe(
      comment.commentAuthor
    );
  });

  it("Returns 404 NOTFOUND when comment ID is invalid", async () => {
    const response = await getSingleComment("123");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message).not.toBe(null);
  });
});

describe("Single Comment Update Test", () => {
  it("Updates comment when blogID is valid and commentID is valid", async () => {
    const response = await updateComment(blog.id, comment.id);
    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.comment).not.toBe(null);
    expect(response.body.comment).not.toBe(undefined);
    expect(response.body.comment.id).toEqual(comment.id);
    expect(response.body.comment.commentBody).not.toEqual(comment.commentBody);
    expect(response.body.comment.commentAuthor).toEqual(comment.commentAuthor);
  });

  it("returns 404 NOTFOUND when commentID is invalid or comment", async () => {
    const response = await updateComment(blog.id, "fakeid-comment-101test");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(undefined);
    expect(response.body.message).not.toBe(null);
  });
});

describe("Single Comment Delete Test", () => {
  it("returns 200 OK when blogID is valid and comment ID is valid", async () => {
    const response = await deleteSingleComment(blog.id, comment.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).not.toBe(null);
    expect(response.body.message).toBe("Comment successfully deleted.");
  });

  it("returns 404 NOTFOUND when when trying to delete a deleted comment", async () => {
    const response = await deleteSingleComment(blog.id, comment.id);
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).not.toBe(null);
    expect(response.body.error).toBe(
      "Comment not found. It has either been deleted or not created yet"
    );
  });

  it("returns 1 as length of blog comment array after deleting first comment", async () => {
    const response = await getABlogComments(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.data.comments.length).toEqual(1);
    expect(response.body.data.comments[0].commentBody).toEqual(
      "My First Blog Post Comment"
    );
    console.log(response.body.data.comments);
  });

  it("returns 404 NOTFOUND when blogID is invalid", async () => {
    const response = await deleteSingleComment(
      "-test-fake-blog-id",
      comment.id
    );
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).not.toBe(null);
  });

  it("returns 404 NOTFOUND when comment ID is invalid", async () => {
    const response = await deleteSingleComment(
      blog.id,
      "-test-fake-comment-id"
    );
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.message).not.toBe(null);
  });
});

describe("Single Blog Delete Test", () => {
  it("returns 200 OK when blogID is valid", async () => {
    const response = await deleteBlog(blog.id);
    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.message).not.toBe(null);
    expect(response.body.message).toBe(
      "Blog successfully deleted alongside all related comments"
    );
  });

  it("returns 404 NOTFOUND when blogID is invalid", async () => {
    const response = await updateBlog("123456789101112");
    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
    expect(response.body.data).toBe(undefined);
    expect(response.body.error).not.toBe(
      "Blog not found. It has either been deleted or not created yet"
    );
  });
});
