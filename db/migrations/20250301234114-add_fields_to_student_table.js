'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Student', 'studentCondition',{
      type: Sequelize.ENUM('EN_CURSO', 'APROBADO', 'DESAPROBADO'),
      allowNull:false,
    });
    await queryInterface.addColumn('Student', 'payment_status',{
      type: Sequelize.ENUM('PENDIENTE', 'PAGADO', 'ATRADADO'),
      allowNull:false,
    })
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Student', 'studentCondition');
    await queryInterface.removeColumn('Student', 'payment_status');
  }
  
};

