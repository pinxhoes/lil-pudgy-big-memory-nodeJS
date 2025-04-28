import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const games = await prisma.game.findMany({
            where: {
                time: { gt: 0 },
            },
            orderBy: {
                time: 'asc',
            },
            include: {
                user: {
                    select: {
                        username: true,
                    },
                },
            },
        });

        const scoreboard = games.map((game) => ({
            username: game.user.username,
            time: game.time,
        }));

        return NextResponse.json(scoreboard);
    } catch (error) {
        console.error('Error building scoreboard:', error);
        return NextResponse.json({ message: 'Failed to fetch scoreboard' }, { status: 500 });
    }
}