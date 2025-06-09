import { Router, Request, Response } from 'express';
import User from '../models/User';
import { verifyFirebaseToken } from '../middleware/firebaseAuth';

const router = Router();

// Get current user profile
router.get('/me', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.user?._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        console.error('Error fetching user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put('/me', verifyFirebaseToken, async (req: Request, res: Response) => {
    try {
        const { name } = req.body;
        const user = await User.findByIdAndUpdate(
            req.user?._id,
            { name },
            { new: true, runValidators: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error updating user profile:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

export default router; 