import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function checkCardMatch(req: Request, res: Response) {
    try {
        const { cardIds, gameId } = req.body;

        if (!Array.isArray(cardIds) || cardIds.length !== 2 || typeof gameId !== 'string') {
            return res.status(400).json({ message: 'Invalid cardIds or missing gameId' });
        }

        const cards = await prisma.card.findMany({
            where: {
                gameId,
                id: { in: cardIds },
            }
        });

        // Ensure both cards are found
        if (cards.length !== 2) {
            return res.status(404).json({ message: 'Cards not found or invalid game context' });
        }

        const [card1, card2] = cards;
        const isMatch = card1.imageId === card2.imageId;

        if (isMatch) {
            await prisma.card.updateMany({
                where: {
                    gameId,
                    id: { in: [card1.id, card2.id] },
                },
                data: { matched: true },
            });

            return res.status(200).json({ matched: true });
        }

        return res.status(200).json({ matched: false });
    } catch (err) {
        console.error('[Check Match Error]', err);
        return res.status(500).json({ message: 'Internal server error' });
    }
}