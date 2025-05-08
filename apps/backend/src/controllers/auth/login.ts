import bcrypt from 'bcrypt';
import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function loginUser(req: Request, res: Response) {
    try {
        const { username: rawUsername, password } = req.body;

        if (!rawUsername || !password) {
            return res.status(400).json({ message: 'Missing credentials' });
        }

        const username = rawUsername.toLowerCase();

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.password) {
            return res.status(404).json({ message: 'Password not set for this user' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return res.status(401).json({ message: 'Wrong password' });
        }

        return res.status(200).json({
            user: {
                id: user.id,
                username: user.username,
            },
        });
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return res.status(500).json({ message: 'Server error' });
    }
}