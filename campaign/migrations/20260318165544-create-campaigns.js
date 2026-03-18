"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("campaigns", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.literal("gen_random_uuid()"),
        primaryKey: true,
        allowNull: false,
      },
      name: { type: Sequelize.STRING(255), allowNull: false },
      description: { type: Sequelize.TEXT, allowNull: true },
      status: {
        type: Sequelize.ENUM("active", "completed", "draft", "paused"),
        defaultValue: "draft",
        allowNull: false,
      },
      tags: { type: Sequelize.ARRAY(Sequelize.STRING), defaultValue: [] },
      delivered: { type: Sequelize.INTEGER, defaultValue: 0 },
      opened: { type: Sequelize.INTEGER, defaultValue: 0 },
      clicked: { type: Sequelize.INTEGER, defaultValue: 0 },
      converted: { type: Sequelize.INTEGER, defaultValue: 0 },
      bounced: { type: Sequelize.INTEGER, defaultValue: 0 },
      unsubscribed: { type: Sequelize.INTEGER, defaultValue: 0 },
      totalRecipients: { type: Sequelize.INTEGER, defaultValue: 0 },
      subject: { type: Sequelize.STRING(255), allowNull: true },
      senderName: { type: Sequelize.STRING(100), allowNull: true },
      senderEmail: { type: Sequelize.STRING(255), allowNull: true },
      userId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "users", key: "id" },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });
  },

  async down(queryInterface) {
    await queryInterface.dropTable("campaigns");
  },
};
