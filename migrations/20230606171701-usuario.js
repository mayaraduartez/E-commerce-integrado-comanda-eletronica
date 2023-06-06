"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("usuarios", {
      id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
      },
      token: {
        type: Sequelize.INTEGER,
        references: {
          model: "token",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      nome: Sequelize.STRING,
      email: { type: Sequelize.STRING, allowNull: false },
      senha: Sequelize.STRING,
      admin: { type: Sequelize.BOOLEAN, defaultValue: true }, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};
