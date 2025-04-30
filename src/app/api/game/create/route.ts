import { prisma } from '@/app/lib/db';
import { generateShuffledDeck } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { gridSize = 48, username, mode = 'timetrial' } = body;

        if (!username) {
            return NextResponse.json({ message: 'Missing username' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const deck = generateShuffledDeck(gridSize);

        const game = await prisma.game.create({
            data: {
                userId: user.id,
                deck,
                mode,
                durationMs: 0,
            },
        });

        return NextResponse.json({ gameId: game.id }, { status: 200 });
    } catch (error) {
        console.error('[Create Game Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}