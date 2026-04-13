import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Event as CampaignEventModel, Campaign, Message } from "../models";
import type { CampaignEvent } from "../types";

import {
  EventQueryParams,
  CreateEventBody,
  EventType,
  EVENT_TYPES,
} from "../types";

type IdParam = { id: string };
type CampaignParam = { campaignId: string };
type CreateReq = Request<{}, {}, CreateEventBody>;

const isValidEventType = (type: string): type is EventType => {
  return Object.values(EVENT_TYPES).includes(type as EventType);
};

const parseNumber = (value: string | undefined, fallback: number) => {
  const num = Number(value);
  return Number.isNaN(num) ? fallback : num;
};

export const getEvents = async (
  req: Request<CampaignParam, {}, {}, EventQueryParams>,
  res: Response,
): Promise<void> => {
  try {
    const { type, page, limit } = req.query;
    const campaignId = req.params.campaignId || req.query.campaignId;

    const pageNum = parseNumber(page, 1);
    const limitNum = parseNumber(limit, 20);

    const where: Record<string, unknown> = {};

    if (campaignId) where.campaignId = campaignId;

    if (type) {
      if (!isValidEventType(type)) {
        res.status(400).json({ success: false, message: "Invalid event type" });
        return;
      }
      where.type = type;
    }

    const { count, rows } = await CampaignEventModel.findAndCountAll({
      where,
      order: [["occurredAt", "DESC"]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["id", "name", "status", "type"],
        },
        {
          model: Message,
          as: "messages",
          attributes: ["id", "status", "channel", "sentAt"],
          limit: 5,
        },
      ],
    });

    const data = rows.map((event: typeof CampaignEventModel) => {
      const json = event.toJSON() as CampaignEvent;

      return {
        ...json,
        messageCount: json.messages?.length ?? 0,
      };
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
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const getEventById = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const event = await CampaignEventModel.findByPk(req.params.id, {
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["id", "name", "status", "type", "userId"],
        },
        {
          model: Message,
          as: "messages",
          order: [["createdAt", "DESC"]],
        },
      ],
    });

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    res.json({
      success: true,
      data: event.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const createEvent = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const { type, name, description, metadata, occurredAt, campaignId } =
      req.body;

    if (!isValidEventType(type)) {
      res.status(400).json({ success: false, message: "Invalid event type" });
      return;
    }

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      res.status(404).json({ success: false, message: "Campaign not found" });
      return;
    }

    const event = await CampaignEventModel.create({
      type,
      name,
      description,
      metadata: metadata ?? {},
      occurredAt: occurredAt ? new Date(occurredAt) : new Date(),
      campaignId,
    });

    await event.reload({
      include: [
        {
          model: Campaign,
          as: "campaign",
          attributes: ["id", "name", "status", "type"],
        },
      ],
    });

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      data: event.toJSON(),
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};

export const deleteEvent = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const event = await CampaignEventModel.findByPk(req.params.id);

    if (!event) {
      res.status(404).json({ success: false, message: "Event not found" });
      return;
    }

    await event.destroy();

    res.json({
      success: true,
      message: "Event deleted",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Unknown error",
    });
  }
};
