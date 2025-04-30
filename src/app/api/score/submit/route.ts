import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, time } = await req.json();

        if (!username || typeof time !== 'number') {
            return NextResponse.json({ message: 'Invalid data' }, { status: 400 });
        }

        // Find the user
        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        // Create finished game record
        await prisma.game.create({
            data: {
                durationMs: time,
                userId: user.id,
                mode: 'timetrial',
                deck: [],
            },
        });

        return NextResponse.json({ message: 'Score submitted' }, { status: 201 });
    } catch (error) {
        console.error('[Submit Score Error]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}