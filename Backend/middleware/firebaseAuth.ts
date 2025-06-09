import { Request, Response, NextFunction } from 'express';
import admin from 'firebase-admin';
import User from '../models/User';

// Log environment variables for debugging
console.log('Firebase Config:', {
    projectId: process.env.FIREBASE_PROJECT_ID,
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY ? 'loaded' : 'not loaded'
});

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    const serviceAccount = {
        projectId: process.env.FIREBASE_PROJECT_ID || 'note-taking-app-f901e',
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL || 'firebase-adminsdk-fbsvc@note-taking-app-f901e.iam.gserviceaccount.com',
        privateKey: (process.env.FIREBASE_PRIVATE_KEY || "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDOVudQlwrIfAXc\nwJKLKlTISFN/3By3C3IlEvq5AUHGr2rNB3alL9CA2kqDONdXUOCj5CBMFRW6xWE4\nSiuPNsQQ6UltBE6QNiLlCq6gB1Tmir++dsNs4m26vqaBvUlc+YpXYhJBbegio15E\nU5xVYuLOigq0+aO7DmeXtJqCVkZB1+2y4faxf3h1iGLIg4TjxzRmq5fB88Ybe4pC\n9KpuCQ2QTRfrFYGEHbg2oR4/tR9CGWQ6XcTPBglFEKe8LAZL/aMFnGaL+5Km5ZzT\nmS+RiQYr5C/qd5QekwWz35Oqef6Mg7jp9NWrqvoDhjS+8nv3fBOquB/Qbj0rqnSN\nqN/e/cGfAgMBAAECggEABIjGsC/ZhfqqZaWlCBeH4cIryjwBNN6KBW7g1pmZ+JlD\nPLqEwhrbt0Z/a68fQE/Kgp975uAcaEx3wfUTTE7fnnWEmQzcAxxFcQi75KVfRBUE\nI1XYc+HtQl9305MKySxsp1Xu4RmJXTV/gqXfDMX4W6HknAHTthkaGqyBLAsO+S8Q\n8TyLG9JAoeWm2lHAYeYx6t5F87lDqhuGESyVal6JTbKBpuZz4Al69tdGxF2gslwC\ncDcYBsYTieCb7jxMX2ndy/4eEvMeB8/htQYWXAo5XIWVrJsMddSlepBiPQTUIryS\n9EIaLGeC60gGbdThX92j4nz/llwVHW2EkTyZ1gg9LQKBgQDw1cvJ4nmi6JMuU6Xn\ngkib+pgcnurjZWrLkX4WQw2Uac6a+HiaxQpnmwmxTeb/gsD0gjigZIRQGvh6qV1V\njPf3/oP9m0NS1FrJhjNhAr2GZRL09mU5JiCJYr7CRPYQgerSXqwGUn5Dlqipc7wh\ndJs7qxmAmhLOc48q+orELw288wKBgQDbVQuvbM6W7ILVPjdn0csunaLu8jtFH2H6\ngMKzwf7hETJvTn6pzqARmFHI6JwxWQJwGBk/shhRJ7K1+WCFXYoAI6P/Ka/ABw42\n1WOL4E+1cfo6TCPxDHSfebX9yz1kW1nDSgID9prk6n2MJhhOO1uouM3cvdZTlGm9\nCr94GOtjpQKBgQDcdGh6YiTEGi94LbvlQt5iYa7SLCqJg3GR7JnFmRWaMIyeUSpd\nSlcu5b2mntAAPlmQuI9LSxfPGBEyf0xfno3yZfm+sVycOqTsajsn51FD78u9jrqz\n6JHKESjbPjMcg0BH17+Sffr0tbmoe7fPzCS5JvNORDtI3oFEb1mNIiFqPwKBgECr\nC532i9bt9wlepcFjlu+wpMik/Rq9TQsqCb4sdbTweBlfYHM6q/FkIsEE7ICUSOa6\nBD/Gh+rttIB4/Z902+p8l671II+SxPsf4ZDtWzMZXvjvWC2LSZt3rFQfJ4O+d3Hg\nEUYP4M2b4dZ/qOzwDW9qxa/O/TF5cc++KoQDfOvNAoGAIzBYkFHbyUS2B4YIjGxH\nUSXjM3+OC1QF9d22PRrLhH0fN+lZiYU1l4wbDdgbTYbzstKnbfufB92SA/87LM0p\n+3cqnKp3UKN4TPofEsgV3AqBN4nAAls8B1rLEDJXZp2zd/0MPMBvymdIL1yvdxkh\nNy/IVb89zX/P1x7PnTTNlyM=\n-----END PRIVATE KEY-----\n").replace(/\\n/g, '\n')
    };
    console.log('Service Account:', serviceAccount);
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

interface FirebaseDecodedToken {
    email?: string;
    name?: string;
    uid: string;
    [key: string]: any;
}

export const verifyFirebaseToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const authHeader = req.headers.authorization;
        
        if (!authHeader?.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'No token provided' });
        }

        const token = authHeader.split('Bearer ')[1];
        const decodedToken = await admin.auth().verifyIdToken(token) as FirebaseDecodedToken;
        
        if (!decodedToken.email) {
            return res.status(401).json({ message: 'Invalid token: no email provided' });
        }

        // Get or create user in MongoDB
        let user = await User.findOne({ email: decodedToken.email });
        
        if (!user) {
            // Create new user if doesn't exist
            user = await User.create({
                email: decodedToken.email,
                name: decodedToken.name || decodedToken.email.split('@')[0],
                password: Math.random().toString(36).slice(-8) // Random password since auth is handled by Firebase
            });
        }

        // Attach user to request object
        req.user = {
            _id: user._id,
            email: user.email,
            name: user.name
        };

        next();
    } catch (error) {
        console.error('Firebase auth error:', error);
        res.status(401).json({ message: 'Invalid token' });
    }
};