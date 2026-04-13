import express from "express";
import * as campaign from "../controllers/campaign";
import * as events from "../controllers/event";
import * as messages from "../controllers/message";

const router = express.Router();

router.get("/", campaign.getAll);
router.post("/", campaign.create);
router.get("/:id", campaign.getCampaignById);
router.put("/:id", campaign.update);
router.delete("/:id", campaign.remove);

router.get("/:campaignId/messages", messages.getMessages);
router.post("/:campaignId/messages", messages.createMessage);

router.get("/:campaignId/events", events.getEvents);
router.post("/:campaignId/events", events.createEvent);

export default router;
