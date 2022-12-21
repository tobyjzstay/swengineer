import mongoose from "mongoose";

export interface Notepad extends mongoose.Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    created: Date;
    modified: Date;
}

const notepadSchema = new mongoose.Schema({
    title: {
        type: String,
        trim: true,
    },
    content: {
        type: String,
    },
    owner: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    created: {
        type: Date,
        default: Date.now,
    },
    modified: {
        type: Date,
        default: Date.now,
    },
});

export const Notepad = mongoose.model<Notepad>("Notepad", notepadSchema);
