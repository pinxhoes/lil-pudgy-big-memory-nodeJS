import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function checkCardMatch(req: Request, res: Response) {
    try {
        const { cardIds, gameId } = req.body;

        if (!Array.isArray(cardIds) || cardIds.length !== 2 || typeof gameId !== 'string') {
            return res.status(400).json({ message: 'Invalid cardIds or missing gameId' });
        }

        // Fetch cards by clientCardId
        const cards = await prisma.card.findMany({
            where: {
                gameId,
                clientCardId: { in: cardIds },
            },
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
                    clientCardId: { in: [card1.clientCardId, card2.clientCardId] },
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