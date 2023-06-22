'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
   await queryInterface.createTable("descricao", {
    id: {
      type: Sequelize.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false,
    },
    descricao: {
      type: Sequelize.STRING,
    },
   });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable("descricao");
  },
};
