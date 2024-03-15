import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
const secret = process.env.SEC_KEY;
import { Users } from "../models/User";
import { UserInput, UserLogInput } from "../dto";

const UserSignupInputCheck = z.object({
  email: z.string().email().max(20),
  password: z.string().min(3).max(20),
  name: z.string(),
  phone: z.number(),
});

export const CreateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = UserSignupInputCheck.safeParse(req.body);
  if (!success) {
    return res.status(411).json({ message: "Incorrect/Invalid User Details" });
  }

  const { email, password, name, phone } = <UserInput>req.body;

  try {
    const existingUser = await Users.findOne({
      email: email,
    });

    if (existingUser) {
      return res.json({ message: "User already exists" });
    }

    const createUser = await Users.create({ email, password, name, phone });

    const userId = createUser._id;

    return res.json({ message: "User created successfully" });
  } catch (err) {
    console.log(err);
    return res.json({ message: "Internal Server Error" });
  }
};

const UserLoginInputCheck = z.object({
  email: z.string().email().min(3),
  password: z.string().min(3).max(20),
});

export const UserLogin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { success } = UserLoginInputCheck.safeParse(req.body);
  if (!success) {
    return res.json({ message: "Invalid login credentials types!" });
  }
  const { email, password } = <UserLogInput>req.body;

  try {
    const existingUser = await Users.findOne({
      email: email,
      password: password,
    });

    if (!existingUser) {
      return res
        .status(404)
        .json({ message: "User not found or Invalid Credentials" });
    }

    const userId = existingUser._id;

    if (!secret) {
      return res.json({ message: "JWT secret required" });
    }
    const token = jwt.sign({ userId }, secret);

    return res
      .status(200)
      .json({ message: "User Logged in successfully!", token });
  } catch (err) {
    console.log(err);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
