"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const campaigns = await queryInterface.sequelize.query(
      "SELECT id FROM campaigns LIMIT 1;",
      { type: Sequelize.QueryTypes.SELECT },
    );

    const events = await queryInterface.sequelize.query(
      "SELECT id FROM events LIMIT 1;",
      { type: Sequelize.QueryTypes.SELECT },
    );

    if (!campaigns.length) {
      console.log("No campaigns found, skipping messages seed");
      return;
    }

    const campaignId = campaigns[0].id;
    const eventId = events.length ? events[0].id : null;
    const now = new Date();

    await queryInterface.bulkInsert("messages", [
      {
        id: Sequelize.literal("gen_random_uuid()"),
        subject: "Welcome to our campaign!",
        body: "Hi there, welcome aboard. We are excited to have you.",
        channel: "email",
        direction: "outbound",
        status: "delivered",
        recipientEmail: "alice@example.com",
        recipientName: "Alice",
        sentAt: now,
        deliveredAt: now,
        openedAt: null,
        failureReason: null,
        metadata: JSON.stringify({}),
        campaignId,
        eventId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        subject: "Special offer just for you",
        body: "Check out this exclusive deal we have prepared for you.",
        channel: "email",
        direction: "outbound",
        status: "sent",
        recipientEmail: "bob@example.com",
        recipientName: "Bob",
        sentAt: now,
        deliveredAt: null,
        openedAt: null,
        failureReason: null,
        metadata: JSON.stringify({}),
        campaignId,
        eventId,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        subject: null,
        body: "Your order has been confirmed.",
        channel: "sms",
        direction: "outbound",
        status: "delivered",
        recipientEmail: null,
        recipientName: "Charlie",
        sentAt: now,
        deliveredAt: now,
        openedAt: null,
        failureReason: null,
        metadata: JSON.stringify({}),
        campaignId,
        eventId: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("messages", null, {});
  },
};
