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

        // Now we find by clientCardId instead of internal id
        const card = await prisma.card.findFirst({
            where: {
                gameId,
                clientCardId: cardId,
            },
            include: {
                game: true,
                image: true,
            },
        });

        if (!card) {
            return res.status(403).json({ message: 'Invalid card or game' });
        }

        if (!card.flipped) {
            await prisma.card.update({
                where: { id: card.id },
                data: { flipped: true },
            });
        }

        if (!card.image?.imageUrl) {
            return res.status(404).json({ message: 'Image not found for card' });
        }

        const imagePath = path.join(__dirname, '../../../public', card.image.imageUrl);
        const imageBuffer = await fs.readFile(imagePath);

        res.setHeader('Content-Type', 'image/svg+xml');
        res.setHeader('Cache-Control', 'no-store');
        return res.send(imageBuffer);
    } catch (error) {
        console.error('[Reveal API Error]', error);
        return res.status(500).json({ message: 'Server error' });
    }
}