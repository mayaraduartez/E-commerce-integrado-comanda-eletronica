const { DataTypes } = require("sequelize");
const conexao = require("../config/sequelize"); //importo sequelize.js

const Avaliacao = conexao.define(
  "Avaliacao",
  {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      UsuarioId: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      estrelas: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      comentario: {
        type: DataTypes.STRING,
        allowNull: true,
      },
  },
  {
    timestamps: false, //não cria o createdat e updatedat
    tableName: "avaliacoes", //nome da tabela que o usuario vai estar ligado
  }
);

module.exports = Avaliacao;
