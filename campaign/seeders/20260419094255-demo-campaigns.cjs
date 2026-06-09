"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    // ✅ get one user
    const users = await queryInterface.sequelize.query(
      "SELECT id FROM users LIMIT 1;",
      { type: Sequelize.QueryTypes.SELECT }
    );

    if (!users.length) {
      console.log("No users found, skipping campaigns seed");
      return;
    }

    const userId = users[0].id;

    await queryInterface.bulkInsert("campaigns", [
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Summer Sale Campaign",
        description: "Campaign for summer promotions",
        status: "active",

        tags: ["summer", "sale"],
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        bounced: 0,
        unsubscribed: 0,
        totalRecipients: 0,

        subject: "Big Summer Sale!",
        senderName: "Marketing Team",
        senderEmail: "marketing@example.com",

        userId, // ✅ now valid

        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Welcome Campaign",
        description: "Onboarding new users",
        status: "draft",

        tags: ["welcome"],
        delivered: 0,
        opened: 0,
        clicked: 0,
        converted: 0,
        bounced: 0,
        unsubscribed: 0,
        totalRecipients: 0,

        subject: "Welcome!",
        senderName: "Support",
        senderEmail: "support@example.com",

        userId,

        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("campaigns", null, {});
  },
};