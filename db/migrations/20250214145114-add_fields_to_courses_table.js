'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courses', 'modalidad', {
      type: Sequelize.ENUM('PRESENCIAL', 'VIRTUAL', 'HÍBRIDO'),
      allowNull: false,
    });
    await queryInterface.addColumn('Courses', 'status', {
      type: Sequelize.ENUM('PENDIENTE', 'ACTIVO', 'FINALIZADO'),
      allowNull: false, 
    });
    await queryInterface.addColumn('Courses', 'isActive', {
      type: Sequelize.BOOLEAN,
      defaultValue: true,
      allowNull: false, 
    });
    await queryInterface.addColumn('Courses', 'category_id', {
      type: Sequelize.INTEGER,
      allowNull: true, 
      references: {
        model: 'Courses_Category', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', 
    });
    await queryInterface.addColumn('Courses', 'teacher_id', {
      type: Sequelize.INTEGER,
      allowNull: false, 
      references: {
        model: 'Teacher', 
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL', 
    });
    await queryInterface.addColumn('Courses', 'image_url', {
      type: Sequelize.STRING,
      allowNull: false, 
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courses', 'modalidad');
    await queryInterface.removeColumn('Courses', 'status');
    await queryInterface.removeColumn('Courses', 'isActive');
    await queryInterface.removeColumn('Courses', 'category_id');
    await queryInterface.removeColumn('Courses', 'teacher_id');
    await queryInterface.removeColumn('Courses', 'image_url');
  }
};