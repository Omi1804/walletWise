import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome To Account!");
});

export { router as AccountRouter };
