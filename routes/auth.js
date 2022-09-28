const express = require("express");
const verifyToken = require("../middleware");
const passport = require("passport");
const router = express.Router();

router.get("/", verifyToken, function (req, res) {
    res.status(200).json({ email: req.user?.email });
});

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    const user = req.user;
    res.send(user);
});

module.exports = router;
