require("dotenv").config();
var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var swaggerUi = require("swagger-ui-express");
var swaggerJSON = require("./swagger_output.json");
var bodyParser = require("body-parser");

const StatusService = require("./services/StatusService");

var usersRouter = require("./routes/users");
var todosRouter = require("./routes/todos");
var categoriesRouter = require("./routes/categories");

var db = require("./models");
db.sequelize.sync({ force: false });

var app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use("/users", usersRouter);
app.use("/todos", todosRouter);
app.use("/categories", categoriesRouter);

app.use(bodyParser.json());
app.use("/doc", swaggerUi.serve, swaggerUi.setup(swaggerJSON));

// Populate Statuses in Database
async function populateStatuses() {
  try {
    await StatusService.insertStatuses();
  } catch (error) {
    console.error(error);
  }
}

// Check if Statuses are in Database
async function checkStatuses() {
  try {
    await db.sequelize.sync();

    let statuses = await db.sequelize.query(
      "SELECT COUNT(*) as total FROM statuses",
      {
        raw: true,
        type: db.sequelize.QueryTypes.SELECT,
      }
    );

    if (statuses[0].total == 0) {
      console.log("No statuses found. Inserting statuses...");
      await populateStatuses();
    } else {
      console.log("Statuses found.");
    }
  } catch (error) {
    console.error(error);
  }
}

checkStatuses();

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;