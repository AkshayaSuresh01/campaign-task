import { Request, Response } from "express";

export type IdParam = { id: string };
export type CampaignParam = { campaignId: string };
export type EventParam = { eventId: string };

export type PaginatedQuery = {
  page?: string;
  limit?: string;
};

export const parsePagination = (page: string = "1", limit: string = "20") => {
  const pageNum = Math.max(1, parseInt(page, 10) || 1);
  const limitNum = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
  const offset = (pageNum - 1) * limitNum;
  return { pageNum, limitNum, offset };
};

export const sendError = (
  res: Response,
  status: number,
  message: string,
): void => {
  res.status(status).json({ success: false, message });
};

export const sendSuccess = (
  res: Response,
  data: unknown,
  status: number = 200,
  extras?: Record<string, unknown>,
): void => {
  res.status(status).json({ success: true, data, ...extras });
};

export const catchError = (res: Response, error: unknown): void => {
  const message = error instanceof Error ? error.message : "Unknown error";
  res.status(500).json({ success: false, message });
};
