import { DataTypes, Model, Optional } from "sequelize";
import sequelize from "../config/database";
import { CampaignStatus, CampaignType } from "../types";

export interface ICampaignAttributes {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  type: CampaignType;
  tags: string[];
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  unsubscribed: number;
  totalRecipients: number;
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  userId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ICampaignCreationAttributes extends Optional<
  ICampaignAttributes,
  keyof Omit<ICampaignAttributes, "name" | "status">
> {}

class Campaign
  extends Model<ICampaignAttributes, ICampaignCreationAttributes>
  implements ICampaignAttributes
{
  public id!: string;
  public name!: string;
  public description?: string;
  public status!: CampaignStatus;
  public type!: CampaignType;
  public tags!: string[];
  public delivered!: number;
  public opened!: number;
  public clicked!: number;
  public converted!: number;
  public bounced!: number;
  public unsubscribed!: number;
  public totalRecipients!: number;
  public subject?: string;
  public senderName?: string;
  public senderEmail?: string;
  public userId?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

Campaign.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: { notEmpty: true, len: [1, 255] },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM(...Object.values(CampaignStatus)),
      defaultValue: CampaignStatus.Draft,
      allowNull: false,
    },
    type: {
      type: DataTypes.ENUM(...Object.values(CampaignType)),
      allowNull: false,
      defaultValue: CampaignType.Email,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },
    delivered: { type: DataTypes.INTEGER, defaultValue: 0 },
    opened: { type: DataTypes.INTEGER, defaultValue: 0 },
    clicked: { type: DataTypes.INTEGER, defaultValue: 0 },
    converted: { type: DataTypes.INTEGER, defaultValue: 0 },
    bounced: { type: DataTypes.INTEGER, defaultValue: 0 },
    unsubscribed: { type: DataTypes.INTEGER, defaultValue: 0 },
    totalRecipients: { type: DataTypes.INTEGER, defaultValue: 0 },
    subject: {
      type: DataTypes.STRING(255),
      allowNull: true,
    },
    senderName: {
      type: DataTypes.STRING(100),
      allowNull: true,
    },
    senderEmail: {
      type: DataTypes.STRING(255),
      allowNull: true,
      validate: { isEmail: true },
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: true,
      references: { model: "users", key: "id" },
    },
  },
  {
    sequelize,
    tableName: "campaigns",
    timestamps: true,
    paranoid: false,
  },
);

export default Campaign;
