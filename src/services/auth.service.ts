// src/services/auth.service.ts
import crypto from 'crypto';
import knex from 'knex';
import { ApiKey } from '../types';

const db = knex(require('../../knexfile').development);

export class AuthService {
    // Generate API key, revoking old keys for the same company
    async generateApiKey(companyId: string): Promise<ApiKey> {
        const key = crypto.randomBytes(32).toString('hex');
        const expiresAt = new Date();
        expiresAt.setDate(expiresAt.getDate() + 30); // Expire in 30 days

        const apiKey: ApiKey = {
            key,
            companyId,
            createdAt: new Date(),
            expiresAt
        };

        // Remove any existing API keys for this company ID
        await db('api_keys').where({ companyId }).del();

        // Insert new API key into the database
        await db('api_keys').insert(apiKey);
        console.log('Generated API key:', apiKey);

        return apiKey;
    }

    async validateApiKey(key: string): Promise<boolean> {
        const result = await db('api_keys').where({ key }).first();
        if (!result) return false;

        const now = new Date();
        if (new Date(result.expiresAt) < now) {
            console.log('API key expired:', key);
            await this.removeApiKey(key);
            return false;
        }
        return true;
    }

    async getCompanyDetails(key: string): Promise<ApiKey | null> {
        const companyDetails = await db('api_keys').where({ key }).first();
        return companyDetails || null;
    }

    async removeApiKey(key: string): Promise<boolean> {
        const deleted = await db('api_keys').where({ key }).del();
        return !!deleted;
    }
}
