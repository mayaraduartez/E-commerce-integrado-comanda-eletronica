const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); 

const Descricao = conexao.define(
  "Descricao",
  {

    descricao: {
        type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, 
    tableName: "descricao", 
  }
);

module.exports = Descricao;
