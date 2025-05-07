import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { generateShuffledDeck } from '../../lib/utils';

export async function createTimetrialGame(req: Request, res: Response) {
    try {
        const { username, gridSize = 48 } = req.body;

        if (!username) {
            return res.status(400).json({ message: 'Missing username' });
        }

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const boardSize = '6x8';
        const pairCount = gridSize / 2;
        const deck = await generateShuffledDeck(pairCount);

        const game = await prisma.game.create({
            data: {
                mode: 'timetrial',
                boardSize,
                durationMs: 0,
                userId: user.id,
                cards: {
                    create: deck.map((template: { id: number }, index: number) => ({
                        position: index,
                        imageId: template.id,
                        flipped: false,
                        matched: false,
                    })),
                },
            },
        });

        const cards = await prisma.card.findMany({
            where: { gameId: game.id },
            orderBy: { position: 'asc' },
            select: { id: true, position: true },
        });

        return res.status(200).json({ gameId: game.id, cards });
    } catch (err) {
        console.error('[Create Time Trial Game Error]', err);
        res.status(500).json({ message: 'Server error' });
    }
}