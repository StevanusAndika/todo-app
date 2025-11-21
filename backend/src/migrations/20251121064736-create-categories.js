'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('categories', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        type: Sequelize.STRING(100),
        allowNull: false,
        unique: true
      },
      color: {
        type: Sequelize.STRING(7),
        defaultValue: '#3B82F6'
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Insert sample categories
    await queryInterface.bulkInsert('categories', [
      {
        name: 'Work',
        color: '#3B82F6',
        created_at: new Date()
      },
      {
        name: 'Personal',
        color: '#10B981',
        created_at: new Date()
      },
      {
        name: 'Shopping',
        color: '#F59E0B',
        created_at: new Date()
      },
      {
        name: 'Health',
        color: '#EF4444',
        created_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('categories');
  }
};