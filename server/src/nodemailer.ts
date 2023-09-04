import log4js from "log4js";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

const logger = log4js.getLogger();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.GMAIL_EMAIL,
        pass: process.env.GMAIL_PASSWORD,
    },
});

export async function sendMail(options: Options) {
    const { from, ..._options } = options;
    try {
        const info = await transporter.sendMail({
            from: '"swengineer" <' + process.env.GMAIL_EMAIL + ">",
            ..._options,
        });
        logger.info(info.messageId);
        return true;
    } catch (error) {
        logger.error(error);
    }
    return false;
}
