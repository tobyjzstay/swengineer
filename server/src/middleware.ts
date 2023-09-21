import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import log4js from "log4js";
import { app } from ".";
import { User } from "./models/User";

const logger = log4js.getLogger();

export const auth = (req: Request, res: Response, next: () => void) => {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({});

    try {
        const data = jwt.verify(token, process.env.API_SECRET);
        if (!data) return res.status(403).json({});
        const { id } = data as { id: string };
        User.findOne({
            _id: id,
        }).exec((err, user) => {
            if (err) {
                logger.error(err);
                return res.status(500).json({});
            }
            if (!user) return res.status(403).json({});
            app.locals.user = user;
            return next();
        });
    } catch (error: unknown) {
        logger.error(error);
        return res.status(403).json({});
    }
};
