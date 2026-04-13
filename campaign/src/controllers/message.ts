import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { Campaign, Event } from "../models";
import { Message as MessageType } from "../models";
import {
  MessageQueryParams,
  CreateMessageBody,
  UpdateMessageBody,
} from "../types";

type IdParam = { id: string };
type CampaignParam = { campaignId: string };
type EventParam = { eventId: string };
type CreateReq = Request<{}, {}, CreateMessageBody>;
type UpdateReq = Request<IdParam, {}, UpdateMessageBody>;
type MessageUpdatePayload = {
  status?: string;
  sentAt?: Date;
  deliveredAt?: Date;
  openedAt?: Date;
  failureReason?: string;
  metadata?: Record<string, unknown>;
};

const messageIncludes = [
  {
    model: Campaign,
    as: "campaign",
    attributes: ["id", "name", "status"],
  },
  {
    model: Event,
    as: "event",
    attributes: ["id", "name", "occurredAt"],
    required: false,
  },
];
export const getMessages = async (
  req: Request<CampaignParam & EventParam, {}, {}, MessageQueryParams>,
  res: Response,
): Promise<void> => {
  try {
    const { status, channel, page = "1", limit = "20" } = req.query;

    const campaignId = req.params.campaignId || req.query.campaignId;
    const eventId = req.params.eventId || req.query.eventId;

    const where: Record<string, any> = {};
    if (campaignId) where.campaignId = campaignId;
    if (eventId) where.eventId = eventId;
    if (status) where.status = status;
    if (channel) where.channel = channel;

    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);

    const { count, rows } = await MessageType.findAndCountAll({
      where,
      order: [["createdAt", "DESC"]],
      limit: limitNum,
      offset: (pageNum - 1) * limitNum,
      include: messageIncludes,
    });

    res.json({
      success: true,
      data: rows.map((m: typeof MessageType) => m.toJSON()),
      pagination: {
        total: count,
        page: pageNum,
        limit: limitNum,
        totalPages: Math.ceil(count / limitNum),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
};

export const getMessageById = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const msg = await MessageType.findByPk(req.params.id, {
      include: messageIncludes,
    });
    if (!msg) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }
    res.json({ success: true, data: msg.toJSON() });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
};

export const createMessage = async (
  req: CreateReq,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const {
      subject,
      body,
      channel,
      direction,
      recipientEmail,
      recipientName,
      metadata,
      campaignId,
      eventId,
    } = req.body;

    const campaign = await Campaign.findByPk(campaignId);
    if (!campaign) {
      res.status(404).json({ success: false, message: "Campaign not found" });
      return;
    }

    if (eventId) {
      const event = await Event.findOne({ where: { id: eventId, campaignId } });
      if (!event) {
        res.status(404).json({
          success: false,
          message: "Event not found or does not belong to this campaign",
        });
        return;
      }
    }

    const msg = await MessageType.create({
      subject,
      body,
      channel: channel || (campaign.type as any),
      direction: direction || "outbound",
      status: "pending",
      recipientEmail,
      recipientName,
      metadata: metadata || {},
      campaignId,
      eventId,
    });

    await msg.reload({ include: messageIncludes });

    res.status(201).json({
      success: true,
      message: "Message created successfully",
      data: msg.toJSON(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
};

export const updateMessage = async (
  req: UpdateReq,
  res: Response,
): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({ success: false, errors: errors.array() });
    return;
  }

  try {
    const msg = await MessageType.findByPk(req.params.id);
    if (!msg) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }

    const { status, sentAt, deliveredAt, openedAt, failureReason, metadata } =
      req.body;

    const updates: MessageUpdatePayload = {};

    if (status !== undefined) {
      updates.status = status;
      if (status === "sent" && !msg.sentAt) updates.sentAt = new Date();
      if (status === "delivered" && !msg.deliveredAt)
        updates.deliveredAt = new Date();
    }
    if (sentAt !== undefined) updates.sentAt = new Date(sentAt);
    if (deliveredAt !== undefined) updates.deliveredAt = new Date(deliveredAt);
    if (openedAt !== undefined) updates.openedAt = new Date(openedAt);
    if (failureReason !== undefined)
      (updates as any).failureReason = failureReason;
    if (metadata !== undefined) (updates as any).metadata = metadata;

    await msg.update(updates);
    await msg.reload({ include: messageIncludes });

    res.json({
      success: true,
      message: "Message updated",
      data: msg.toJSON(),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
};

export const deleteMessage = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const msg = await MessageType.findByPk(req.params.id);
    if (!msg) {
      res.status(404).json({ success: false, message: "Message not found" });
      return;
    }
    await msg.destroy();
    res.json({ success: true, message: "Message deleted" });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    res.status(500).json({ success: false, message });
  }
};
