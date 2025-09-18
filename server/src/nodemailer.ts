import log4js from "log4js";
import nodemailer from "nodemailer";
import { Options } from "nodemailer/lib/mailer";

const logger = log4js.getLogger(process.pid.toString());

const transporter = nodemailer.createTransport({
    auth: {
        user: process.env.SMTP_USERNAME,
        pass: process.env.SMTP_PASSWORD,
    },
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT),
});

export async function sendMail(options: Options) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { from, ...rest } = options;
    const info = await transporter.sendMail({
        from: process.env.SMTP_SENDER || from,
        ...rest,
    });

    if (process.env.NODE_ENV !== "production") {
        const url = nodemailer.getTestMessageUrl(info);
        logger.info(url);
    } else logger.info(info.messageId + " email sent to " + rest.to);
}
