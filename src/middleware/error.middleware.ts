// src/middleware/error.middleware.ts
import { Request, Response, NextFunction } from 'express';

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error('Error:', err);  // Log the error

    res.status(500).json({
        success: false,
        error: 'Internal server error',
        message: err.message
    });
};
