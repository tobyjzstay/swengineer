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

router.get("/gtm.js", proxyRequest("https://www.googletagmanager.com/gtag/js?id=" + process.env.REACT_APP_GTM_ID));

router.use("/auth", require("./auth").router);
router.use("/notepad", require("./notepad"));

router.use(require("./404"));

function proxyRequest(upstreamUrl: string) {
    return async (request: express.Request, response: Response) => {
        try {
            const upstreamResponse = await fetch(upstreamUrl);
            logger.debug(request.method + " " + upstreamResponse.status + " " + upstreamUrl);

            const body = await upstreamResponse.text();
            response.contentType(upstreamResponse.headers.get("content-type"));
            response.status(upstreamResponse.status).send(body);
        } catch (error) {
            internalServerError(response, new Error("Failed to fetch upstream URL at " + upstreamUrl));
        }
    };
}

export function internalServerError(response: Response, error: unknown) {
    logger.error(error, new Error().stack);
    response.status(500).json({ message: ServerErrorMessage.INTERNAL_SERVER_ERROR });
}

module.exports = router;
