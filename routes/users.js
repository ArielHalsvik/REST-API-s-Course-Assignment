var express = require("express");
var router = express.Router();
var jsend = require("jsend");
var jwt = require("jsonwebtoken");
var db = require("../models");
var UserService = require("../services/UserService");
var userService = new UserService(db);
var bodyParser = require("body-parser");
var jsonParser = bodyParser.json();
var crypto = require("crypto");

router.use(jsend.middleware);

// Post for registered users to be able to login
router.post("/login", jsonParser, async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Signs in a user with a correct email and password. Returns a token for the user to use for authentication. Paste this in the Authorization header to access other endpoints with this format: "Bearer: " + token.'
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/UserLogin"
    }
	}
  */
  // #swagger.responses = [200]
  const { email, password } = req.body;

  if (email == null) {
    return res.jsend.fail({ statusCode: 400, result: "Email is required" });
  }
  if (password == null) {
    return res.jsend.fail({ statusCode: 400, result: "Password is required" });
  }

  try {
    const user = await userService.getUser(email);

    if (!user) {
      return res.jsend.fail({ statusCode: 400, result: "User not found" });
    }

    crypto.pbkdf2(
      password,
      user.salt,
      310000,
      32,
      "sha256",
      async (error, encryptedPassword) => {
        if (error) {
          console.error(error);
          return jsend.error({ message: "Could not encrypt password" });
        }

        if (
          encryptedPassword.toString("hex") ===
          user.encryptedPassword.toString("hex")
        ) {
          let token;
          try {
            token = jwt.sign(
              { id: user.id, email: user.email },
              process.env.TOKEN_SECRET,
              { expiresIn: "1h" }
            );
          } catch (error) {
            res.jsend.error({ message: "Could not create token" });
          }

          res.jsend.success({
            statusCode: 200,
            result: "User logged in successfully",
            token: token,
          });
        } else {
          res.jsend.fail({ statusCode: 400, result: "Incorrect password" });
        }
      }
    );
  } catch (error) {
    console.log(error);
    return res.jsend.error({ message: "Could not log in user" });
  }
});

// Post for new users to register / signup
router.post("/signup", async (req, res, next) => {
  // #swagger.tags = ['Users']
  // #swagger.description = 'Creates a new user.'
  /* #swagger.parameters[body] = {
    "name": "body",
    "in": "body",
    "schema": {
      $ref: "#/definitions/UserSignup"
    }
	}
  */
  // #swagger.responses = [200]
  const { name, email, password } = req.body;

  if (name == null) {
    return res.jsend.fail({ statusCode: 400, result: "Name is required" });
  }

  if (email == null) {
    return res.jsend.fail({ statusCode: 400, result: "Email is required" });
  }
  if (password == null) {
    return res.jsend.fail({ statusCode: 400, result: "Password is required" });
  }

  const user = await userService.getUser(email);
  if (user) {
    return res.jsend.fail({ statusCode: 400, result: "Email already exists" });
  }

  const salt = crypto.randomBytes(16);
  crypto.pbkdf2(
    password,
    salt,
    310000,
    32,
    "sha256",
    async (error, encryptedPassword) => {
      if (error) {
        console.error(error);
        return jsend.error({ message: "Could not encrypt password" });
      }
      try {
        await userService.createUser(name, email, encryptedPassword, salt);
        return res.jsend.success({
          statusCode: 200,
          result: "User created successfully",
        });
      } catch {
        return res.jsend.error({ message: "Could not create user" });
      }
    }
  );
});

module.exports = router;