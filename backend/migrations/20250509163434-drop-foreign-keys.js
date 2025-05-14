'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    // This migration is only for dropping constraints
  },
  async down(queryInterface) {
    // This migration is only for dropping constraints
  },
  async beforeDown(queryInterface) {
    // Drop foreign key constraints
    await queryInterface.removeConstraint('CourseStudents', 'coursestudents_ibfk_1');
    await queryInterface.removeConstraint('CourseStudents', 'coursestudents_ibfk_2');
  }
}; 