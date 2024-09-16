import UserService from "../services/UserService";
import { Request, Response } from "express";
import { asyncHandler } from "../utils/AsyncHandler";

export const findUserByEmail = asyncHandler(async (req: Request, res: Response) => {
    const email = req.query.email as string;
    const user = await UserService.findUserByEmail(email);
    res.json(user);
    }
);
