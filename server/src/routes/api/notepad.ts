import express from "express";
import log4js from "log4js";
import { app } from "../..";
import { auth } from "../../middleware";
import { Notepad } from "../../models/Notepad";
import { User } from "../../models/User";

const router = express.Router();
const logger = log4js.getLogger(process.pid.toString());

export enum SuccessMessage {
    NOTEPAD_CREATED = "NOTEPAD_CREATED",
    NOTEPAD_DELETED = "NOTEPAD_DELETED",
}

export enum ClientErrorMessage {
    INVALID_USER = "INVALID_USER",
    INVALID_NOTEPAD = "INVALID_NOTEPAD",
}

export enum ServerErrorMessage {
    NOTEPAD_ERROR = "NOTEPAD_ERROR",
    NOTEPAD_CREATION_ERROR = "NOTEPAD_CREATION_ERROR",
    NOTEPAD_DELETION_ERROR = "NOTEPAD_DELETION_ERROR",
    NOTEPAD_SAVE_ERROR = "NOTEPAD_SAVE_ERROR",
}

router.get("/", auth, async (_request, response) => {
    const user = app.locals.user as User;

    try {
        const notepads: Notepad[] = await Notepad.find({ owner: user._id }).sort({ modified: "descending" });
        response.status(200).json({ notepads });
    } catch (error) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.NOTEPAD_ERROR });
    }
});

router.get("/create", auth, (_request, response) => {
    const user = app.locals.user as User;

    const notepad = new Notepad({
        owner: user._id,
    });
    try {
        notepad.save();
        response.status(201).json({ message: SuccessMessage.NOTEPAD_CREATED });
    } catch (error) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.NOTEPAD_CREATION_ERROR });
    }
});

router.post("/delete", auth, async (request, response) => {
    const { id } = request.body;

    const user = app.locals.user as User;

    try {
        const notepad = await Notepad.findById({ _id: id });
        if (!notepad) {
            response.status(404).json({ message: ClientErrorMessage.INVALID_NOTEPAD });
        } else if (notepad?.owner._id.toString() !== user.id.toString()) {
            response.status(401).json({ message: ClientErrorMessage.INVALID_USER });
        } else {
            await Notepad.findByIdAndDelete(notepad.id).exec();
            response.status(200).json({ message: SuccessMessage.NOTEPAD_DELETED });
        }
    } catch (error) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.NOTEPAD_DELETION_ERROR });
    }
});

router.post("/edit", auth, async (request, response) => {
    const { id, title, content } = request.body;

    const user = app.locals.user as User;

    try {
        const notepad: Notepad = await Notepad.findById({ _id: id });
        if (!notepad) {
            response.status(404).json({ message: ClientErrorMessage.INVALID_NOTEPAD });
        } else if (notepad?.owner._id.toString() !== user.id.toString()) {
            response.status(401).json({ message: ClientErrorMessage.INVALID_USER });
        } else {
            notepad.title = title;
            notepad.content = content;
            notepad.modified = new Date();
            notepad.save();

            response.status(200).json({ modified: notepad.modified });
        }
    } catch (error) {
        logger.error(error);
        response.status(500).json({ message: ServerErrorMessage.NOTEPAD_SAVE_ERROR });
    }
});

module.exports = router;
