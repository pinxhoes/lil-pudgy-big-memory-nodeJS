import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/db';
import { generateShuffledDeck } from '../../lib/utils';

export const submitScore = async (req: Request, res: Response) => {
    try {
        const { username, time, gridSize = 48 } = req.body;

        if (!username || typeof time !== 'number' || time <= 0) {
            return res.status(400).json({ message: 'Invalid data' });
        }

        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // 🧼 Remove all previous time trial games for this user
        await prisma.game.deleteMany({
            where: {
                mode: 'timetrial',
                userId: user.id,
            },
        });

        // ✅ Generate and save new game only if it's a valid score
        const boardSize = '6x8';
        const pairCount = gridSize / 2;
        const deck = await generateShuffledDeck(pairCount);

        const game = await prisma.game.create({
            data: {
                mode: 'timetrial',
                boardSize,
                durationMs: time,
                userId: user.id,
                cards: {
                    create: deck.map((template: { id: number }, index: number) => ({
                        position: index,
                        imageId: template.id,
                        flipped: true,
                        matched: true,
                        clientCardId: uuidv4(),
                    })),
                },
            },
        });

        return res.status(201).json({ message: 'Score submitted', gameId: game.id });
    } catch (error) {
        console.error('[Submit Score Error]', error);
        return res.status(500).json({ message: 'Server error' });
    }
};