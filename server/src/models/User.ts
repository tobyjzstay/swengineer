import bcrypt from "bcryptjs";
import log4js from "log4js";
import mongoose from "mongoose";
import crypto from "node:crypto";

const logger = log4js.getLogger(process.pid.toString());

const cryptoSize = Number(process.env.CRYPTO_SIZE);
const saltRounds = Number(process.env.SALT_ROUNDS);

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
        this.password = bcrypt.hashSync(this.password, saltRounds);
        logger.debug(this.email + " password hashed");
        next();
    } catch (err) {
        next(err);
    }
});

userSchema.methods.comparePassword = async function (candidatePassword: string) {
    if (!candidatePassword || !this.password) return false;
    return bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.generateVerificationToken = function (): string {
    const token = crypto.randomBytes(cryptoSize).toString("hex");
    this.verificationToken = token;
    logger.debug(this.email + " verification token generated");

    return token;
};

userSchema.methods.verifyResetPasswordToken = function (): boolean {
    return this.resetPasswordExpires.getTime() > new Date().getTime();
};

userSchema.methods.generateResetPasswordToken = function (): string {
    const token = crypto.randomBytes(cryptoSize).toString("hex");
    this.resetPasswordToken = token;
    logger.debug(this.email + " reset password token generated");

    const tokenExpiration = new Date();
    tokenExpiration.setHours(tokenExpiration.getHours() + 1);
    this.resetPasswordExpires = tokenExpiration;

    return token;
};

// sanitize output
userSchema.methods.toJSON = function () {
    const object = this.toObject();
    delete object.password;
    delete object.verificationToken;
    delete object.resetPasswordToken;
    return object;
};

export const User = mongoose.model<User>("User", userSchema);
