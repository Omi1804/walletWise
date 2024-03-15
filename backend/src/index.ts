import express from "express";
import env from "dotenv";
env.config();
import { initDB } from "./services/Database";
import App from "./services/ExpressApp";
const PORT = process.env.PORT;

const startServer = async () => {
  const app = express();
  await initDB();
  await App(app);

  app.listen(PORT || 8080, () => {
    console.log("listening on port " + PORT);
  });
};

startServer();
