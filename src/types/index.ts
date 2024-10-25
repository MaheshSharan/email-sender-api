// src/types/index.ts
export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
    message?: string;
}

export interface EmailMessage {
    to: string;
    from?: string; // Make 'from' optional
    subject: string;
    content: string;
    html?: string;
}
export interface ApiKey {
    key: string;
    companyId: string;
    createdAt: Date;
    expiresAt: Date;  // Add expiresAt to ApiKey
}

declare global {
    namespace Express {
        interface Request {
            companyDetails?: ApiKey | null;
        }
    }
}
