var express = require("express");
var router = express.Router();
const jsend = require("jsend");
const isAuth = require("../middleware/middleware");
const db = require("../models");

const TodoService = require("../services/TodoService");
const todoService = new TodoService(db);
const StatusService = require("../services/StatusService");
const statusService = new StatusService(db);
const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);

router.use(jsend.middleware);

/* Return all the Logged in Users Todo's with the Category Associated with each Todo and
Status that is not the Deleted Status */
router.get("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Gets all todos except the deleted ones for the logged in user.'
  // #swagger.responses = [200]
  const userId = req.user.id;

  try {
    const todos = await todoService.getNonDeletedTodos(userId);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not get todos" });
  }
});

// Return all the Users Todos Including Todos with a Deleted Status
router.get("/all", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Gets all todos for the logged in user.'
  // #swagger.responses = [200]
  const userId = req.user.id;

  try {
    const todos = await todoService.getAllTodos(userId);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not get todos" });
  }
});

// Return all the todos with the deleted status
router.get("/deleted", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Gets all deleted todos for the logged in user.'
  // #swagger.responses = [200]
  const userId = req.user.id;

  try {
    const todos = await todoService.getDeletedTodos(userId);
    return res.jsend.success({ statusCode: 200, result: todos });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not get deleted todos" });
  }
});

// Add a New Todo with their Category for the Logged in User
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Creates a new todo.'
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/Todo"
    }
  }
  */
  // #swagger.responses = [200]
  const { name, description, categoryId } = req.body;
  const userId = req.user.id;
  let statusId = req.body.statusId ? req.body.statusId : 1;

  if (!name || !description || !categoryId) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Name, description and category are required",
    });
  }

  const category = await categoryService.getOneCategory(categoryId, userId);
  if (!category) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category does not exist",
    });
  }

  const status = await statusService.getOneStatus(statusId);
  if (!status) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Status does not exist",
    });
  }

  try {
    const newTodo = await todoService.createTodo(
      name,
      description,
      categoryId,
      statusId,
      userId
    );
    return res.jsend.success({ statusCode: 200, result: newTodo });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not create the todo item" });
  }
});

// Return all the Statuses from the Database
router.get("/statuses", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Gets all statuses.'
  // #swagger.responses = [200]
  try {
    const statuses = await statusService.getAllStatuses();
    return res.jsend.success({ statusCode: 200, result: statuses });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not get statuses" });
  }
});

// Change/Update a Specific Todo for Logged in User
router.put("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Changes a specific todo. You need at least one of the following fields: name, description, category, status.'.
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/Todo"
    }
  }
  */
  // #swagger.responses = [200]
  const todoId = req.params.id;
  const userId = req.user.id;
  const { name, description, categoryId, statusId } = req.body;

  if (!name && !description && !categoryId && !statusId) {
    return res.jsend.fail({
      statusCode: 400,
      result:
        "You need at least one of the following fields: name, description, category, status",
    });
  }

  const todoExist = await todoService.getOneTodo(todoId, userId);
  if (!todoExist) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Todo item not found with this user",
    });
  }

  if (categoryId) {
    const category = await categoryService.getOneCategory(categoryId, userId);
    if (!category) {
      return res.jsend.fail({
        statusCode: 400,
        result: "Category does not exist",
      });
    }
  }

  if (statusId) {
    const status = await statusService.getOneStatus(statusId);
    if (!status) {
      return res.jsend.fail({
        statusCode: 400,
        result: "Status does not exist",
      });
    }
  }

  try {
    const updateFields = {};
    if (name) updateFields.name = name;
    if (description) updateFields.description = description;
    if (categoryId) updateFields.CategoryId = categoryId;
    if (statusId) updateFields.StatusId = statusId;

    await todoService.updateTodo(todoId, updateFields, userId);
    return res.jsend.success({
      statusCode: 200,
      result: "Todo has been successfully updated",
    });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not update todo" });
  }
});

// Delete a Specific Todo if for the Logged in User
router.delete("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Todos']
  // #swagger.description = 'Deletes a specific todo.'
  // #swagger.responses = [200]
  const todoId = req.params.id;
  const userId = req.user.id;

  const todoExist = await todoService.getOneTodo(todoId, userId);
  if (!todoExist) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Todo item not found with this user",
    });
  }

  const isTodoDeleted = await todoService.isTodoDeleted(todoId, userId);
  if (isTodoDeleted) {
    console.log("Todo has already been deleted earlier");
    return res.jsend.fail({
      statusCode: 400,
      result: "Todo has already been deleted earlier",
    });
  }

  try {
    await todoService.deleteTodo(todoId, userId);
    return res.jsend.success({
      statusCode: 200,
      result: "Todo has been deleted",
    });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not delete todo" });
  }
});

module.exports = router;