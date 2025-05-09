import { Prisma } from '@prisma/client';
import { Request, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { prisma } from '../../lib/db';
import { generateShuffledDeck } from '../../lib/utils';


export async function createTimetrialGame(req: Request, res: Response) {
    try {
        const { gridSize = 48 } = req.body;
        const pairCount = gridSize / 2;

        const boardSize = '6x8';
        const deck = await generateShuffledDeck(pairCount);

        const cardsToCreate: Prisma.CardUncheckedCreateWithoutGameInput[] = deck.map((template: { id: number }, index: number) => {
            const card = {
                position: index,
                imageId: template.id,
                flipped: false,
                matched: false,
                clientCardId: uuidv4(),
            };
            console.log(`[SOLO] Card ${index} →`, card);
            return card;
        });

        console.log('[SOLO] Creating game...');
        const game = await prisma.game.create({
            data: {
                mode: 'solo',
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
                clientCardId: true,
                position: true,
            },
        });

        const responseCards = cards.map(card => ({
            id: card.clientCardId,
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