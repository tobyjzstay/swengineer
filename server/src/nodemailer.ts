import log4js from "log4js";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

const logger = log4js.getLogger(process.pid.toString());

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export async function sendMail(options: Options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { from, ...rest } = options;
    try {
        const info = await transporter.sendMail({
            from: process.env.GMAIL_SENDER,
            ...rest,
        });
        logger.info(info.messageId);
        return true;
    } catch (error) {
        logger.error(error);
    }
    return false;
}
