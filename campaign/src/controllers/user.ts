import { Request, Response } from "express";
import { User } from "../models";

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: ["id", "name", "email", "role", "avatarUrl"],
      order: [["name", "ASC"]],
    });
    res.json({ success: true, data: users });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};

export const getUserById = async (
  req: Request,
  res: Response,
): Promise<void> => {
  const { id } = req.params;
  try {
    const user = await User.findByPk(id, {
      attributes: ["id", "name", "email", "role", "avatarUrl"],
    });
    if (!user) {
      res.status(404).json({ success: false, message: "User not found" });
      return;
    }
    res.json({ success: true, data: user });
  } catch (error) {
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
};
