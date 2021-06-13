const supertest = require("supertest");
const app = require("../app");
const Blog = require("../models/BlogModel");
const connectTestDB = require("../config/testdb");
const mongoose = require("mongoose");
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

const createBlog = (blog) => {
  return request.post("/api/v1/blog").send(blog);
};

const getAllBlogs = () => {
  return request.get("/api/v1/blog");
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
