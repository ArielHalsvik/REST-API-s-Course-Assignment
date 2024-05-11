var express = require("express");
var router = express.Router();
const jsend = require("jsend");
const isAuth = require("../middleware/middleware");
const db = require("../models");

const CategoryService = require("../services/CategoryService");
const categoryService = new CategoryService(db);

router.use(jsend.middleware);

/* Get all Categories for the Logged in User */
router.get("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Gets all categories for the logged in user.'
  // #swagger.responses = [200]

  const userId = req.user.id;

  try {
    const categories = await categoryService.getAllCategories(userId);
    return res.jsend.success({ statusCode: 200, result: categories });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not get categories" });
  }
});

/* Add a New Category for the Logged in User */
router.post("/", isAuth, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Creates a new category.'
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/Category"
    }
  }
  */
  // #swagger.responses = [200]
  const name = req.body.name;
  const userId = req.user.id;

  if (!name) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category name is required",
    });
  }

  try {
    const newCategory = await categoryService.createCategory(name, userId);
    return res.jsend.success({ statusCode: 200, result: newCategory });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not create category" });
  }
});

/* Change/Update a Specific Category for the Logged in User */
router.put("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Updates a specific category for the logged in user.'
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/Category"
    }
  }
  */
  // #swagger.responses = [200]
  const categoryId = req.params.id;
  const name = req.body.name;
  const userId = req.user.id;

  if (!name) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category name is required",
    });
  }

  const categoryExist = await categoryService.getOneCategory(
    categoryId,
    userId
  );
  if (!categoryExist) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category not found with this user",
    });
  }

  try {
    await categoryService.updateCategory(categoryId, name, userId);
    return res.jsend.success({
      statusCode: 200,
      result: "Category has been successfully updated",
    });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not update category" });
  }
});

/* Delete a Specific Category for the Logged in User */
router.delete("/:id", isAuth, async (req, res) => {
  // #swagger.tags = ['Categories']
  // #swagger.description = 'Deletes a specific category for the logged in user.'
  // #swagger.responses = [200]
  const categoryId = req.params.id;
  const userId = req.user.id;

  const categoryExist = await categoryService.getOneCategory(
    categoryId,
    userId
  );
  if (!categoryExist) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category not found with this user",
    });
  }

  const categoryInUse = await categoryService.isCategoryInUse(categoryId);
  if (categoryInUse) {
    return res.jsend.fail({
      statusCode: 400,
      result: "Category is in use and cannot be deleted",
    });
  }

  try {
    categoryService.deleteCategory(categoryId);
    return res.jsend.success({ statusCode: 200, result: "Category deleted" });
  } catch (error) {
    console.error(error);
    return res.jsend.error({ message: "Could not delete category" });
  }
});

module.exports = router;