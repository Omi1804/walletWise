import express, { Response, Request, NextFunction } from "express";
import { Account, Users } from "../models";
import { z } from "zod";

export const GetUserBalance = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;

  if (!userId) {
    return res.status(404).json({ message: "UserId not found" });
  }

  try {
    const user = await Account.findOne({ userId });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json({ userId: userId, balance: user.balance });
  } catch (error: any) {
    return res.status(500).json({
      message: "An error occurred while fetching the user data",
      error: error.message,
    });
  }
};

const TransferInputCheck = z.object({
  to: z.string(),
  amount: z.number(),
});

export const UserTransfersMoney = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { to, amount } = req.body;
};
