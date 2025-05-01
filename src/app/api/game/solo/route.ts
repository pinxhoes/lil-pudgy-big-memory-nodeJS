import { prisma } from '@/app/lib/db';
import { generateShuffledDeck } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { gridSize = 48, userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ message: 'Missing userId' }, { status: 400 });
        }

        const deck = generateShuffledDeck(gridSize);

        const game = await prisma.game.create({
            data: {
                userId,
                deck,
                mode: 'solo',
                durationMs: 0,
            },
        });

        return NextResponse.json({ gameId: game.id }, { status: 200 });
    } catch (error) {
        console.error('[Create Solo Game Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}