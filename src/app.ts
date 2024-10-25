// src/app.ts
import 'dotenv/config'; // Ensure dotenv loads before other imports
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { appConfig } from './config/app-config';
import apiRoutes from './routes/api.routes';
import { errorHandler } from './middleware/error.middleware';

const app = express();

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Public routes
app.get('/health', (_, res) => {
    res.json({
        success: true,
        data: { status: 'healthy' }
    });
});

// Auth routes
app.use('/api', apiRoutes);

// Error handling middleware
app.use(errorHandler);

// Start server
app.listen(appConfig.port, () => {
    console.log(`Server running on port ${appConfig.port} in ${appConfig.environment} mode`);
});

export default app;
