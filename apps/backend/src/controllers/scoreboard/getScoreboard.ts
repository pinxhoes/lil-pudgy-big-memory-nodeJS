import { Request, Response } from 'express';
import { prisma } from '../../lib/db';

export async function getScoreboard(_req: Request, res: Response) {
    try {
        const games = await prisma.game.findMany({
            where: {
                mode: 'timetrial',
                durationMs: { not: null, gt: 0 },
            },
            select: {
                user: { select: { username: true } },
                durationMs: true,
            },
            orderBy: {
                durationMs: 'asc',
            },
        });

        const bestTimePerUser = new Map<string, { username: string; time: number }>();

        for (const game of games) {
            const username = game.user?.username ?? null;
            const time = game.durationMs;

            if (username && time !== null && !bestTimePerUser.has(username)) {
                bestTimePerUser.set(username, { username, time });
            }
        }

        res.status(200).json(Array.from(bestTimePerUser.values()));
    } catch (error) {
        console.error('[Scoreboard Error]', error);
        res.status(500).json({ message: 'Failed to fetch scoreboard' });
    }
}