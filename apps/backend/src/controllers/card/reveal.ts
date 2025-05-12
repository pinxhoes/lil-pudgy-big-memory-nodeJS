import { Request, Response } from 'express';
import fs from 'fs/promises';
import path from 'path';
import { prisma } from '../../lib/db';

export async function revealCard(req: Request, res: Response) {
    try {
        const { gameId, cardId } = req.body;

        if (!gameId || !cardId) {
            return res.status(400).json({ message: 'Missing gameId or cardId' });
        }

        const card = await prisma.card.findFirst({
            where: {
                gameId,
                id: cardId,
            },
        });

        if (!card) {
            return res.status(403).json({ message: 'Invalid card or game' });
        }

        // Flip the card if not already flipped
        if (!card.flipped) {
            await prisma.card.update({
                where: { id: card.id },
                data: { flipped: true },
            });
        }

        // Fetch the card image template using imageId
        const imageTemplate = await prisma.cardTemplate.findUnique({
            where: { id: card.imageId },
        });

        if (!imageTemplate?.imageUrl) {
            return res.status(404).json({ message: 'Image not found for card' });
        }

        const imagePath = path.join(__dirname, '../../../public', imageTemplate.imageUrl);
        const imageBuffer = await fs.readFile(imagePath);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store');
        return res.send(imageBuffer);
    } catch (error) {
        console.error('[Reveal API Error]', error);
        return res.status(500).json({ message: 'Server error' });
    }
}