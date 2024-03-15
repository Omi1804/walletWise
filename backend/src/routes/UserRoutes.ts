import express from "express";
import { CreateUser, UserLogin } from "../controllers";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome Home!");
});

//signup route
router.post("/signup", CreateUser);

//login route
router.post("/login", UserLogin);

export { router as UserRouter };
