import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            where: {
                time: { not: null },
                status: 'completed',
                mode: 'timetrial',
            },
            orderBy: { time: 'asc' },
            include: {
                player1: {
                    select: { id: true, username: true },
                },
            },
        });

        const bestTimesByUser = new Map<string, { username: string; time: number }>();

        for (const game of games) {
            const userId = game.player1.id;
            if (!bestTimesByUser.has(userId)) {
                bestTimesByUser.set(userId, {
                    username: game.player1.username,
                    time: game.time!,
                });
            }
        }

        const scoreboard = Array.from(bestTimesByUser.values()).sort((a, b) => a.time - b.time);

        return NextResponse.json(scoreboard);
    } catch (error) {
        console.error('Error fetching scoreboard:', error);
        return NextResponse.json({ message: 'Failed to fetch scoreboard' }, { status: 500 });
    }
}