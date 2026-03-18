import sequelize from "../config/database";
import User from "./User";
import Campaign from "../models/campaign";

User.hasMany(Campaign, {
  foreignKey: "userId",
  as: "campaigns",
});

Campaign.belongsTo(User, {
  foreignKey: "userId",
  as: "user",
});

export { sequelize, User, Campaign };
