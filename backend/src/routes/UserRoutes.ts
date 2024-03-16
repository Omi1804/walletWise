import express from "express";
import { CreateUser, UpdateUser, UserLogin } from "../controllers";
import authenticateUser from "../middlewares/Auth";
import { Users } from "../models/User";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome Home!");
});

//signup route
router.post("/signup", CreateUser);

//login route
router.post("/login", UserLogin);

//update user's information
router.put("/", authenticateUser, UpdateUser);

export { router as UserRouter };
