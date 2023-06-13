'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("itens", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    PedidoId:{
      type: Sequelize.INTEGER,
      references: {
        model: "pedido", 
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
    await queryInterface.dropTable("itens");
  },
};