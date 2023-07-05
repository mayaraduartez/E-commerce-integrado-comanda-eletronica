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
        metodo: {
            type: DataTypes.STRING,
            allowNull: false
        },
        pagamento: {
            type: DataTypes.STRING,
        },
        endereco: {
            type: DataTypes.JSON, // Ou outro tipo adequado para armazenar o objeto de endereço
            allowNull: true // Permitir que o endereço seja nulo caso o método seja "buscar"
        }
    },
    {
        timestamps: false, //sequelize trabalha com timestamps 'não cria data de atualização'
        tableName: "pedido",
    }
);

module.exports = Pedido;