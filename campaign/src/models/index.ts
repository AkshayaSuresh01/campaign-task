import sequelize from "../config/database";

import User from "./User";
import Campaign from "../models/campaign";
import Event from "../models/events";
import Message from "../models/message";

User.hasMany(Campaign, { foreignKey: "userId", as: "campaigns" });
Campaign.belongsTo(User, { foreignKey: "userId", as: "user" });

Campaign.hasMany(Event, { foreignKey: "campaignId", as: "events" });
Event.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });

Campaign.hasMany(Message, { foreignKey: "campaignId", as: "messages" });
Message.belongsTo(Campaign, { foreignKey: "campaignId", as: "campaign" });

Event.hasMany(Message, { foreignKey: "eventId", as: "messages" });
Message.belongsTo(Event, {
  foreignKey: "eventId",
  as: "event",
  constraints: false,
});

export { sequelize, User, Campaign, Event, Message };
