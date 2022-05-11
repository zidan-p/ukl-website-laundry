'use strict';
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tb_user', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nama: {
        type: Sequelize.STRING
      },
      username: {
        type: Sequelize.STRING
      },
      password: {
        type: Sequelize.TEXT
      },
      id_outlet: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: "tb_outlet",
          key: "id"
        }
      },
      role: {
        type: Sequelize.ENUM('admin', 'kasir', 'owner')
      }
    },{
      
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('tb_user');
  }
};