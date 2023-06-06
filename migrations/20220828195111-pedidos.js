'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("pedido", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    datapedido:{
      type: Sequelize.DATEONLY,
    },
    UsuarioId: {
      type: Sequelize.INTEGER,
      references: {
        model: "usuarios",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "CASCADE",
    },
    valortotal: {
      type: Sequelize.FLOAT,
    },
    situacao: {
      type: Sequelize.STRING,
    }
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("pedido");
  },
};
