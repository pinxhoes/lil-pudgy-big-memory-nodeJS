import { prisma } from '@/app/lib/db';
import { generateShuffledDeck } from '@/lib/utils';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { gridSize = 48, username } = body;

        if (!username) {
            return NextResponse.json({ message: 'Missing username' }, { status: 400 });
        }

        const user = await prisma.user.findUnique({ where: { username } });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
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
        console.error('[Create Game Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}

// export async function GET() {
//     return NextResponse.json({ message: 'GET not allowed' }, { status: 405 });
// }
