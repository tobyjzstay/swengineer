import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Types } from "mongoose";
import { app } from ".";
import { User } from "./models/User";
import { internalServerError } from "./routes";

export const verifyToken = (req: Request, res: Response, next: () => void) => {
    const token = req.body.token || req.query.token || req.headers["x-access-token"] || req.cookies.token;

    if (token)
        jwt.verify(token, process.env.API_SECRET, (err: NodeJS.ErrnoException, decode: { id: Types.ObjectId }) => {
            if (!decode) {
                next();
                return;
            } else if (err) {
                internalServerError(res, err);
                return;
            } else {
                const { id } = decode;
                User.findOne({
                    _id: id,
                }).exec((err, user) => {
                    if (err) internalServerError(res, err);
                    else {
                        app.locals.user = user;
                        next();
                    }
                });
            }
        });
    else next();
};
