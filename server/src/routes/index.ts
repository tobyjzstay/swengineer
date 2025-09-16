import express, { Response } from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

enum SuccessMessage {
    PONG = "PONG",
}

enum ServerErrorMessage {
    INTERNAL_SERVER_ERROR = "INTERNAL_SERVER_ERROR",
}

router.get("/ping", (_request, response) => {
    response.status(200).json({ message: SuccessMessage.PONG });
});

router.use("/auth", require("./auth").router);
router.use("/notepad", require("./notepad"));

router.use(require("./404"));

export function internalServerError(response: Response, error: unknown) {
    logger.error(error, new Error().stack);
    response.status(500).json({ message: ServerErrorMessage.INTERNAL_SERVER_ERROR });
}

module.exports = router;
