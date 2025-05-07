import { NextResponse } from 'next/server';
import { prisma } from '../../lib/db';

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