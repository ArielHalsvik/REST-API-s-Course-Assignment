const swaggerAutogen = require("swagger-autogen")();

const doc = {
  info: {
    version: "1.0.0",
    title: "Todo API",
    description: "A simple Express API to manage todos",
  },
  host: "localhost:3000",
  definitions: {
    Category: {
      $name: "Shopping",
    },
    Status: {
      $status: "Not started",
    },
    UserLogin: {
      $email: "johnd0e@gmail.com",
      $password: "p4ssw0rd",
    },
    UserSignup: {
      $name: "John Doe",
      $email: "johnd0e@gmail.com",
      $password: "p4ssw0rd",
    },
    Todo: {
      $name: "Buy groceries",
      $description: "Buy milk, bread, and eggs",
      $categoryId: "1",
      $statusId: "1",
    },
  },
};

const outputFile = "./swagger_output.json";
const endpointsFiles = ["./app.js"];

swaggerAutogen(outputFile, endpointsFiles, doc).then(() => {
  require("./bin/www");
});