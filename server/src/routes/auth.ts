import express from "express";
import log4js from "log4js";
import passport from "passport";
import { app } from "..";
import { auth, generateJwt } from "../middleware";
import { User } from "../models/User";
import { sendMail } from "../nodemailer";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

export enum SuccessMessage {
    USER_DELETED = "USER_DELETED",
    LOGIN_SUCCESS = "LOGIN_SUCCESS",
    LOGOUT_SUCCESS = "LOGOUT_SUCCESS",
    RESET_EMAIL_SENT = "RESET_EMAIL_SENT",
    RESET_PASSWORD_SUCCESS = "RESET_PASSWORD_SUCCESS",
    VERIFICATION_EMAIL_SENT = "VERIFICATION_EMAIL_SENT",
    VERIFICATION_SUCCESS = "VERIFICATION_SUCCESS",
    VALID_TOKEN = "VALID_TOKEN",
}

export enum ClientErrorMessage {
    DUPLICATE_USER = "DUPLICATE_USER",
    INVALID_EMAIL = "INVALID_EMAIL",
    INVALID_PASSWORD = "INVALID_PASSWORD",
    INVALID_PASSWORD_LENGTH = "INVALID_PASSWORD_LENGTH",
    NO_PASSWORD = "NO_PASSWORD",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
    UNVERIFIED_EMAIL = "UNVERIFIED_EMAIL",
}

export enum ServerErrorMessage {
    REGISTER_ERROR = "REGISTER_ERROR",
    VERIFICATION_ERROR = "VERIFICATION_ERROR",
    LOGIN_ERROR = "LOGIN_ERROR",
    RESET_PASSWORD_ERROR = "RESET_PASSWORD_ERROR",
    RESET_PASSWORD_TOKEN_ERROR = "RESET_PASSWORD_TOKEN_ERROR",
    ACCOUNT_DELETION_ERROR = "ACCOUNT_DELETION_ERROR",
}

router.get("/", auth, (_request, response) => {
    const user = app.locals.user as User;

    const userData = {
        email: user.email,
    };

    response.status(200).json({ user: userData });
});

router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));

// redirect to home page after successful login
router.get("/google/redirect", passport.authenticate("google"), (request, response) => {
    const user = request.user as User;
    const redirect = app.locals.redirect;

    const token = generateJwt(user);

    // responding to client request success message and access token
    response.cookie("token", token).redirect(redirect || "/");
});

router.post("/register", async (request, response) => {
    const { email, password, verify } = request.body || {};

    if (!email) {
        response.status(400).json({ message: ClientErrorMessage.INVALID_EMAIL });
        return;
    } else if (!verify) {
        if (!password) {
            response.status(400).json({ message: ClientErrorMessage.INVALID_PASSWORD });
            return;
        } else if (password.length < 8) {
            response.status(400).json({ message: ClientErrorMessage.INVALID_PASSWORD_LENGTH });
            return;
        }
    }

    try {
        let user: User = await User.findOne({ email });

        if (user) {
            if (!verify) {
                response.status(409).json({ message: ClientErrorMessage.DUPLICATE_USER });
                return;
            }
        } else {
            user = new User({
                email,
                password,
            });
        }

        const verificationToken = user.generateVerificationToken();
        await user.save();

        sendMail({
            to: email,
            subject: "Email Verification",
            text:
                `Verify your email address to finish registering your swengineer account.\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${process.env.REACT_APP_BASE_URL}/${verificationToken}\n\n`,
        });

        response.status(201).json({ message: SuccessMessage.VERIFICATION_EMAIL_SENT });
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.REGISTER_ERROR });
    }
});

router.get("/register/:token", async (request, response, next) => {
    const token = request.params.token;

    try {
        const user: User = await User.findOne({ verificationToken: token });

        if (!user) return next();

        user.verified = true;
        await user.save();
        response.status(200).json({ message: SuccessMessage.VERIFICATION_SUCCESS });
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.VERIFICATION_ERROR });
    }
});

