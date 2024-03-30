import express, { Response, Request, NextFunction } from "express";
import mongoose, { mongo } from "mongoose";
import { Account, Users } from "../models";
import { z } from "zod";
import { AccountInput } from "../dto";

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
  const { success } = TransferInputCheck.safeParse(req.body);
  if (!success) {
    return res
      .status(411)
      .json({ message: "Incorrect/Invalid Account Details" });
  }

  const session = mongoose.startSession();

  try {
    (await session).startTransaction();

    const { to, amount } = <AccountInput>req.body;
    const { userId } = req;

    if (amount <= 0) {
      throw new Error("Transfer amount must be greater than 0");
    }

    const userAccount = await Account.findOne({ userId: userId });

    if (!userAccount) {
      return res.json({ message: "Sender account not found" });
    }

    if (userAccount.balance <= amount) {
      return res.json({ message: "Account Balance too Low" });
    }

    const toAccount = await Account.findOne({ userId: to });

    if (!toAccount) {
      return res.json({ message: "Receiver account not found" });
    }

    await Account.updateOne(
      {
        userId: userId,
      },
      {
        $inc: {
          balance: -amount,
        },
      }
    );

    await Account.updateOne(
      {
        userId: to,
      },
      {
        $inc: {
          balance: amount,
        },
      }
    );

    (await session).commitTransaction();
    return res.json({ message: "Money transfered successfully" });
  } catch (error: any) {
    (await session).abortTransaction();
    res.status(500).json({ message: error.message });
  } finally {
    (await session).endSession();
  }
};
