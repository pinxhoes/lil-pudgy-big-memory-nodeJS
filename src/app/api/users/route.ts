import { prisma } from '@lib/db';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
            }
        });
        return NextResponse.json(users)
    } catch (error) {
        console.error('Error fetching users:', error)
        return NextResponse.json({ message: 'Failed to fetch users' }, { status: 500 })
    }
}