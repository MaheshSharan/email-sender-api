// src/routes/api.routes.ts
import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth.service';
import { MessageService } from '../services/message.service';
import { ApiResponse, ApiKey, EmailMessage } from '../types';
import { apiKeyMiddleware } from '../middleware/api-key.middleware';

const router = Router();
const authService = new AuthService();
const messageService = new MessageService();

// Generate API Key route
router.post('/auth/keys', async (req: Request, res: Response): Promise<void> => {
    try {
        const { companyId } = req.body;

        if (!companyId) {
            console.log('Company ID missing from request body');
            res.status(400).json({
                success: false,
                error: 'Company ID is required',
                message: 'Please provide a company ID in the request body'
            });
            return;
        }

        const apiKey = await authService.generateApiKey(companyId);
        console.log('API key generated for company:', companyId);

        res.status(201).json({
            success: true,
            data: { key: apiKey.key },
            message: 'API key generated successfully'
        });
    } catch (error) {
        console.error('Error generating API key:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to generate API key'
        });
    }
});

// Send Message route (protected by API key)
router.post('/messages', apiKeyMiddleware, async (req: Request, res: Response): Promise<void> => {
    try {
        const { to, from, subject, content, html } = req.body;

        if (!to || !from || !subject || !content) {
            console.log('Missing required email fields:', { to, from, subject, content });
            res.status(400).json({
                success: false,
                error: 'Missing required fields',
                message: 'Please provide to, from, subject, and content fields'
            });
            return;
        }

        const message: EmailMessage = {
            to,
            from,
            subject,
            content,
            html
        };

        console.log('Sending email message:', message);
        const sent = await messageService.sendMessage(message);
        console.log('Email sent status:', sent);

        res.status(sent ? 200 : 500).json({
            success: sent,
            data: { sent },
            message: sent ? 'Message sent successfully' : 'Failed to send message'
        });
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to send message'
        });
    }
});

export default router;
