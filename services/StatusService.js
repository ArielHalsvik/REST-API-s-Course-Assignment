const { sequelize } = require("../models");

class StatusService {
  constructor(db) {
    this.client = db.sequelize;
    this.Status = db.Status;
  }

  /* Finds all Statuses */
  async getAllStatuses() {
    try {
      return await this.Status.findAll({
        where: {},
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Finds one Status */
  async getOneStatus(statusId) {
    try {
      return await this.Status.findOne({
        where: { id: statusId },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Inserts Statuses into the Database */
  static async insertStatuses() {
    try {
      const statusData = require("../data/status.json");
      for (const status of statusData) {
        const query = status.query;
        await sequelize.query(query, {
          typse: sequelize.QueryTypes.INSERT,
        });
      }
      console.log("Statuses inserted successfully");
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = StatusService;