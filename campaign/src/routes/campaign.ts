import express from "express";
import * as campaign from "../controllers/campaign";

const router = express.Router();

router.get("/", campaign.getAll);
router.post("/", campaign.create);
router.get("/:id", campaign.getCampaignById);
router.put("/:id", campaign.update);
router.delete("/:id", campaign.remove);

export default router;
