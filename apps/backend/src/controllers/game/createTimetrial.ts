import { Request, Response } from 'express';
import { prisma } from '../../lib/db';
import { generateShuffledDeck } from '../../lib/utils';

export async function createTimetrialGame(req: Request, res: Response) {
    try {
        const { gridSize = 48 } = req.body;
        const pairCount = gridSize / 2;

        const boardSize = '6x8';
        const deck = await generateShuffledDeck(pairCount);

        const cardsToCreate = deck.map((template, index) => ({
            position: index,
            imageId: template.id,
            flipped: false,
            matched: false,
        }));

        const game = await prisma.game.create({
            data: {
                mode: 'timetrial',
                boardSize,
                cards: {
                    create: cardsToCreate,
                },
            },
        });

        const cards = await prisma.card.findMany({
            where: { gameId: game.id },
            orderBy: { position: 'asc' },
            select: {
                id: true, // Now using internal ID instead
                position: true,
            },
        });

        const responseCards = cards.map(card => ({
            id: card.id,
            position: card.position,
        }));

        return res.status(200).json({
            gameId: game.id,
            cards: responseCards,
        });
    } catch (err) {
        console.error('[Create Time Trial Game Error]', err);
        res.status(500).json({ message: 'Server error' });
    }
}