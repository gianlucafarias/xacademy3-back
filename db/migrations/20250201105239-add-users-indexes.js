"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addIndex("Users", ["name"]);
    await queryInterface.addIndex("Users", ["lastname"]);
    await queryInterface.addIndex("Users", ["dni"]);
    await queryInterface.addIndex("Users", ["email"]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeIndex("Users", ["name"]);
    await queryInterface.removeIndex("Users", ["lastname"]);
    await queryInterface.removeIndex("Users", ["dni"]);
    await queryInterface.removeIndex("Users", ["email"]);
  }
};
