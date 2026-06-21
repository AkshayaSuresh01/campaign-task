import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { EventType } from "../types";

export interface IEventAttributes {
  id: string;
  type?: EventType;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  occurredAt: Date;
  campaignId: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IEventCreationAttributes extends Optional<
  IEventAttributes,
  keyof Omit<IEventAttributes, "type" | "description">
> {}

class Event
  extends Model<IEventAttributes, IEventCreationAttributes>
  implements IEventAttributes
{
  public id!: string;
  public type?: EventType;
  public name!: string;
  public description?: string;
  public metadata!: Record<string, unknown>;
  public occurredAt!: Date;
  public campaignId!: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Event.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(EventType)),
      allowNull: true,
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
    sequelize,
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
