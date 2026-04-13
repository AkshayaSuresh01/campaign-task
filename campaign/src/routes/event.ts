import express from "express";
import * as events from "../controllers/event";
import * as messages from "../controllers/message";

const router = express.Router();

router.get("/", events.getEvents);
router.get("/:id", events.getEvents);
router.post("/", events.createEvent);
router.delete("/:id", events.deleteEvent);

router.get("/campaigns/:campaignId/events", events.getEvents);
router.post("/campaigns/:campaignId/events", events.createEvent);

router.get("/events/:eventId/messages", messages.getMessages);
router.post("/events/:eventId/messages", messages.createMessage);

export default router;
