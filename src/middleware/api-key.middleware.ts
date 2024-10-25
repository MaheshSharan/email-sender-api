// src/middleware/api-key.middleware.ts
import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service';
import { ApiResponse } from '../types';

const authService = new AuthService();

export const apiKeyMiddleware = async (
    req: Request,
    res: Response,
    next: NextFunction
): Promise<void> => {
    const apiKey = req.header('X-API-Key');

    if (!apiKey) {
        res.status(401).json({
            success: false,
            error: 'API key is required',
            message: 'Please provide an API key in the X-API-Key header'
        });
        return;
    }

    // Validate API key and check expiration
    if (!(await authService.validateApiKey(apiKey))) {
        res.status(401).json({
            success: false,
            error: 'Invalid or expired API key',
            message: 'The provided API key is invalid or has expired'
        });
        return;
    }

    // Attach company details to the request for later use
    req.companyDetails = await authService.getCompanyDetails(apiKey);
    next();
};
