import { Request, Response } from "express";
import { Campaign, User } from "../models";
import { CreateCampaignBody, UpdateCampaignBody } from "../types";

export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const {
      page = "1",
      limit = "10",
      status,
      userId,
      search,
    } = req.query as any;
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    const offset = (pageNum - 1) * limitNum;

    const where: any = {};
    if (status) where.status = status;
    if (userId) where.userId = userId;

    const { count, rows } = await Campaign.findAndCountAll({
      where,
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role", "avatarUrl"],
        },
      ],
      limit: limitNum,
      offset,
      order: [["createdAt", "DESC"]],
    });

    const data = rows.map((c: any) => {
      const campaign = c.toJSON();
      campaign.metrics = computeMetrics(campaign);
      return campaign;
    });

    res.json({
      success: true,
      data,
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const create = async (
  req: Request<{}, {}, CreateCampaignBody>,
  res: Response,
): Promise<void> => {
  try {
    const newCampaign = await Campaign.create(req.body as any);
    res.status(201).json({ success: true, data: newCampaign });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to create campaign" });
  }
};

export const getCampaignById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const campaign: any = await Campaign.findByPk(id, {
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name", "email", "role", "avatarUrl"],
        },
      ],
    });
    if (!campaign) {
      res.status(404).json({ success: false, message: "Campaign not found" });
      return;
    }
    const data = campaign.toJSON();
    data.metrics = computeMetrics(data);
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const update = async (
  req: Request<{ id: string }, {}, UpdateCampaignBody>,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      res.status(404).json({ success: false, message: "Campaign not found" });
      return;
    }
    await campaign.update(req.body);
    res.json({ success: true, data: campaign });
  } catch (error) {
    res
      .status(500)
      .json({ success: false, message: "Failed to update campaign" });
  }
};

export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  try {
    const campaign = await Campaign.findByPk(id);
    if (!campaign) {
      res.status(404).json({ success: false, message: "Campaign not found" });
      return;
    }
    await campaign.destroy();
    res.json({
      success: true,
      data: null,
      message: "Campaign deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

function computeMetrics(c: any) {
  const d = c.delivered || 0;
  const safe = (n: number) => (d > 0 ? +((n / d) * 100).toFixed(1) : 0);
  return {
    deliveredRate:
      c.totalRecipients > 0 ? +((d / c.totalRecipients) * 100).toFixed(1) : 0,
    openRate: safe(c.opened),
    clickRate: safe(c.clicked),
    conversionRate: safe(c.converted),
    bounceRate: safe(c.bounced),
  };
}
