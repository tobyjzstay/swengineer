import express from "express";
import fs from "node:fs";

const router = express.Router();

const bee = fs.readFileSync("src/public/bee", "utf8");

router.get("/bee", (_req, res) => {
    res.type("text/plain");
    res.send(bee);
});

module.exports = router;
