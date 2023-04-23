import express from "express";
import fs from "node:fs";

const router = express.Router();

const bee = fs.readFileSync("src/public/bee", "utf8");

router.use("/api", require("./api/index"));

router.get("/bee", (_req, res) => {
    res.send(bee);
});

module.exports = router;
