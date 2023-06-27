'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("comanda", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    PedidoComandaId:{
      type: Sequelize.INTEGER,
      references: {
        model: "pedido_comanda", 
        key: "id",
      }
    },
    CardapioId:{
      type: Sequelize.INTEGER,
      references: {
        model: "cardapio", 
        key: "id",
      }
    },
    quantidade: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    valordoitem: {
      type: Sequelize.FLOAT,
    }
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("comanda");
  },
};