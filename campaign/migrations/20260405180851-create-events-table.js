"use strict";
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("events", {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
      },
      type: {
        type: Sequelize.ENUM(
          "campaign_started",
          "campaign_panpx sequelize-cli db:migrateused",
          "campaign_completed",
          "email_sent",
          "email_opened",
          "email_clicked",
          "email_bounced",
          "user_converted",
          "user_unsubscribed",
          "custom",
        ),
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING(255),
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      metadata: {
        type: Sequelize.JSONB,
        defaultValue: {},
      },
      occurredAt: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      campaignId: {
        type: Sequelize.UUID,
        allowNull: false,
        references: { model: "campaigns", key: "id" },
        onDelete: "CASCADE",
        onUpdate: "CASCADE",
      },
      createdAt: { type: Sequelize.DATE, allowNull: false },
      updatedAt: { type: Sequelize.DATE, allowNull: false },
    });

    await queryInterface.addIndex("events", ["campaignId"]);
    await queryInterface.addIndex("events", ["type"]);
    await queryInterface.addIndex("events", ["occurredAt"]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("events");
  },
};
