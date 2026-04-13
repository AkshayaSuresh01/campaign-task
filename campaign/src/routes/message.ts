import express from "express";
import * as messages from "../controllers/message";

const router = express.Router();

router.get("/", messages.getMessages);
router.get("/:id", messages.getMessageById);
router.post("/", messages.createMessage);
router.patch("/:id", messages.updateMessage);
router.delete("/:id", messages.deleteMessage);

export default router;
