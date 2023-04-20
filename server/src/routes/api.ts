import express, { Response } from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

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
    logger.error(err, new Error().stack);
    res.status(500).json({
        message: "Internal server error",
    });
}

module.exports = router;
