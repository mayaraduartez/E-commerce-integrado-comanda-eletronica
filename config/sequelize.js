const Sequelize = require("sequelize");
const sequelizeconecta = new Sequelize(
  "db_development",
  "postgres",
  "postgres",
  {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
  }
);

module.exports = sequelizeconecta; //exporto