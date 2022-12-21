import express from "express";
import { internalServerError } from ".";
import { app } from "..";
import { verifyToken } from "../middleware";
import { Notepad } from "../models/Notepad";
import { User } from "../models/User";

const router = express.Router();

router.get("/", verifyToken, (_req, res) => {
    const user = app.locals.user as User;

    if (!user) {
        internalServerError(res, new Error("User not found"));
        return;
    }

    Notepad.find({ owner: user._id })
        .sort({ modified: "descending" })
        .exec((err: NodeJS.ErrnoException, notepads: Notepad[]) => {
            if (err) {
                internalServerError(res, err);
                return;
            }

            res.status(200).json({ notepads });
        });
});

router.get("/create", verifyToken, (req, res) => {
    const user = app.locals.user as User;

    if (!user) {
        internalServerError(res, new Error("User not found"));
        return;
    }

    const notepad = new Notepad({
        owner: user._id,
    });
    notepad.save((err: NodeJS.ErrnoException) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else {
            res.status(201).json({
                message: "Notepad created successfully",
            });
        }
    });
});

router.post("/delete", verifyToken, (req, res) => {
    const { id } = req.body;

    const user = app.locals.user as User;

    if (!user) {
        internalServerError(res, new Error("User not found"));
        return;
    }

    Notepad.findById({ _id: id }, (err: NodeJS.ErrnoException, notepad: Notepad) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!notepad) {
            res.status(404).json({}); // TODO: Add error message
        } else if (notepad?.owner._id.toString() !== user.id.toString()) {
            res.status(401).json({}); // TODO: Add error message
        } else {
            notepad.remove();
            res.status(200).json({
                message: "Notepad deleted",
            });
        }
    });
});

router.post("/edit", verifyToken, (req, res) => {
    const { id, title, content } = req.body;

    const user = app.locals.user as User;

    if (!user) {
        internalServerError(res, new Error("User not found"));
        return;
    }

    Notepad.findById({ _id: id }, (err: NodeJS.ErrnoException, notepad: Notepad) => {
        if (err) {
            internalServerError(res, err);
            return;
        } else if (!notepad) {
            res.status(404).json({}); // TODO: Add error message
        } else if (notepad?.owner._id.toString() !== user.id.toString()) {
            res.status(401).json({}); // TODO: Add error message
        } else {
            notepad.title = title;
            notepad.content = content;
            notepad.modified = new Date();
            notepad.save();

            res.status(200).json({
                message: "Notepad changes saved",
                modified: notepad.modified,
            });
        }
    });
});

module.exports = router;
