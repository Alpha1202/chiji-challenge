module.exports = {
  up: (queryInterface, Sequelize) =>
    queryInterface.createTable('Users', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      firstName: {
        type: Sequelize.STRING,
        required: false,
      },
      lastName: {
        type: Sequelize.STRING,
        required: false,
      },
      userName: {
        type: Sequelize.STRING,
        required: true,
        unique: true,
      },
      email: {
        type: Sequelize.STRING,
        required: true,
        unique: true,
      },
      password: {
        type: Sequelize.STRING,
        required: true,
      },
      imageUrl: {
        type: Sequelize.STRING,
        required: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
    }),
  down: (queryInterface) => queryInterface.dropTable('Users'),
};