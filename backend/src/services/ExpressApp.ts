import { Application } from "express";
import bodyParser from "body-parser";
import { UserRouter, AccountRouter } from "../routes/";
import cors from "cors";

export default async (app: Application) => {
  app.use(cors());
  app.use(bodyParser.json());

  app.use("/api/v1/user", UserRouter);
  app.use("/api/v1/account", AccountRouter);

  return app;
};
