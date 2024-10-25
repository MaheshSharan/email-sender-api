// src/services/email.service.ts
import nodemailer from 'nodemailer';
import { EmailMessage } from '../types';
import { emailConfig } from '../config/email-providers';

export class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        this.transporter = nodemailer.createTransport(emailConfig.smtp);
    }

    async sendEmail(message: EmailMessage): Promise<boolean> {
        try {
            // Log message to verify 'from' is populated
            console.log("Sending email with message:", message);

            await this.transporter.sendMail({
                from: message.from,  // Ensure 'from' is used as provided
                to: message.to,
                subject: message.subject,
                text: message.content,
                html: message.html || message.content
            });
            return true;
        } catch (error) {
            console.error('Email sending failed:', error);
            return false;
        }
    }
}
