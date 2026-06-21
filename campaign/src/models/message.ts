import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { MessageChannel, MessageDirection, MessageStatus } from "../types";

export interface IMessageAttributes {
  id: string;
  subject?: string;
  body: string;
  channel: MessageChannel;
  direction: MessageDirection;
  status: MessageStatus;
  recipientEmail?: string;
  recipientName?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  failureReason?: string;
  metadata: Record<string, unknown>;
  campaignId: string;
  eventId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IMessageCreationAttributes extends Optional<
  IMessageAttributes,
  | "id"
  | "subject"
  | "recipientEmail"
  | "recipientName"
  | "sentAt"
  | "deliveredAt"
  | "openedAt"
  | "failureReason"
  | "metadata"
  | "eventId"
  | "createdAt"
  | "updatedAt"
> {}

class Message
  extends Model<IMessageAttributes, IMessageCreationAttributes>
  implements IMessageAttributes
{
  public id!: string;
  public subject?: string;
  public body!: string;
  public channel!: MessageChannel;
  public direction!: MessageDirection;
  public status!: MessageStatus;
  public recipientEmail?: string;
  public recipientName?: string;
  public sentAt?: Date;
  public deliveredAt?: Date;
  public openedAt?: Date;
  public failureReason?: string;
  public metadata!: Record<string, unknown>;
  public campaignId!: string;
  public eventId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Message.init(
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
      type: DataTypes.ENUM(...Object.values(MessageChannel)),
      defaultValue: MessageChannel.Email,
      allowNull: false,
    },
    direction: {
      type: DataTypes.ENUM(...Object.values(MessageDirection)),
      defaultValue: MessageDirection.Outbound,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(MessageStatus)),
      defaultValue: MessageStatus.Pending,
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
    sequelize,
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
