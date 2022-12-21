import express, { Response } from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger();

router.get("/ping", (_req, res) => {
    res.sendStatus(200);
});

router.use("/auth", require("./auth"));
router.use("/", require("./login")); // TODO: prefix

export function internalServerError(res: Response, err: NodeJS.ErrnoException) {
    res.status(500).json({
        message: "Internal server error",
    });
    logger.error(err, new Error().stack);
    return;
}

module.exports = router;
