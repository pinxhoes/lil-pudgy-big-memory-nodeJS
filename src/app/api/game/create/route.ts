import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

// Helper to create a shuffled deck of 24 pairs (48 cards total)
function generateShuffledDeck(): number[] {
    const pairs = Array.from({ length: 24 }, (_, i) => i + 1); // card IDs 1 to 24
    const fullDeck = [...pairs, ...pairs]; // duplicate to make pairs

    // Fisher-Yates shuffle
    for (let i = fullDeck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
    }

    return fullDeck;
}

export async function POST(req: Request) {
    const body = await req.json();
    const { mode, player1Id, player2Id } = body;

    if (!mode || !player1Id) {
        return NextResponse.json({ message: 'Invalid game data' }, { status: 400 });
    }

    try {
        const shuffledDeck = generateShuffledDeck();

        const game = await prisma.game.create({
            data: {
                mode,
                player1Id,
                player2Id: mode === 'multiplayer' ? player2Id : null,
                deck: shuffledDeck,
                revealed: [], // empty initially
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
