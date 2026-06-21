import { Request, Response } from "express";
import { User } from "../models";
import { IdParam, sendError, sendSuccess, catchError } from "./common";

const userAttributes = ["id", "name", "email", "role", "avatarUrl"] as const;

export const getAll = async (_req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.findAll({
      attributes: [...userAttributes],
      order: [["name", "ASC"]],
    });
    sendSuccess(res, users);
  } catch (error) {
    catchError(res, error);
  }
};

export const getUserById = async (
  req: Request<IdParam>,
  res: Response,
): Promise<void> => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: [...userAttributes],
    });

    if (!user) {
      sendError(res, 404, "User not found");
      return;
    }

    sendSuccess(res, user);
  } catch (error) {
    catchError(res, error);
  }
};
