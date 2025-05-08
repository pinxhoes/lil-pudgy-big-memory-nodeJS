import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../../lib/db';

export async function revealCardImage(req: Request, res: Response) {
    const cardId = req.query.cardId as string;

    if (!cardId) {
        return res.status(400).send('Missing cardId');
    }

    try {
        const card = await prisma.card.findUnique({
            where: { id: cardId },
            include: { image: true },
        });

        if (!card || !card.image || !card.image.imageUrl) {
            return res.status(404).send('Card or image not found');
        }

        const imagePath = path.join(process.cwd(), 'public', card.image.imageUrl);
        const imageBuffer = await fs.readFile(imagePath);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).send(imageBuffer);
    } catch (error) {
        console.error('[Reveal Image Error]', error);
        return res.status(500).send('Server error');
    }
}