import { Document } from 'mongoose';

declare global {
    namespace Express {
        interface Request {
            user?: {
                _id: string;
                [key: string]: any;
            };
        }
    }
} 