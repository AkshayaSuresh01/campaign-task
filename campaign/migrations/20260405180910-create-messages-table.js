"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("messages", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      subject: {
        type: Sequelize.STRING(500),
        allowNull: true,
      },
      body: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      channel: {
        type: Sequelize.ENUM("email", "sms", "push", "in-app"),
        defaultValue: "email",
        allowNull: false,
      },
      direction: {
        type: Sequelize.ENUM("outbound", "inbound"),
        defaultValue: "outbound",
        allowNull: false,
      },
      status: {
        type: Sequelize.ENUM(
          "pending",
          "sent",
          "delivered",
          "failed",
          "bounced",
        ),
        defaultValue: "pending",
        allowNull: false,
      },
      recipientEmail: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      recipientName: {
        type: Sequelize.STRING(100),
        allowNull: true,
      },
      sentAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      deliveredAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      openedAt: {
        type: Sequelize.DATE,
        allowNull: true,
      },
      failureReason: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "campaigns", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      eventId: {
        type: Sequelize.UUID,
        allowNull: true,
        references: { model: "events", key: "id" },
        onDelete: "SET NULL",
        onUpdate: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("messages", ["campaignId"]);
    await queryInterface.addIndex("messages", ["eventId"]);
    await queryInterface.addIndex("messages", ["status"]);
    await queryInterface.addIndex("messages", ["channel"]);
    await queryInterface.addIndex("messages", ["campaignId", "status"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("messages");
  },
};
