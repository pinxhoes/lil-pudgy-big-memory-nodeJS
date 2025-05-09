import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/db';
import { generateShuffledDeck } from '../../lib/utils';

export async function createSoloGame(req: Request, res: Response) {
    try {
        const { gridSize } = req.body;

        const validGridSizes = [12, 16, 36];
        const boardSizeMap: Record<number, string> = {
            12: '3x4',
            16: '4x4',
            36: '6x6',
        };

        if (!gridSize || !validGridSizes.includes(gridSize)) {
            return res.status(400).json({ message: 'Invalid or missing grid size for solo mode' });
        }

        const boardSize = boardSizeMap[gridSize];
        const pairCount = gridSize / 2;
        const deck = await generateShuffledDeck(pairCount);

        // Create game + cards in DB with clientCardId
        const game = await prisma.game.create({
            data: {
                mode: 'solo',
                boardSize,
                cards: {
                    create: deck.map((template: { id: number }, index: number) => ({
                        position: index,
                        imageId: template.id,
                        flipped: false,
                        matched: false,
                        clientCardId: uuidv4(),
                    })),
                },
            },
            include: {
                cards: {
                    orderBy: { position: 'asc' },
                    select: { clientCardId: true, position: true },
                },
            },
        });

        const cards = game.cards.map((card) => ({
            id: card.clientCardId,
            position: card.position,
        }));

        return res.status(200).json({ cards });
    } catch (err) {
        console.error('[Create Solo Game Error]', err);
        res.status(500).json({ message: 'Server error' });
    }
}