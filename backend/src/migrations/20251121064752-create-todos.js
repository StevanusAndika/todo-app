'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('todos', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      title: {
        type: Sequelize.STRING(255),
        allowNull: false
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true
      },
      completed: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      category_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
        references: {
          model: 'categories',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      },
      priority: {
        type: Sequelize.ENUM('low', 'medium', 'high'),
        defaultValue: 'medium'
      },
      due_date: {
        type: Sequelize.DATE,
        allowNull: true
      },
      created_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      updated_at: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      }
    });

    // Create indexes
    await queryInterface.addIndex('todos', ['title']);
    await queryInterface.addIndex('todos', ['completed']);
    await queryInterface.addIndex('todos', ['category_id']);
    await queryInterface.addIndex('todos', ['priority']);
    await queryInterface.addIndex('todos', ['created_at']);

    // Insert sample todos
    await queryInterface.bulkInsert('todos', [
      {
        title: 'Complete coding challenge',
        description: 'Build a full-stack todo application for Industrix',
        category_id: 1,
        priority: 'high',
        due_date: new Date('2024-08-03T23:59:59Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and fruits',
        category_id: 3,
        priority: 'medium',
        due_date: new Date('2024-08-02T18:00:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Morning workout',
        description: '30 minutes of cardio and strength training',
        category_id: 4,
        priority: 'medium',
        due_date: new Date('2024-08-01T07:00:00Z'),
        created_at: new Date(),
        updated_at: new Date()
      },
      {
        title: 'Read book',
        description: 'Finish reading React documentation',
        category_id: 2,
        priority: 'low',
        due_date: null,
        created_at: new Date(),
        updated_at: new Date()
      }
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('todos');
  }
};