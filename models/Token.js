const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); 

const Token = conexao.define(
  "Token",
  {
    token: {
      type: DataTypes.STRING,
    },
    dataexpiracao: {
        type: DataTypes.DATE,
    },
  },
  {
    timestamps: false, 
    tableName: "token", 
  }
);

module.exports = Token;
