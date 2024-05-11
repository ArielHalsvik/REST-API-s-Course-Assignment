class CategoryService {
  constructor(db) {
    this.client = db.sequelize;
    this.Category = db.Category;
    this.db = db;
  }

  /* Finds all Categories */
  async getAllCategories(userId) {
    try {
      return await this.Category.findAll({
        where: { UserId: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Finds one Category */
  async getOneCategory(categoryId, userId) {
    try {
      return await this.Category.findOne({
        where: { id: categoryId, UserId: userId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Checks if a Category is in Use */
  async isCategoryInUse(categoryId) {
    try {
      const result = await this.db.sequelize.query(
        `SELECT COUNT(*) AS count
        FROM todos
        WHERE todos.CategoryId = ${categoryId}`
      );
      if (result[0][0].count > 0) {
        return true;
      }
      return false;
    } catch (error) {
      console.error(error);
    }
  }

  /* Creates a Category */
  async createCategory(name, userId) {
    try {
      return this.Category.create({
        name: name,
        UserId: userId,
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Changes a Category */
  async updateCategory(categoryId, name, userId) {
    try {
      return this.Category.update(
        { name: name },
        { where: { id: categoryId, UserId: userId } }
      );
    } catch (error) {
      console.error(error);
    }
  }

  /* Deletes a Category */
  async deleteCategory(categoryId) {
    try {
      return this.Category.destroy({
        where: { id: categoryId },
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = CategoryService;