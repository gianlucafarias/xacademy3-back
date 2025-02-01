require("dotenv").config();

module.exports = {
  development: {
    username: process.env.DB_USERNAME || "",
    password: process.env.DB_PASSWORD || "",
    database: process.env.DB_DATABASE || "xacademydb",
    host: "localhost",
    dialect: "mysql"
  }
};
