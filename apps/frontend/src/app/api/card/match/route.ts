import { NextResponse } from 'next/server';
import { prisma } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const { cardIds } = await req.json();

        if (!Array.isArray(cardIds) || cardIds.length !== 2) {
            return NextResponse.json({ message: 'Invalid cardIds' }, { status: 400 });
        }

        const cards = await prisma.card.findMany({
            where: { id: { in: cardIds } },
        });

        if (cards.length !== 2) {
            return NextResponse.json({ message: 'Cards not found' }, { status: 404 });
        }

        const [card1, card2] = cards;

        const isMatch = card1.imageId === card2.imageId;

        if (isMatch) {
            await prisma.card.updateMany({
                where: { id: { in: [card1.id, card2.id] } },
                data: { matched: true },
            });

            return NextResponse.json({ matched: true }, { status: 200 });
        } else {
            return NextResponse.json({ matched: false }, { status: 200 });
        }
    } catch (err) {
        console.error('[Match API Error]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}