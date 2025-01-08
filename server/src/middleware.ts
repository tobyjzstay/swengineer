import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import log4js from "log4js";
import { app } from ".";
import { User } from "./models/User";

const logger = log4js.getLogger(process.pid.toString());

export const auth = async (req: Request, res: Response, next: NextFunction) => {
    const token = req.cookies.token;

    if (!token) {
        res.status(401).json({});
        return;
    }

    try {
        const data = jwt.verify(token, process.env.API_SECRET);
        if (!data) {
            res.status(403).json({});
            return;
        }
        const { id } = data as { id: string };
        try {
            const user = await User.findOne({
                _id: id,
            });
            if (!user) {
                res.status(403).json({});
                return;
            }
            app.locals.user = user;
            return next();
        } catch (err) {
            logger.error(err);
            res.status(500).json({});
            return;
        }
    } catch (error: unknown) {
        if (error instanceof jwt.JsonWebTokenError) {
            res.status(401).json({
                message: error.message,
            });
            return;
        } else if (error instanceof jwt.TokenExpiredError) {
            res.status(401).json({
                message: error.message,
            });
            return;
        } else if (error instanceof jwt.NotBeforeError) {
            res.status(401).json({
                message: error.message,
            });
            return;
        } else {
            logger.error(error);
            res.status(403).json({});
            return;
        }
    }
};
