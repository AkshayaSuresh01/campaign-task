import { Request, Response } from "express";
import { Op } from "sequelize";
import { Campaign, User } from "../models";
import { CampaignStatus, ICampaignAttributes } from "../models";
import { CreateCampaignBody, UpdateCampaignBody } from "../types";
import {
  IdParam,
  PaginatedQuery,
  parsePagination,
  sendError,
  sendSuccess,
  catchError,
} from "./common";

type GetAllQuery = PaginatedQuery & {
  status?: CampaignStatus;
  userId?: string;
  search?: string;
};

const userInclude = {
  model: User,
  as: "user",
  attributes: ["id", "name", "email", "role", "avatarUrl"],
};

const computeMetrics = (c: ICampaignAttributes) => {
  const delivered = c.delivered ?? 0;
  const total = c.totalRecipients ?? 0;
  const safe = (n: number) =>
    delivered > 0 ? +((n / delivered) * 100).toFixed(1) : 0;

  return {
    deliveredRate: total > 0 ? +((delivered / total) * 100).toFixed(1) : 0,
    openRate: safe(c.opened ?? 0),
    clickRate: safe(c.clicked ?? 0),
    conversionRate: safe(c.converted ?? 0),
    bounceRate: safe(c.bounced ?? 0),
  };
};

export const getAll = async (
  req: Request<{}, {}, {}, GetAllQuery>,
  res: Response,
): Promise<void> => {
  try {
    const { page, limit, status, userId, search } = req.query;
    const { pageNum, limitNum, offset } = parsePagination(page, limit);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;
    if (search) where.name = { [Op.iLike]: `%${search}%` };

    const { count, rows } = await Campaign.findAndCountAll({
      where,
      include: [userInclude],
      limit: limitNum,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const data = rows.map((row) => {
      const campaign = row.toJSON() as ICampaignAttributes;
      return { ...campaign, metrics: computeMetrics(campaign) };
    });

    sendSuccess(res, data, 200, {
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    catchError(res, error);
  }
};

export const getCampaignById = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const campaign = await Campaign.findByPk(req.params.id, {
      include: [userInclude],
    });

    if (!campaign) {
      sendError(res, 404, "Campaign not found");
      return;
    }

    const data = campaign.toJSON() as ICampaignAttributes;
    sendSuccess(res, { ...data, metrics: computeMetrics(data) });
  } catch (error) {
    catchError(res, error);
  }
};

export const create = async (
  req: Request<{}, {}, CreateCampaignBody>,
  res: Response,
): Promise<void> => {
  console.log("coming hre");
  try {
    const campaign = await Campaign.create(req.body);
    sendSuccess(res, campaign.toJSON(), 201);
  } catch (error) {
    catchError(res, error);
  }
};

export const update = async (
  req: Request<IdParam, {}, UpdateCampaignBody>,
  res: Response,
): Promise<void> => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      sendError(res, 404, "Campaign not found");
      return;
    }

    await campaign.update(req.body);
    sendSuccess(res, campaign);
  } catch (error) {
    catchError(res, error);
  }
};

export const remove = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const campaign = await Campaign.findByPk(req.params.id);

    if (!campaign) {
      sendError(res, 404, "Campaign not found");
      return;
    }

    await campaign.destroy();
    sendSuccess(res, null, 200, { message: "Campaign deleted successfully" });
  } catch (error) {
    catchError(res, error);
  }
};
