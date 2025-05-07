import fs from 'fs/promises';
import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import { prisma } from '../../../lib/db';

export async function GET(req: NextRequest) {
    const cardId = req.nextUrl.searchParams.get('cardId');

    if (!cardId) {
        return new NextResponse('Missing cardId', { status: 400 });
    }

    try {
        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { image: true },
        });

        if (!card || !card.image || !card.image.imageUrl) {
            return new NextResponse('Card or image not found', { status: 404 });
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
        console.error('[Card Image Error]', error);
        return new NextResponse('Server error', { status: 500 });
    }
}
