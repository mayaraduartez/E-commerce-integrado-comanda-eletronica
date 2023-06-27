'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("pedido_comanda", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    datapedido:{
      type: Sequelize.DATEONLY,
    },
    valortotal: {
      type: Sequelize.FLOAT,
    },
    situacao: {
      type: Sequelize.STRING,
    },
    mesa: {
      type: Sequelize.STRING,
    },
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("pedido_comanda");
  },
};
