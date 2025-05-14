'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Files', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      name: Sequelize.STRING,
      moduleId: {
        type: Sequelize.UUID,
        references: {
          model: 'Modules',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      fileType: Sequelize.STRING,
      hasWork: Sequelize.BOOLEAN,
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },
  async down(queryInterface) {
    await queryInterface.dropTable('Files');
  },
};

