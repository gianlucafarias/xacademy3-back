'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Payment', 'status', {
      type: Sequelize.ENUM('PENDIENTE', 'PAGADO', 'ATRASADO'),
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Payment', 'status');
  }
};
