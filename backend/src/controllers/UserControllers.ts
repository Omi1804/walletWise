import { Request, Response, NextFunction } from "express";
import { z } from "zod";
import jwt from "jsonwebtoken";
const secret = process.env.SEC_KEY;
import { UserInput, UserLogInput, UserUpdateInput } from "../dto";
import { Account, Users } from "../models";

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

    await Account.create({
      userId: userId,
      balance: 1 + Math.random() * 1000,
    });

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

const UserUpdateInputCheck = z.object({
  name: z.string().optional(),
  password: z.string().min(3).max(20).optional(),
  phone: z.number().optional(),
});

export const UpdateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req;
  const { name, password, phone } = <UserUpdateInput>req.body;
  try {
    if (userId) {
      if (!userId) {
        return res.status(400).json({ message: "Error with userID" });
      }

      const userDetails = await Users.findOne({ _id: userId });

      if (!userDetails) {
        return res.status(404).json({ message: "User not found" });
      }

      try {
        UserUpdateInputCheck.parse({ name, password, phone });
      } catch (err: any) {
        return res.status(400).json({ message: err.errors });
      }

      if (name) userDetails.name = name;
      if (phone) userDetails.phone = phone;
      if (password) userDetails.password = password;

      await userDetails.save();

      return res.status(200).json({ message: "User updated successfully." });
    }
    return res.status(400).json({ message: "Error with userID" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const GetAllUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await Users.find().select("name id");
    return res.status(200).json({ message: allUsers });
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

export const SearchForUsers = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const filter = req.query.filter || "";

    const users = await Users.find({
      name: {
        $regex: filter,
        $options: "i",
      },
    }).select("name id email phone");

    res.status(200).json({ users });
  } catch (error) {
    console.error("Error searching for users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }

  // if my schema contains firstname and lastname then i use query
  /*
  const users = await User.find({
    $or: [
      {
        firstName: {
          $regex: filter,
        },
      },
      {
        lastName: {
          $regex: filter,
        },
      },
    ],
  });
  */
};
