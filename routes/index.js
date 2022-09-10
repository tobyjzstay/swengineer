const express = require("express");
const verifyToken = require("../middleware");
const router = express.Router();

router.get("/ping", function (req, res) {
    res.sendStatus(200);
});

router.get("/auth", verifyToken, function (req, res) {
    res.status(200).json({ email: req.user?.email });
});

module.exports = router;
