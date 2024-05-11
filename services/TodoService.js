const { Op } = require("sequelize");

class TodoService {
  constructor(db) {
    this.client = db.sequelize;
    this.Todo = db.Todo;
    this.Status = db.Status;
    this.Category = db.Category;
  }

  /* Finds all Todos that's not Deleted */
  async getNonDeletedTodos(userId) {
    try {
      const todos = await this.Todo.findAll({
        where: {
          UserId: userId,
          StatusId: { [Op.ne]: 4 },
        },
        include: [
          {
            model: this.Category,
            attributes: ["name"],
            as: "Category",
          },
          {
            model: this.Status,
            attributes: ["status"],
            as: "Status",
          },
        ],
        attributes: ["id", "name", "description"],
      });
      return todos.map((todo) => ({
        Id: todo.id,
        Name: todo.name,
        Description: todo.description,
        Category: todo.Category.name,
        Status: todo.Status.status,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  /* Finds all Todos */
  async getAllTodos(userId) {
    try {
      const todos = await this.Todo.findAll({
        where: {
          UserId: userId,
        },
        include: [
          {
            model: this.Category,
            attributes: ["name"],
            as: "Category",
          },
          {
            model: this.Status,
            attributes: ["status"],
            as: "Status",
          },
        ],
        attributes: ["id", "name", "description"],
      });
      return todos.map((todo) => ({
        Id: todo.id,
        Name: todo.name,
        Description: todo.description,
        Category: todo.Category.name,
        Status: todo.Status.status,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  /* Finds all Deleted Todos */
  async getDeletedTodos(userId) {
    try {
      const todos = await this.Todo.findAll({
        where: {
          UserId: userId,
          StatusId: 4,
        },
        include: [
          {
            model: this.Category,
            attributes: ["name"],
            as: "Category",
          },
          {
            model: this.Status,
            attributes: ["status"],
            as: "Status",
          },
        ],
        attributes: ["id", "name", "description"],
      });
      return todos.map((todo) => ({
        Id: todo.id,
        Name: todo.name,
        Description: todo.description,
        Category: todo.Category.name,
        Status: todo.Status.status,
      }));
    } catch (error) {
      console.error(error);
    }
  }

  /* Finds one Todo */
  async getOneTodo(todoId, userId) {
    try {
      return await this.Todo.findOne({
        where: { id: todoId, UserId: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a new Todo */
  async createTodo(name, description, categoryId, statusId, userId) {
    try {
      return this.Todo.create({
        name: name,
        description: description,
        CategoryId: categoryId,
        StatusId: statusId,
        UserId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Changes a Todo */
  async updateTodo(todoId, updateFields, userId) {
    try {
      const options = {
        where: { id: todoId, UserId: userId },
      };
      return this.Todo.update(updateFields, options);
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Todo */
  async deleteTodo(todoId, userId) {
    try {
      await this.Todo.update(
        { StatusId: 4 },
        { where: { id: todoId, UserId: userId } }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }

  /* Checks if the Todo is Already Deleted */
  async isTodoDeleted(todoId, userId) {
    try {
      return await this.Todo.findOne({
        where: { id: todoId,  StatusId: 4, UserId: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = TodoService;