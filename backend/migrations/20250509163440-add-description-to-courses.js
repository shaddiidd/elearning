'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Courses', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'name'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Courses', 'description');
  }
}; 