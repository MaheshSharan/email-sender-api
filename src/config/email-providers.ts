// src/config/email-providers.ts
export enum EmailProvider {
    SMTP = 'smtp',
    SENDGRID = 'sendgrid'
}

export const emailConfig = {
    defaultProvider: EmailProvider.SMTP,
    smtp: {
        host: process.env.SMTP_HOST,
        port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 587,
        secure: process.env.SMTP_SECURE === 'true',
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS
        }
    },
    sendgrid: {
        apiKey: process.env.SENDGRID_API_KEY
    }
};