import express from "express";
import * as user from "../controllers/user";

const router = express.Router();

router.get("/", user.getAll);
router.get("/:id", user.getUserById);

export default router;
