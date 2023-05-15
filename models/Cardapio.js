const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); //importo sequelize.js

const Cardapio = conexao.define(
  "Cardapio",
  {
    foto: {
        type: DataTypes.STRING,
      },
    titulo: {
      type: DataTypes.STRING,
    },
    descricao: {
      type: DataTypes.STRING,
    },
    valor: {
      type: DataTypes.FLOAT,
    },
    tipo: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false, //não cria o createdat e updatedat
    tableName: "cardapio", //nome da tabela que o usuario vai estar ligado
  }
);

module.exports = Cardapio;
