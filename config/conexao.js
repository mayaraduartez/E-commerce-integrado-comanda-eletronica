const sequelize = require("sequelize");

const conexao = new sequelize(
  "novo_db_development",
  "postgres",
  "postgres",
  {
    host: "localhost",
    port: "5432",
    dialect: "postgres",
  }
);

module.exports = conexao;