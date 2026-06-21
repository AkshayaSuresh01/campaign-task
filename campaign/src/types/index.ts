export const TRIGGER_TYPE = {
  MANUAL: "manual",
  SCHEDULED: "scheduled",
  EVENT: "event",
  API: "api",
} as const;

export type TriggerType = (typeof TRIGGER_TYPE)[keyof typeof TRIGGER_TYPE];

export const SORT_ORDER = {
  ASC: "ASC",
  DESC: "DESC",
} as const;

export type SortOrder = (typeof SORT_ORDER)[keyof typeof SORT_ORDER];

export interface CampaignMetrics {
  deliveredRate: number;
  openRate: number;
  clickRate: number;
  conversionRate: number;
  bounceRate: number;
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ICampaign {
  id: string;
  name: string;
  description?: string;
  status: CampaignStatus;
  type: CampaignType;
  triggeredBy: TriggerType;
  tags: string[];
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  totalRecipients: number;
  delivered: number;
  opened: number;
  clicked: number;
  converted: number;
  bounced: number;
  unsubscribed: number;
  scheduledAt?: Date;
  startedAt?: Date;
  completedAt?: Date;
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CampaignQueryParams {
  status?: CampaignStatus;
  triggeredBy?: TriggerType;
  tags?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: SortOrder;
  page?: string;
  limit?: string;
  userId?: string;
}

export interface CreateCampaignBody {
  name: string;
  description?: string;
  type?: CampaignType;
  triggeredBy?: TriggerType;
  tags?: string[];
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  totalRecipients?: number;
  scheduledAt?: string;
  userId: string;
  status: CampaignStatus;
}

export interface UpdateCampaignBody {
  name?: string;
  description?: string;
  type?: CampaignType;
  triggeredBy?: TriggerType;
  status?: CampaignStatus;
  tags?: string[];
  subject?: string;
  senderName?: string;
  senderEmail?: string;
  totalRecipients?: number;
}

export interface CampaignStats {
  counts: {
    total: number;
    active: number;
    completed: number;
    draft: number;
  };
  aggregates: {
    delivered: number;
    opened: number;
    clicked: number;
    converted: number;
    totalRecipients: number;
    avgOpenRate: string;
    avgClickRate: string;
    avgConversionRate: string;
  };
}

export enum EventType {
  Delivered = "delivered",
  Opened = "opened",
  Clicked = "clicked",
  Converted = "converted",
  Bounced = "bounced",
  Unsubscribed = "unsubscribed",
}

export interface CreateEventBody {
  type: EventType;
  name: string;
  description?: string;
  metadata?: Record<string, unknown>;
  occurredAt?: string;
  campaignId: string;
}

export interface EventQueryParams {
  campaignId?: string;
  type?: EventType;
  startDate?: string;
  endDate?: string;
  page?: string;
  limit?: string;
}

export interface Message {
  id: string;
  subject?: string;
  body: string;
  channel: MessageChannel;
  direction: MessageDirection;
  status: MessageStatus;
  recipientEmail?: string;
  recipientName?: string;
  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  failureReason?: string;
  metadata: Record<string, unknown>;
  campaignId: string;
  eventId?: string;
  campaign?: ICampaign;
  event?: CampaignEvent;
  createdAt: string;
  updatedAt: string;
}

export interface MessageQueryParams {
  campaignId?: string;
  eventId?: string;

  status?: MessageStatus;
  channel?: MessageChannel;
  direction?: MessageDirection;

  search?: string;

  page?: string;
  limit?: string;
}

export interface CreateMessageBody {
  body: string;

  subject?: string;

  channel?: MessageChannel;
  direction?: MessageDirection;
  status?: MessageStatus;

  recipientEmail?: string;
  recipientName?: string;

  metadata?: Record<string, unknown>;

  campaignId: string;
  eventId?: string;

  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  failureReason?: string;
}

export interface UpdateMessageBody {
  subject?: string;
  body?: string;

  status?: MessageStatus;
  channel?: MessageChannel;
  direction?: MessageDirection;

  recipientEmail?: string;
  recipientName?: string;

  metadata?: Record<string, unknown>;

  sentAt?: string;
  deliveredAt?: string;
  openedAt?: string;
  failureReason?: string;

  eventId?: string;
}

export interface CampaignEvent {
  id: string;
  type: EventType;
  name: string;
  description?: string;
  metadata: Record<string, unknown>;
  occurredAt: string;
  campaignId: string;
  campaign?: ICampaign;
  messages?: Message[];
  messageCount?: number;
  createdAt: string;
  updatedAt: string;
}

export enum UserRole {
  Admin = "admin",
  Manager = "manager",
  Viewer = "viewer",
}

export enum CampaignStatus {
  Active = "active",
  Completed = "completed",
  Draft = "draft",
  Paused = "paused",
}

export enum CampaignType {
  Email = "email",
  SMS = "sms",
  Push = "push",
  InApp = "in-app",
}

export enum MessageChannel {
  Email = "email",
  SMS = "sms",
  Push = "push",
  InApp = "in-app",
}

export enum MessageDirection {
  Outbound = "outbound",
  Inbound = "inbound",
}

export enum MessageStatus {
  Pending = "pending",
  Sent = "sent",
  Delivered = "delivered",
  Failed = "failed",
  Bounced = "bounced",
}
