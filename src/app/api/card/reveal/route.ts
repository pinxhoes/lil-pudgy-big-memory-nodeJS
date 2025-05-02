import { prisma } from '@/app/lib/db';
import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';

export async function POST(req: Request) {
    try {
        const { gameId, cardId } = await req.json();

        if (!gameId || !cardId) {
            return NextResponse.json({ message: 'Missing gameId or cardId' }, { status: 400 });
        }

        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { game: true, image: true }, // includes CardTemplate
        });

        if (!card) {
            return NextResponse.json({ message: 'Card not found' }, { status: 404 });
        }

        if (card.gameId !== gameId) {
            return NextResponse.json({ message: 'Game mismatch' }, { status: 403 });
        }

        if (!card.flipped) {
            await prisma.card.update({
                where: { id: cardId },
                data: { flipped: true },
            });
        }

        if (!card.image || !card.image.imageUrl) {
            return NextResponse.json({ message: 'Image not found' }, { status: 404 });
        }

        const imagePath = path.join(process.cwd(), 'public', card.image.imageUrl);
        const imageBuffer = await fs.readFile(imagePath);

        return new NextResponse(imageBuffer, {
            status: 200,
            headers: {
                'Content-Type': 'image/svg+xml',
                'Cache-Control': 'no-store',
            },
        });
    } catch (error) {
        console.error('[Reveal API Error]', error);
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
    }
}
