import express from "express";
import authenticateUser from "../middlewares/Auth";
import { GetUserBalance, UserTransfersMoney } from "../controllers";
const router = express.Router();

//get user's balance
router.get("/balance", authenticateUser, GetUserBalance);

//user transfer money to another user
router.post("/transfer", authenticateUser, UserTransfersMoney);

export { router as AccountRouter };
