import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export const submitScore = async (req: Request, res: Response) => {
    try {
        const { username, gameId, time } = req.body;

        if (!username || typeof time !== 'number') {
            return res.status(400).json({ message: 'Invalid data' });
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        await prisma.game.update({
            where: { id: gameId },
            data: { durationMs: time },
        });

        return res.status(201).json({ message: 'Score submitted' });
    } catch (error) {
        console.error('[Submit Score Error]', error);
        return res.status(500).json({ message: 'Server error' });
    }
};