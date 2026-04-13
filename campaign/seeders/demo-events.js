"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const campaigns = await queryInterface.sequelize.query(
      "SELECT id FROM campaigns LIMIT 3;",
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (!campaigns.length) {
      console.log("No campaigns found, skipping events seed");
      return;
    }

    const campaignId = campaigns[0].id;
    const now = new Date();

    await queryInterface.bulkInsert("events", [
      {
        id: Sequelize.literal("gen_random_uuid()"),
        type: "campaign_started",
        name: "Campaign Kickoff",
        description: "Initial campaign launch event",
        metadata: JSON.stringify({ triggeredBy: "admin" }),
        occurredAt: now,
        campaignId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        type: "email_sent",
        name: "Welcome Email Sent",
        description: "First batch of welcome emails sent",
        metadata: JSON.stringify({ batchSize: 100 }),
        occurredAt: now,
        campaignId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        type: "email_opened",
        name: "Email Opened",
        description: "User opened the welcome email",
        metadata: JSON.stringify({ openedBy: "user@example.com" }),
        occurredAt: now,
        campaignId,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("events", null, {});
  },
};
