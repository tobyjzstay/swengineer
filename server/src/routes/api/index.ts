import express, { Response } from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

router.use("/auth", require("./auth").router);
router.use("/ping", require("./ping"));

router.use(require("./404"));

enum ServerErrorMessage {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

export function internalServerError(res: Response, error: unknown) {
    logger.error(error, new Error().stack);
    res.status(500).json({ message: ServerErrorMessage.INTERNAL_SERVER_ERROR });
}

module.exports = router;
