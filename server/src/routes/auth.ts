import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { verifyToken } from "../middleware";
import { User } from "../models/User";
const router = express.Router();

router.get("/", verifyToken, function (req, res) {
    const user = req.user as User;
    res.status(200).json({ email: user?.email });
});

router.get(
    "/google",
    passport.authenticate("google", {
        scope: ["profile", "email"],
    })
);

// redirect to home page after successful login
router.get("/google/redirect", passport.authenticate("google"), (req, res) => {
    const user = req.user as User;
    jwt.sign({ email: user.email }, process.env.API_SECRET, {
        expiresIn: "1h",
    });

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
