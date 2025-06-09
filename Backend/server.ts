import express, { Express, Request, Response } from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { getNotes, createNote, updateNote, deleteNote, getNote } from './routes/notes';
import authRoutes from './routes/auth';
import { verifyFirebaseToken } from './middleware/firebaseAuth';

// Initialize environment variables
dotenv.config({ path: path.resolve(__dirname, '.env') });
console.log('Dotenv config path:', path.resolve(__dirname, '.env'));
console.log('Environment variables loaded:', {
    hasProjectId: !!process.env.FIREBASE_PROJECT_ID,
    hasClientEmail: !!process.env.FIREBASE_CLIENT_EMAIL,
    hasPrivateKey: !!process.env.FIREBASE_PRIVATE_KEY,
    projectIdValue: process.env.FIREBASE_PROJECT_ID,
    clientEmailValue: process.env.FIREBASE_CLIENT_EMAIL,
    privateKeySnippet: process.env.FIREBASE_PRIVATE_KEY ? process.env.FIREBASE_PRIVATE_KEY.slice(0, 50) + '...' : 'not loaded'
});

// Create Express app instance
const app: Express = express();

// Define constants from environment variables
const PORT = process.env.PORT || '5000';
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/note-taking';
const FRONTEND_URL = process.env.FRONTEND_URL || 'http://localhost:5173';
const FIREBASE_PROJECT_ID = process.env.FIREBASE_PROJECT_ID || 'note-taking-app-f901e';
const FIREBASE_CLIENT_EMAIL = process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@note-taking-app-f901e.iam.gserviceaccount.com';
const FIREBASE_PRIVATE_KEY = process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOVudQlwrIfAXc\nwJKLKlTISFN/3By3C3IlEvq5AUHGr2rNB3alL9CA2kqDONdXUOCj5CBMFRW6xWE4\nSiuPNsQQ6UltBE6QNiLlCq6gB1Tmir++dsNs4m26vqaBvUlc+YpXYhJBbegio15E\nU5xVYuLOigq0+aO7DmeXtJqCVkZB1+2y4faxf3h1iGLIg4TjxzRmq5fB88Ybe4pC\n9KpuCQ2QTRfrFYGEHbg2oR4/tR9CGWQ6XcTPBglFEKe8LAZL/aMFnGaL+5Km5ZzT\nmS+RiQYr5C/qd5QekwWz35Oqef6Mg7jp9NWrqvoDhjS+8nv3fBOquB/Qbj0rqnSN\nqN/e/cGfAgMBAAECggEABIjGsC/ZhfqqZaWlCBeH4cIryjwBNN6KBW7g1pmZ+JlD\nPLqEwhrbt0Z/a68fQE/Kgp975uAcaEx3wfUTTE7fnnWEmQzcAxxFcQi75KVfRBUE\nI1XYc+HtQl9305MKySxsp1Xu4RmJXTV/gqXfDMX4W6HknAHTthkaGqyBLAsO+S8Q\n8TyLG9JAoeWm2lHAYeYx6t5F87lDqhuGESyVal6JTbKBpuZz4Al69tdGxF2gslwC\ncDcYBsYTieCb7jxMX2ndy/4eEvMeB8/htQYWXAo5XIWVrJsMddSlepBiPQTUIryS\n9EIaLGeC60gGbdThX92j4nz/llwVHW2EkTyZ1gg9LQKBgQDw1cvJ4nmi6JMuU6Xn\ngkib+pgcnurjZWrLkX4WQw2Uac6a+HiaxQpnmwmxTeb/gsD0gjigZIRQGvh6qV1V\njPf3/oP9m0NS1FrJhjNhAr2GZRL09mU5JiCJYr7CRPYQgerSXqwGUn5Dlqipc7wh\ndJs7qxmAmhLOc48q+orELw288wKBgQDbVQuvbM6W7ILVPjdn0csunaLu8jtFH2H6\ngMKzwf7hETJvTn6pzqARmFHI6JwxWQJwGBk/shhRJ7K1+WCFXYoAI6P/Ka/ABw42\n1WOL4E+1cfo6TCPxDHSfebX9yz1kW1nDSgID9prk6n2MJhhOO1uouM3cvdZTlGm9\nCr94GOtjpQKBgQDcdGh6YiTEGi94LbvlQt5iYa7SLCqJg3GR7JnFmRWaMIyeUSpd\nSlcu5b2mntAAPlmQuI9LSxfPGBEyf0xfno3yZfm+sVycOqTsajsn51FD78u9jrqz\n6JHKESjbPjMcg0BH17+Sffr0tbmoe7fPzCS5JvNORDtI3oFEb1mNIiFqPwKBgECr\nC532i9bt9wlepcFjlu+wpMik/Rq9TQsqCb4sdbTweBlfYHM6q/FkIsEE7ICUSOa6\nBD/Gh+rttIB4/Z902+p8l671II+SxPsf4ZDtWzMZXvjvWC2LSZt3rFQfJ4O+d3Hg\nEUYP4M2b4dZ/qOzwDW9qxa/O/TF5cc++KoQDfOvNAoGAIzBYkFHbyUS2B4YIjGxH\nUSXjM3+OC1QF9d22PRrLhH0fN+lZiYU1l4wbDdgbTYbzstKnbfufB92SA/87LM0p\n+3cqnKp3UKN4TPofEsgV3AqBN4nAAls8B1rLEDJXZp2zd/0MPMBvymdIL1yvdxkh\nNy/IVb89zX/P1x7PnTTNlyM=\n-----END PRIVATE KEY-----\n";
const COOKIE_SECRET: string = process.env.COOKIE_SECRET || 'your_cookie_secret';
// Middleware setup
app.use(
    cors({
        origin: FRONTEND_URL,
        credentials: true,
    })
);
app.use(express.json());
app.use(cookieParser(COOKIE_SECRET));

// MongoDB Connection
const connectDB = async (): Promise<void> => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(MONGO_URI);
        console.log('🚀 MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
};

// Basic health check route
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Additional health check route (for testing)
app.get('/api/health-check', (req: Request, res: Response) => {
    res.json({ status: 'ok', message: 'Backend is working fine!' });
});

// Routes
app.use('/api/auth', authRoutes);
app.get('/api/notes', verifyFirebaseToken, getNotes);
app.post('/api/notes', verifyFirebaseToken, createNote);
app.get('/api/notes/:id', verifyFirebaseToken, getNote);
app.put('/api/notes/:id', verifyFirebaseToken, updateNote);
app.delete('/api/notes/:id', verifyFirebaseToken, deleteNote);

// Start the server
const startServer = async (): Promise<void> => {
    await connectDB();
    app.listen(PORT, () => {
        console.log(`🚀 Server running at http://localhost:${PORT}`);
    });
};

// Initialize the server
startServer();

// Handle graceful shutdown
process.on('SIGTERM', async () => {
    console.log('🛑 SIGTERM received. Closing server...');
    await mongoose.connection.close();
    process.exit(0);
});