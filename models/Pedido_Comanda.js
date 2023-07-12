const { DataTypes, Sequelize } = require("sequelize");
const conexao = require("../config/conexao");

const Pedido_Comanda = conexao.define(
    "Pedido_Comanda", //não precisa dados de autoincremento: id
    {   
        datapedido: {
            type: DataTypes.DATEONLY,
        },
        situacao: {
            type: DataTypes.STRING,
        },
        pagamento:{
            type: DataTypes.STRING,
        },
        valortotal: {
            type: DataTypes.FLOAT,
        },
        mesa: {
            type: DataTypes.STRING,
        }
    },
    {
        timestamps: false, //sequelize trabalha com timestamps 'não cria data de atualização'
        tableName: "pedido_comanda",
    }
);

module.exports = Pedido_Comanda;