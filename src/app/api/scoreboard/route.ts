import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        // Get all games with valid time and player1 info
        const games = await prisma.game.findMany({
            where: {
                time: {
                    not: null,
                },
            },
            select: {
                time: true,
                player1: {
                    select: {
                        id: true,
                        username: true,
                    },
                },
            },
            orderBy: {
                time: 'asc',
            },
        });

        // Reduce to best time per user
        const bestTimeMap = new Map<string, { username: string; time: number }>();

        for (const game of games) {
            const { id, username } = game.player1;
            const gameTime = game.time!;

            if (!bestTimeMap.has(id)) {
                bestTimeMap.set(id, { username, time: gameTime });
            }
        }

        // Convert to array and sort by time
        const scoreboard = Array.from(bestTimeMap.values()).sort((a, b) => a.time - b.time);

        return NextResponse.json(scoreboard);
    } catch (error) {
        console.error('Error building scoreboard:', error);
        return NextResponse.json({ message: 'Failed to fetch scoreboard' }, { status: 500 });
    }
}