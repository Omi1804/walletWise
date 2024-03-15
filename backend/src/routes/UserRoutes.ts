import express from "express";
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Welcome Home!");
});

//signup route
router.post("/signup", async (req, res) => {});

export { router as UserRouter };
