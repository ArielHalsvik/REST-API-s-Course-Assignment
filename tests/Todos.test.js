const express = require("express");
const request = require("supertest");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const userRouter = require("../routes/users");
const todoRouter = require("../routes/todos");
const categoryRouter = require("../routes/categories");

app.use(bodyParser.json());
app.use("/users", userRouter);
app.use("/todos", todoRouter);
app.use("/categories", categoryRouter);

describe("testing-the-todos-API", () => {
  let token;
  let categoryId;
  let todoId;

  /* Create a test user */
  test("POST /users/signup - success", async () => {
    const userData = {
      name: "Sunny Smith",
      email: "sunnysmith@gmail.com",
      password: "12345",
    };

    const { body } = await request(app).post("/users/signup").send(userData);

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("User created successfully");
  });

  /* Login with a valid account */
  test("POST /users/login - success", async () => {
    const userData = {
      email: "sunnysmith@gmail.com",
      password: "12345",
    };

    const { body } = await request(app).post("/users/login").send(userData);

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("token");
    token = body.data.token;
  });

  /* Creating a Category */
  test("POST /categories - success", async () => {
    const categoryObj = {
      name: "Shopping",
    };

    const { body } = await request(app)
      .post("/categories")
      .send(categoryObj)
      .set("Authorization", "Bearer " + token);

    categoryId = body.data.result.id;

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("statusCode");
    expect(body.data.statusCode).toBe(200);
  });

  /* Get all the user's Todos */
  test("GET /todos - success", async () => {
    const { body } = await request(app)
      .get("/todos")
      .set("Authorization", "Bearer " + token);

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("statusCode");
    expect(body.data.statusCode).toBe(200);
  });

  /* Add a new Todo item */
  test("POST /todos - success", async () => {
    const todoObj = {
      name: "Buy groceries",
      description: "Need food",
      categoryId: categoryId,
      statusId: "1",
    };

    const { body } = await request(app)
      .post("/todos")
      .send(todoObj)
      .set("Authorization", "Bearer " + token);

    todoId = body.data.result.id;

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("statusCode");
    expect(body.data.statusCode).toBe(200);
  });

  /* Delete the newly made Todo item */
  test("DELETE /todos/:id - success", async () => {
    const { body } = await request(app)
      .delete("/todos/" + todoId)
      .set("Authorization", "Bearer " + token);

    expect(body).toHaveProperty("data");
    expect(body.data).toHaveProperty("result");
    expect(body.data.result).toBe("Todo has been deleted");
  });

  /* Trying to get Todos without a JWT token in the header */
  test("GET /todos - fail", async () => {
    const { body } = await request(app).get("/todos");

    expect(body).toEqual({
      status: "error",
      message: "No token provided.",
    });
  });

  /* Trying to get Todos with an invalid JWT token */
  test("GET /todos - fail", async () => {
    const { body } = await request(app)
      .get("/todos")
      .set("Authorization", "Bearer " + "invalidtoken");

    expect(body).toEqual({
      status: "error",
      message: "Invalid token",
    });
  });
});