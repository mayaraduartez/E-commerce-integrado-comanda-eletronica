const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/conexao");

const Comanda = conexao.define(
    "Comanda", 
    {   
        quantidade: {
            type: DataTypes.INTEGER,
        },
        valordoitem: {
            type: DataTypes.FLOAT,
        },
    },
    {
        timestamps: false, //sequelize trabalha com timestamps 'não cria data de atualização'
        tableName: "comanda",
    }
);

module.exports = Comanda;