import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const games = await prisma.game.findMany({
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
            const username = game.user.username;
            if (!bestTimePerUser.has(username)) {
                bestTimePerUser.set(username, { username, time: game.durationMs });
            }
        }

        const scoreboard = Array.from(bestTimePerUser.values());

        return NextResponse.json(scoreboard);
    } catch (error) {
        console.error('Error building scoreboard:', error);
        return NextResponse.json({ message: 'Failed to fetch scoreboard' }, { status: 500 });
    }
}

