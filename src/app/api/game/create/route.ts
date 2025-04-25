import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

function generateShuffledDeck(size = 48): number[] {
    const totalPairs = Math.floor(size / 2);
    const pairs = Array.from({ length: totalPairs }, (_, i) => i + 1);
    const fullDeck = [...pairs, ...pairs];

    for (let i = fullDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    return fullDeck;
}

export async function POST(req: Request) {
    const body = await req.json();
    const { mode, player1Id, player2Id, gridSize = 48 } = body;

    console.log('[POST] /api/game/create body:', body);

    if (!mode || !player1Id) {
        return NextResponse.json({ message: 'Invalid game data' }, { status: 400 });
    }

    try {
        // 👇 Ensure guest user exists
        const player1 = await prisma.user.upsert({
            where: { username: player1Id },
            update: {},
            create: {
                username: player1Id,
                password: 'guest',
            },
        });

        const shuffledDeck = generateShuffledDeck(gridSize);
        console.log('[POST] Generated deck:', shuffledDeck);

        const game = await prisma.game.create({
            data: {
                mode,
                player1Id: player1.id, // 🧠 Use upserted user's actual ID
                player2Id: mode === 'multiplayer' ? player2Id : null,
                deck: shuffledDeck,
                revealed: [],
                turn: 1,
                status: 'active',
            },
        });

        return NextResponse.json({ game }, { status: 201 });
    } catch (error) {
        console.error('[Game] Failed to create game:', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}