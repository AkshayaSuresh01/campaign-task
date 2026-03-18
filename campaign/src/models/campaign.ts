const { DataTypes } = require("sequelize");
const sequelize = require("../config/database");

const Campaign = sequelize.define(
  "Campaign",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(255),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [1, 255],
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM("active", "completed", "draft", "paused"),
      defaultValue: "draft",
      allowNull: false,
    },
    tags: {
      type: DataTypes.ARRAY(DataTypes.STRING),
      defaultValue: [],
    },

    delivered: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    opened: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    clicked: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    converted: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    bounced: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    unsubscribed: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
    totalRecipients: {
      type: DataTypes.INTEGER,
      defaultValue: 0,
    },
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
      validate: {
        isEmail: true,
      },
    },
  },
  {
    tableName: "campaigns",
    timestamps: true,
    paranoid: false,
  },
);

export default Campaign;
