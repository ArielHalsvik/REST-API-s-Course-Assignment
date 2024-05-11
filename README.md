# Course Assignment Information

This is a REST API Course Assignment I got in the second semester of my Backend development degree. The task was to create a REST API back-end application using Expressjs for a Todo application.

The *Initial Commit* is the original code I got for the assignment. The only code here that is mine is the .gitignore, which I added here to avoid package.json to be published.

The *Final Commit* is my finished code that I sent in for the assignment.

# Application Installation and Usage Instructions

1. **Clone the Repository:**
    ```bash
    git clone https://github.com/ArielHalsvik/REST-API-s-Course-Assignment
    ```

2. **Open the Terminal:**
    ```bash
    npm install
    ```

3. **Create an .env file:**
    - Create an .env file.
    - Paste in the text from *Environment Variables* down below.

4. **Create the Database:**
    - Open the mySQL application.
    - Paste the text below into mySQL and run it.

    ```bash
    CREATE DATABASE myTodo;
    ```

5. **Create a user:**
    - Paste the text from below into mySQL and run it.

    ```bash
    CREATE USER 'admin'@'localhost' IDENTIFIED WITH mysql_native_password BY 'P@ssw0rd';
    ```
    ```bash
    GRANT ALL PRIVILEGES ON myTodo.* TO 'admin'@'localhost';
    ```

6. **Open the terminal again:**
    ```bash
    npm start
    ```

7. **Open the Application and test it:**
    - Open a web browser.
    - Input this link: http://localhost:3000/doc to see Swagger documentation. You can test the endpoints here.
    - You can also use Postman to test the endpoints.

# Environment Variables

The following environment variables are required to run the application:

HOST = "localhost"<br>
ADMIN_USERNAME = "admin"<br>
ADMIN_PASSWORD = "P@ssw0rd"<br>
DATABASE_NAME = "myTodo"<br>
DIALECT = "mysql"<br>
PORT = "3000"<br>
TOKEN_SECRET = 1a54e4e2218691c9b067184d1c3a2fe32b0f12a6fb932850c37a9cda0accd4887b54ca96f9830c15e8d39d22b60412ea958d56e8821bae119fe76ad716725fa3<br>

# Additional Libraries/Packages

This program was made using Express.

Additional libraries/packages were used in this project.

**Express JS**
- https://expressjs.com/

**EJS**
- https://ejs.co/

**Dotenv**
- https://github.com/motdotla/dotenv

**MySQL**
- https://github.com/mysqljs/mysql

**MySQL2**
- https://github.com/sidorares/node-mysql2

**Sequelize**
- https://sequelize.org/

**Cookie Parser**
- https://github.com/expressjs/cookie-parser/tree/master

**Crypto**
- https://www.npmjs.com/package/crypto

**Jest**
- https://jestjs.io/

**Jsend**
- https://github.com/Prestaul/jsend#readme

**JSON Web Token**
- https://github.com/auth0/node-jsonwebtoken#readme

**SuperTest**
- https://github.com/ladjs/supertest#readme

**Swagger Autogen**
- https://swagger-autogen.github.io/docs/

**Swagger UI Express**
- https://github.com/scottie1984/swagger-ui-express

# NodeJS Version Used

NodeJS v20.10.0
