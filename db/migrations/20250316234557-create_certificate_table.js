'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('Certificate', 'status', {
      type:Sequelize.ENUM("PENDIENTE", "EMITIDO", "REVOCADO"),
      allowNull:false,
      defaultValue: "PENDIENTE"
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('Certificate','status');
  }
};
