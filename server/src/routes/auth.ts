import express from "express";
import jwt from "jsonwebtoken";
import passport from "passport";
import { app } from "..";
import { verifyToken } from "../middleware";
import { User } from "../models/User";

const router = express.Router();

router.get("/", verifyToken, (req, res) => {
    const user = app.locals.user as User;

    const userData = {
        id: user?._id,
        email: user?.email,
        created: user?.created,
    };

    res.status(200).json({ user: userData });
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

    const token = jwt.sign(
        {
            id: user.id,
        },
        process.env.API_SECRET,
        {
            expiresIn: 86400,
        }
    );

    // responding to client request success message and access token
    res.cookie("token", token).redirect("/");
});

module.exports = router;
