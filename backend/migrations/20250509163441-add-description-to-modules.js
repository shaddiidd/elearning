'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Modules', 'description', {
      type: Sequelize.TEXT,
      allowNull: true,
      after: 'name'
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Modules', 'description');
  }
}; 