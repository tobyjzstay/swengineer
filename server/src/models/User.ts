import bcrypt from "bcryptjs";
import log4js from "log4js";
import mongoose from "mongoose";
import crypto from "node:crypto";

const logger = log4js.getLogger(process.pid.toString());

const TOKEN_SIZE = Number(process.env.TOKEN_SIZE) || 16;
const SALT_ROUNDS = Number(process.env.SALT_ROUNDS) || 10;

export interface User extends mongoose.Document {
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    verified: boolean;
    verificationToken: string | null;
    resetPasswordToken: string | null;
    resetPasswordExpires: Date;
    comparePassword(candidatePassword: string): Promise<boolean>;
    generateVerificationToken(): string;
    generateResetPasswordToken(): string;
    verifyResetPasswordToken(): boolean;
    toJSON(): object;
}

const userSchema = new mongoose.Schema(
    {
        email: {
            type: String,
            unique: true,
            index: true,
            lowercase: true,
            trim: true,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        verified: {
            type: Boolean,
            default: false,
        },
        verificationToken: {
            type: String,
            sparse: true,
            default: null,
        },
        resetPasswordToken: {
            type: String,
            sparse: true,
            default: null,
        },
        resetPasswordExpires: {
            type: Date,
            sparse: true,
            default: null,
        },
    },
    {
        timestamps: true,
    }
);

// hash password before saving
userSchema.pre("save", function (next) {
    if (!this.isModified("password")) return next();
    try {
        this.password = bcrypt.hashSync(this.password, SALT_ROUNDS);
        logger.debug(this.email + " password hashed");
        next();
    } catch (error) {
        next(error);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (!candidatePassword || !this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateVerificationToken = function (): string {
    const token = crypto.randomBytes(TOKEN_SIZE).toString("hex");
    this.verificationToken = token;
    logger.debug(this.email + " verification token generated");

    return token;
};

userSchema.methods.verifyResetPasswordToken = function (): boolean {
    return this.resetPasswordExpires.getTime() > new Date().getTime();
};

userSchema.methods.generateResetPasswordToken = function (): string {
    const token = crypto.randomBytes(TOKEN_SIZE).toString("hex");
    this.resetPasswordToken = token;
    logger.debug(this.email + " reset password token generated");

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);
    this.resetPasswordExpires = tokenExpiration;

    return token;
};

export const User = mongoose.model<User>("User", userSchema);
