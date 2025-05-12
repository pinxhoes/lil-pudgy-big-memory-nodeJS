import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
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

        const cardsToCreate: Prisma.CardUncheckedCreateWithoutGameInput[] = deck.map((template, index) => ({
            position: index,
            imageId: template.id,
            flipped: false,
            matched: false,
        }));

        const game = await prisma.game.create({
            data: {
                mode: 'solo',
                boardSize,
                cards: {
                    create: cardsToCreate as Prisma.CardUncheckedCreateWithoutGameInput[],
                },
            },
        });

        const realCards = await prisma.card.findMany({
            where: { gameId: game.id },
            orderBy: { position: 'asc' },
            select: { id: true, position: true },
        });

        return res.status(200).json({ gameId: game.id, cards: realCards });
    } catch (err) {
        console.error('[Create Solo Game Error]', err);
        return res.status(500).json({ message: 'Server error' });
    }
}