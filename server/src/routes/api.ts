import express, { Response } from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger();

router.get("/ping", (_req, res) => {
    res.status(200).json({ message: "Pong!" });
});

router.use("/auth", require("./auth"));
router.use("/", require("./login")); // TODO: prefix
router.use("/notepad", require("./notepad"));

router.use((_req, res) => {
    res.status(404).json("Not found");
});

export function internalServerError(res: Response, err: NodeJS.ErrnoException) {
    res.status(500).json({
        message: "Internal server error",
    });
    logger.error(err, new Error().stack);
    return;
}

module.exports = router;
