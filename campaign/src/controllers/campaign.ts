import { Request, Response } from "express";
import Campaign from "../models/campaign";

// get all campaigns
export const getAll = async (req: Request, res: Response): Promise<void> => {
  try {
    const campaigns = await Campaign.findAll();
    res.json(campaigns);
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// create campaign
export const create = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log("campaign came:", req.body);
    const newCampaign = await Campaign.create(req.body);
    res.status(201).json(newCampaign);
  } catch (error) {
    console.error("error:", error);
    res.status(500).json({ error: "Failed to create campaign" });
  }
};

// get campaign by id
export const getCampaignById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// update campaign
export const update = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    await campaign.update(req.body);

    res.json(campaign);
  } catch (error) {
    res.status(500).json({ error: "Failed to update campaign" });
  }
};

// delete campaign
export const remove = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findByPk(id);

    if (!campaign) {
      res.status(404).json({ error: "Campaign not found" });
      return;
    }

    await campaign.destroy();

    res.json({ message: "Campaign deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
};
