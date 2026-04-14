import { DataTypes } from "sequelize";
import sequelize from "../config/database";
import { EVENT_TYPES } from "../types";

const Event = sequelize.define(
  "Event",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },

    type: {
      type: DataTypes.ENUM(...Object.values(EVENT_TYPES)),
      allowNUll: true,
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
