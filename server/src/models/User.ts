import bcrypt from "bcryptjs";
import log4js from "log4js";
import mongoose from "mongoose";

const logger = log4js.getLogger(process.pid.toString());

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
            required: [true, "Email is required"],
            validate: {
                validator: function (v: string) {
                    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
                },
                message: "{VALUE} is not a valid email",
            },
        },
        password: {
            type: String,
            required: [true, "Password is required"],
            minlength: [8, "Password must be at least 8 characters long"],
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
    logger.debug("User " + this._id + "is being saved");
    if (!this.isModified("password")) return next();
    try {
        this.password = bcrypt.hashSync(this.password, saltRounds);
        next();
    } catch (err) {
        next(err);
    }
});

// compare password
userSchema.methods.comparePassword = async function (candidatePassword: string) {
    return bcrypt.compare(candidatePassword, this.password);
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
