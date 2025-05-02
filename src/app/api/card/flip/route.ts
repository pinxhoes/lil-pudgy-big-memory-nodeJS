import { prisma } from '@/app/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { gameId, cardId } = await req.json();

        if (!gameId || !cardId) {
            return NextResponse.json({ message: 'Missing gameId or cardId' }, { status: 400 });
        }

        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { game: true },
        });

        if (!card) {
            console.error('[Flip] Card not found');
            return NextResponse.json({ message: 'Card not found' }, { status: 404 });
        }

        if (card.gameId !== gameId) {
            console.error('[Flip] Game ID mismatch');
            return NextResponse.json({ message: 'Game mismatch' }, { status: 403 });
        }

        const mode = card.game.mode;
        console.log(`[Flip] Mode = ${mode} for card ${cardId}`);

        if (mode === 'solo') {
            await prisma.card.update({
                where: { id: cardId },
                data: { flipped: true },
            });
        }

        return NextResponse.json({ message: 'Card flip handled' }, { status: 200 });
    } catch (error) {
        console.error('[Flip API Error]', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}