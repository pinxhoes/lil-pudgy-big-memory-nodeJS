import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function cleanupSoloGames(_req: Request, res: Response) {
    try {
        const soloGames = await prisma.game.findMany({
            where: { mode: 'solo' },
            select: { id: true },
        });

        const soloGameIds = soloGames.map(g => g.id);

        const deleteCards = await prisma.card.deleteMany({
            where: { gameId: { in: soloGameIds } },
        });

        const deleteGames = await prisma.game.deleteMany({
            where: { id: { in: soloGameIds } },
        });

        return res.status(200).json({
            message: 'Solo games and cards deleted',
            cardsDeleted: deleteCards.count,
            gamesDeleted: deleteGames.count,
        });
    } catch (err) {
        console.error('[Cleanup Solo Games Error]', err);
        return res.status(500).json({ message: 'Cleanup failed' });
    }
}