import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import log4js from "log4js";
import { app } from "./";
import { User } from "./models/User";

const logger = log4js.getLogger(process.pid.toString());

export type Payload = {
    id: string;
};

enum ClientErrorMessage {
    INVALID_TOKEN = "INVALID_TOKEN",
    INVALID_USER = "INVALID_USER",
    TOKEN_EXPIRED = "TOKEN_EXPIRED",
}

enum ServerErrorMessage {
    USER_FIND_ERROR = "USER_FIND_ERROR",
    TOKEN_VERIFICATION_ERROR = "TOKEN_VERIFICATION_ERROR",
}

export const auth = async (request: Request, response: Response, next: NextFunction) => {
    const token = request.cookies.token;

    if (!token) {
        response.status(401).json({ message: ClientErrorMessage.INVALID_TOKEN });
        return;
    }

    try {
        const data = jwt.verify(token, process.env.API_SECRET);
        const { id } = data as Payload;
        try {
            const user: User = await User.findOne({ _id: id });
            if (!user) {
                response.status(403).json({ message: ClientErrorMessage.INVALID_USER });
                return;
            }
            app.locals.user = user;
            return next();
        } catch (error) {
            logger.error(error);
            response.status(500).json({ message: ServerErrorMessage.USER_FIND_ERROR });
            return;
        }
    } catch (error: unknown) {
        if (error instanceof jwt.JsonWebTokenError) {
            response.status(401).json({ message: ClientErrorMessage.INVALID_TOKEN });
            return;
        } else {
            logger.error(error);
            response.status(500).json({ message: ServerErrorMessage.TOKEN_VERIFICATION_ERROR });
            return;
        }
    }
};

export function generateJwt(user: User, expiresIn = 86400) {
    const payload: Payload = {
        id: user.id,
    };
    return jwt.sign(payload, process.env.API_SECRET, { expiresIn });
}
