import { NextResponse } from 'next/server';
import { prisma } from '../../lib/db';

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            where: { mode: 'timetrial' },
            select: {
                user: {
                    select: { username: true },
                },
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

        return NextResponse.json(Array.from(bestTimePerUser.values()));
    } catch (error) {
        console.error('Error building scoreboard:', error);
        return NextResponse.json({ message: 'Failed to fetch scoreboard' }, { status: 500 });
    }
}