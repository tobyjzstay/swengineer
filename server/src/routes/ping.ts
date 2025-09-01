import express from "express";

const router = express.Router();

router.get("/", (_request, response) => {
    response.status(200).json({ message: "Pong!" });
});

module.exports = router;
