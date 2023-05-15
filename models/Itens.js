const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/conexao");

const Itens = conexao.define(
    "Itens", 
    {   
        quantidade: {
            type: DataTypes.INTEGER,
        },
        valordoitem: {
            type: DataTypes.INTEGER,
        },
    },
    {
        timestamps: false, //sequelize trabalha com timestamps 'não cria data de atualização'
        tableName: "itens",
    }
);

module.exports = Itens;