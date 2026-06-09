"use strict";

module.exports = {
  async up(queryInterface, Sequelize) {
    const now = new Date();

    await queryInterface.bulkInsert("users", [
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Alice Johnson",
        email: "alice@example.com",
        role: "admin",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Bob Martinez",
        email: "bob@example.com",
        role: "manager",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Carol Lee",
        email: "carol@example.com",
        role: "viewer",
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "David Kim",
        email: "david@example.com",
        role: "manager",
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=david",
        createdAt: now,
        updatedAt: now,
      },
      {
        id: Sequelize.literal("gen_random_uuid()"),
        name: "Eva Patel",
        email: "eva@example.com",
        role: "viewer",
        avatarUrl: null,
        createdAt: now,
        updatedAt: now,
      },
    ]);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.bulkDelete("users", null, {});
  },
};