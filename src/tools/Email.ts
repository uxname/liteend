import nodemailer, {Transporter} from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

export interface EmailConstructorParams {
    host: string;
    user: string;
    password: string;
}

export interface SendEmailParams {
    from: string;
    to: string;
    bcc: string | undefined;
    subject: string;
    text: string;
    html: string | undefined;
}

export class Email {
    private transporter: Transporter<SMTPTransport.SentMessageInfo>;

    constructor({host, user, password}: EmailConstructorParams) {
        this.transporter = nodemailer.createTransport({
            host,
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user,
                pass: password
            }
        });
    }

    async sendEmail({from, to, bcc, subject, text, html}: SendEmailParams): Promise<SMTPTransport.SentMessageInfo> {
        return this.transporter.sendMail({from, to, bcc, subject, text, html});
    }
}

