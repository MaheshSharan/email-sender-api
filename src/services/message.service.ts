// src/services/message.service.ts
import { EmailService } from './email.service';
import { EmailMessage } from '../types';

export class MessageService {
    private emailService: EmailService;

    constructor() {
        this.emailService = new EmailService();
    }

    async sendMessage(message: EmailMessage): Promise<boolean> {
        // Log SMTP_USER to check if it's read correctly
        console.log("SMTP_USER from env:", process.env.SMTP_USER);

        // Explicitly set 'from' to SMTP_USER
        const fromEmail = process.env.SMTP_USER;
        if (!fromEmail) {
            console.error("Error: SMTP_USER environment variable is not set.");
            throw new Error("SMTP_USER is not set in environment variables.");
        }

        // Assign 'from' and log it
        message.from = fromEmail;
        console.log("Sending email with 'from' address set to:", message.from);

        const sent = await this.emailService.sendEmail(message);
        return sent;
    }

    private validateMessage(message: EmailMessage): boolean {
        return !!(
            message.to &&
            message.subject &&
            message.content &&
            this.isValidEmail(message.to)
        );
    }

    private isValidEmail(email: string): boolean {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }
}
