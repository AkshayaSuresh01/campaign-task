import sequelize from "../config/database";

import User from "./user";
import Campaign from "./campaign";
import Event from "./events";
import Message from "./message";

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

export type { IUserAttributes, IUserCreationAttributes } from "./user";
export type {
  ICampaignAttributes,
  ICampaignCreationAttributes,
} from "./campaign";
export type { IEventAttributes, IEventCreationAttributes } from "./events";
export type { IMessageAttributes, IMessageCreationAttributes } from "./message";
export * from "../types";
