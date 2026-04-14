import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Message = sequelize.define(
  "Message",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    subject: {
      type: DataTypes.STRING(500),
      allowNull: true,
    },

    body: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: { notEmpty: true },
    },

    channel: {
      type: DataTypes.ENUM("email", "sms", "push", "in-app"),
      defaultValue: "email",
      allowNull: false,
    },

    direction: {
      //same
      type: DataTypes.ENUM("outbound", "inbound"),
      defaultValue: "outbound",
      allowNull: false,
    },

    status: {
      //same
      type: DataTypes.ENUM("pending", "sent", "delivered", "failed", "bounced"),
      defaultValue: "pending",
      allowNull: false,
    },

    recipientEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },

    recipientName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },

    sentAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    deliveredAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    openedAt: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    failureReason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "campaigns", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },

    eventId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "events", key: "id" },
      onDelete: "SET NULL",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "messages",
    timestamps: true,
    indexes: [
      { fields: ["campaignId"] },
      { fields: ["eventId"] },
      { fields: ["status"] },
      { fields: ["channel"] },
      { fields: ["campaignId", "status"] },
    ],
  },
);

export default Message;
