import { DataTypes } from "sequelize";
import sequelize from "../config/database";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM(
        "campaign_started",
        "campaign_paused",
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
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true },
    },

    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    metadata: {
      type: DataTypes.JSONB,
      defaultValue: {},
    },

    occurredAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },

    campaignId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: "campaigns", key: "id" },
      onDelete: "CASCADE",
      onUpdate: "CASCADE",
    },
  },
  {
    tableName: "events",
    timestamps: true,
    indexes: [
      { fields: ["campaignId"] },
      { fields: ["type"] },
      { fields: ["occurredAt"] },
    ],
  },
);

export default Event;
