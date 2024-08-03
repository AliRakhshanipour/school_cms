'use strict';

const { Sequelize } = require('sequelize');

module.exports = {
  /**
   * Apply the migration
   *
   * @param {QueryInterface} queryInterface - The interface to communicate with the database
   * @param {Sequelize} Sequelize - The Sequelize library
   */
  up: async (queryInterface, Sequelize) => {
    // Make teacherId, roomId, and classId columns nullable
    await queryInterface.changeColumn('sessions', 'teacherId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('sessions', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });

    await queryInterface.changeColumn('sessions', 'classId', {
      type: Sequelize.INTEGER,
      allowNull: true,
    });
  },

  /**
   * Revert the migration
   *
   * @param {QueryInterface} queryInterface - The interface to communicate with the database
   * @param {Sequelize} Sequelize - The Sequelize library
   */
  down: async (queryInterface, Sequelize) => {
    // Revert the changes: make teacherId, roomId, and classId columns non-nullable
    await queryInterface.changeColumn('sessions', 'teacherId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('sessions', 'roomId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.changeColumn('sessions', 'classId', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });
  },
};
