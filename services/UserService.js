class UserService {
  constructor(db) {
    this.client = db.sequelize;
    this.User = db.User;
  }

  /* Find a user by email */
  async getUser(email) {
    try {
      return await this.User.findOne({
        where: { email: email },
      });
    } catch (error) {
      console.error(error);
    }
  }

  /* Create a new user */
  async createUser(name, email, encryptedPassword, salt) {
    try {
      return this.User.create({
        name: name,
        email: email,
        encryptedPassword: encryptedPassword,
        salt: salt,
      });
    } catch (error) {
      console.error(error);
    }
  }
}

module.exports = UserService;