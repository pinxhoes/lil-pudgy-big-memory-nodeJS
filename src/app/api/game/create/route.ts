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
    try {
        const { gridSize = 48 } = await req.json();

        const shuffledDeck = generateShuffledDeck(gridSize);

        return NextResponse.json({ deck: shuffledDeck }, { status: 200 });
    } catch (error) {
        console.error('[Create Deck Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}