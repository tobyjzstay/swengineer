import mongoose from "mongoose";

export interface User extends mongoose.Document {
    email: string;
    password: string;
    created: Date;
    verified: boolean;
    verificationToken: string;
    resetPasswordToken: string;
    resetPasswordExpires: Date;
}

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        unique: true,
        lowercase: true,
        trim: true,
        required: [true, "Email not provided"],
        validate: {
            validator: function (v: string) {
                return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
            },
            message: "{VALUE} is not a valid email",
        },
    },
    password: {
        type: String,
        required: true,
    },
    created: {
        type: Date,
        default: Date.now,
    },
    verified: {
        type: Boolean,
        default: false,
    },
    verificationToken: {
        type: String,
        sparse: true,
    },
    resetPasswordToken: {
        type: String,
        sparse: true,
    },
    resetPasswordExpires: { type: Date },
});

export const User = mongoose.model<User>("User", userSchema);