router.post("/login", async (request, response) => {
    const { email, password } = request.body || {};

    try {
        const user: User = await User.findOne({ email });

        if (!user) {
            response.status(404).json({ message: ClientErrorMessage.INVALID_EMAIL });
            return;
        } else if (!user.password) {
            response.status(403).json({ message: ClientErrorMessage.NO_PASSWORD });
            return;
        } else if (!(await user.comparePassword(password))) {
            response.status(401).json({ message: ClientErrorMessage.INVALID_PASSWORD });
            return;
        } else if (!user.verified) {
            response.status(403).json({ message: ClientErrorMessage.UNVERIFIED_EMAIL });
            return;
        }

        const token = generateJwt(user);
        response
            .cookie("token", token, {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
            })
            .status(200)
            .json({ message: SuccessMessage.LOGIN_SUCCESS });
        return;
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.LOGIN_ERROR });
    }
});

router.post("/logout", auth, async (_request, response) => {
    delete app.locals.user;
    response.clearCookie("token").status(200).json({ message: SuccessMessage.LOGOUT_SUCCESS });
});

router.post("/reset", async (request, response) => {
    const { email } = request.body || {};

    if (!email) {
        response.status(404).json({ message: ClientErrorMessage.INVALID_EMAIL });
        return;
    }

    try {
        const user: User = await User.findOne({ email });

        if (!user) {
            response.status(404).json({ message: ClientErrorMessage.INVALID_EMAIL });
            return;
        }

        const token = user.generateResetPasswordToken();
        await user.save();
        const ip = request.ip;

        sendMail({
            to: email,
            subject: "Password Reset",
            text:
                `You are receiving this because you (or someone else) have requested the reset of the password for your account.\n` +
                `Please click on the following link, or paste this into your browser to complete the process:\n\n` +
                `${process.env.REACT_APP_BASE_URL}/reset/${token}\n\n` +
                `If you did not request this, please ignore this email and your password will remain unchanged.\n\n` +
                `Email: ${email}\n` +
                `IP Address: ${ip}\n` +
                `Created: ${new Date().toString()}\n`,
        });

        response.status(200).json({ message: SuccessMessage.RESET_EMAIL_SENT });
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.RESET_PASSWORD_ERROR });
    }
});

router.get("/reset/:token", async (request, response, next) => {
    const token = request.params.token;

    try {
        const user: User = await User.findOne({ resetPasswordToken: token });

        if (!user) return next();
        else if (!user.verifyResetPasswordToken()) {
            response.status(410).json({ message: ClientErrorMessage.TOKEN_EXPIRED });
            return;
        }

        response.status(200).json({ message: SuccessMessage.VALID_TOKEN });
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.RESET_PASSWORD_TOKEN_ERROR });
    }
});

router.post("/reset/:token", async (request, response, next) => {
    const { password } = request.body || {};
    const token = request.params.token;

    try {
        const user: User = await User.findOne({ resetPasswordToken: token });

        if (!user) return next();
        else if (!user.verifyResetPasswordToken()) {
            response.status(410).json({ message: ClientErrorMessage.TOKEN_EXPIRED });
            return;
        } else if (!password) {
            response.status(400).json({ message: ClientErrorMessage.INVALID_PASSWORD });
            return;
        } else if (password.length < 8) {
            response.status(400).json({ message: ClientErrorMessage.INVALID_PASSWORD_LENGTH });
            return;
        }

        user.password = password;
        await user.save();
        response.status(200).json({ message: SuccessMessage.RESET_PASSWORD_SUCCESS });
    } catch (error: unknown) {
        response.status(500).json({ message: ServerErrorMessage.RESET_PASSWORD_TOKEN_ERROR });
    }
});

router.post("/delete", auth, async (_request, response) => {
    const user = app.locals.user as User;

    try {
        await User.findByIdAndDelete(user.id).exec();
        delete app.locals.user;
        response.clearCookie("token").status(200).json({ message: SuccessMessage.USER_DELETED });
    } catch (error: unknown) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.ACCOUNT_DELETION_ERROR });
    }
});

module.exports = {
    router,
    SuccessMessage,
    ClientErrorMessage,
};
