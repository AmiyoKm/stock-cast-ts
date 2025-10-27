import nodemailer from 'nodemailer';
import { readFileSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
export class MailerService {
    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: parseInt(process.env.SMTP_PORT ?? '587', 10),
            auth: {
                user: process.env.SMTP_USERNAME,
                pass: process.env.SMTP_PASSWORD,
            },
        });
    }
    async send(user, templateFile, data) {
        const templateContent = readFileSync(path.resolve(__dirname, `../../../templates/${templateFile}`), 'utf-8');
        const subjectMatch = templateContent.match(/{{define "subject"}}\s*(.*?)\s*{{end}}/s);
        const plainBodyMatch = templateContent.match(/{{define "plainBody"}}\s*(.*?)\s*{{end}}/s);
        const htmlBodyMatch = templateContent.match(/{{define "htmlBody"}}\s*(.*?)\s*{{end}}/s);
        if (!subjectMatch || !plainBodyMatch || !htmlBodyMatch) {
            throw new Error(`Invalid template file: ${templateFile}. Missing subject, plainBody, or htmlBody definitions.`);
        }
        const subject = this.render(subjectMatch[1], data);
        const plainText = this.render(plainBodyMatch[1], data);
        const html = this.render(htmlBodyMatch[1], data);
        const msg = {
            to: user.email,
            from: process.env.SMTP_SENDER,
            subject,
            html,
            text: plainText,
        };
        await this.transporter.sendMail(msg);
    }
    render(template, data) {
        return template.replace(/{{.([a-zA-Z0-9_]+)}}/g, (match, key) => {
            return data[key] !== undefined ? data[key] : match;
        });
    }
}
