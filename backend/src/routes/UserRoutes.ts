import express from "express";
import {
  CreateUser,
  GetAllUsers,
  SearchForUsers,
  UpdateUser,
  UserLogin,
} from "../controllers";
import authenticateUser from "../middlewares/Auth";
import { Users } from "../models/User";
const router = express.Router();

//signup route
router.post("/signup", CreateUser);

//login route
router.post("/login", UserLogin);

//update user's information
router.put("/", authenticateUser, UpdateUser);

//get All users
router.get("/", authenticateUser, GetAllUsers);

//get users through searchbox (we need to match here the likely to be user search also)
router.get("/bulk", authenticateUser, SearchForUsers);

export { router as UserRouter };
