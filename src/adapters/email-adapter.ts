import nodemailer from "nodemailer"
import {settings} from "../settings/settings";
import {EmailForm} from "../models/email-models";

export const emailAdapter = {
    async sendEmail(form: EmailForm) {
        let transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: settings.EMAIL_LOGIN,
                pass: settings.EMAIL_PASSWORD,
            },
        })

        return await transporter.sendMail({
            from: form.from,
            to: form.to,
            subject: form.subject,
            html: form.html
        })
    }
}