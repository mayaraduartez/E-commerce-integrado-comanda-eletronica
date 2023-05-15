const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); //importo sequelize.js

const Usuario = conexao.define(
  "Usuario",
  {
    nome: {
      type: DataTypes.STRING,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senha: {
      type: DataTypes.STRING,
    },
    admin:{
      type: DataTypes.BOOLEAN,
    }
  },
  {
    timestamps: false, //não cria o createdat e updatedat
    tableName: "usuarios", //nome da tabela que o usuario vai estar ligado
  }
);

module.exports = Usuario;
