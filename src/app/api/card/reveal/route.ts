import { prisma } from '@/app/lib/db';
import { promises as fs } from 'fs';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { gameId, cardId } = await req.json();

        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { game: true },
        });

        if (!card) {
            console.error('Card not found');
            return new Response(null, { status: 403 });
        }
        if (card.gameId !== gameId) {
            console.error('Game ID mismatch:', card.gameId, 'vs', gameId);
            return new Response(null, { status: 403 });
        }
        if (!card.matched && !card.flipped) {
            console.error('Card not flipped or matched:', cardId);
            return new Response(null, { status: 403 });
        }

        const filePath = path.join(process.cwd(), 'public/cards', `${card.imageId}.svg`);
        const fileBuffer = await fs.readFile(filePath);


        return new Response(fileBuffer, {
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store',
            },
        });
    } catch (err) {
        console.error('[Reveal API Error]', err);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}