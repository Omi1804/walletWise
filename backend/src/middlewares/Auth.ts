import jwt from "jsonwebtoken";
const secret = process.env.SEC_KEY;
import { Request, Response, NextFunction } from "express";

declare global {
  namespace Express {
    interface Request {
      userId?: string; // Declare userId property on Request object
    }
  }
}

const authenticateUser = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.header("Authorization");

  try {
    if (authHeader) {
      const token = authHeader.split(" ")[1];
      if (token && secret) {
        const payload = jwt.verify(token, secret) as { userId: string };
        console.log("from middleware : ", payload);

        req.userId = payload.userId;
        next();
      } else {
        return res
          .status(401)
          .json({ message: "Token or secret not defined." });
      }
    } else {
      return res.status(403).json({ message: "User not authenticated!" });
    }
  } catch (error) {
    console.error("Error in authentication middleware:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export default authenticateUser;
