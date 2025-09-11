import express from "express";

const router = express.Router();

export enum SuccessMessage {
    PONG = "PONG",
}

router.get("/", (_request, response) => {
    response.status(200).json({ message: SuccessMessage.PONG });
});

module.exports = router;
