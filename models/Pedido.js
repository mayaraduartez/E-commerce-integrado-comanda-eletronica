const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/conexao");

const Pedido = conexao.define(
    "Pedido", //não precisa dados de autoincremento: id
    {   
        datapedido: {
            type: DataTypes.DATEONLY,
        },
        situacao: {
            type: DataTypes.STRING,
        },
        valortotal: {
            type: DataTypes.FLOAT,
        },
    },
    {
        timestamps: false, //sequelize trabalha com timestamps 'não cria data de atualização'
        tableName: "pedido",
    }
);

module.exports = Pedido;