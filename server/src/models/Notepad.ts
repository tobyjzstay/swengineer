import mongoose from "mongoose";

export interface Notepad extends mongoose.Document {
    title: string;
    content: string;
    owner: mongoose.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}

const notepadSchema = new mongoose.Schema(
    {
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
    },
    {
        timestamps: true,
    }
);

export const Notepad = mongoose.model<Notepad>("Notepad", notepadSchema);
