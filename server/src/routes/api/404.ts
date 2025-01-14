import express from "express";
import log4js from "log4js";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

router.use((req, res) => {
    res.status(404).json({});
    logger.warn(`${req.method} ${res.statusCode} ${req.originalUrl}`);
});

module.exports = router;
