const express = require("express");
const verifyToken = require("../middleware");
const passport = require("passport");
const jwt = require("jsonwebtoken");
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

// redirect to home page after successful login
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    jwt.sign({ email: req.user.email }, process.env.API_SECRET, {
        expiresIn: "1h",
    });

    const user = req.user;

    var token = jwt.sign(
        {
            id: user.id,
        },
        process.env.API_SECRET,
        {
            expiresIn: 86400,
        }
    );

    // responding to client request success message and access token
    res.cookie("token", token).status(200).send({
        message: "Login successful",
    });
});

module.exports = router;
