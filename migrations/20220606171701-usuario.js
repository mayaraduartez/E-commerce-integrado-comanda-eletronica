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
      foto: Sequelize.STRING,
      nome: Sequelize.STRING,
      sobrenome: Sequelize.STRING,
      data_nascimento: Sequelize.DATEONLY,
      cpf: { type: Sequelize.STRING, unique:true },
      celular: Sequelize.STRING,
      email: { type: Sequelize.STRING, allowNull: false, unique:true },
      senha: Sequelize.STRING,
      admin: { type: Sequelize.BOOLEAN, defaultValue: false }, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("usuarios");
  },
};