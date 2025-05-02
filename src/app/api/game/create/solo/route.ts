import { prisma } from '@/app/lib/db';
import { generateShuffledDeck } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { gridSize } = body;

        const validGridSizes = [12, 16, 36];
        const boardSizeMap: Record<number, string> = {
            12: '3x4',
            16: '4x4',
            36: '6x6',
        };

        if (!gridSize || !validGridSizes.includes(gridSize)) {
            return NextResponse.json({ message: 'Invalid or missing grid size for solo mode' }, { status: 400 });
        }

        const boardSize = boardSizeMap[gridSize];
        const pairCount = gridSize / 2;

        const deck = await generateShuffledDeck(pairCount);

        const game = await prisma.game.create({
            data: {
                mode: 'solo',
                boardSize,

                cards: {
                    create: deck.map((template, index) => ({
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

        return NextResponse.json({ gameId: game.id, cards }, { status: 200 });
    } catch (error) {
        console.error('[Create Solo Game Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}