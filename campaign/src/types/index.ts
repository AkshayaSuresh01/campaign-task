export type CampaignStatus = "active" | "completed" | "draft" | "paused";
export type CampaignType = "email" | "sms" | "push" | "in-app";
export type TriggerType = "manual" | "scheduled" | "event" | "api";
export type UserRole = "admin" | "manager" | "viewer";
export type SortOrder = "ASC" | "DESC";

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
