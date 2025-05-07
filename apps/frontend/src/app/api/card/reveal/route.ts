import fs from 'fs/promises';
import { NextResponse } from 'next/server';
import path from 'path';
import { prisma } from '../../../lib/db';

export async function POST(req: Request) {
    try {
        const { gameId, cardId } = await req.json();

        if (!gameId || !cardId) {
            return NextResponse.json({ message: 'Missing gameId or cardId' }, { status: 400 });
        }

        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { game: true, image: true },
        });

        if (!card || card.gameId !== gameId) {
            return NextResponse.json({ message: 'Invalid card or game' }, { status: 403 });
        }

        if (!card.flipped) {
            await prisma.card.update({
                where: { id: cardId },
                data: { flipped: true },
            });
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
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}