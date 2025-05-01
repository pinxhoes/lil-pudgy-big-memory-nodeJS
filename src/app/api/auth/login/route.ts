import { prisma } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username: rawUsername, password } = await req.json();

        if (!rawUsername || !password) {
            return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
        }

        const username = rawUsername.toLowerCase();

        const existingUser = await prisma.user.findUnique({
            where: { username }
        });

        // Check user exists and has password set (in case it's a wallet-only user)
        if (!existingUser || !existingUser.password) {
            return NextResponse.json({ message: 'User not found or password not set' }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Wrong password' }, { status: 401 });
        }

        return NextResponse.json({
            user: {
                id: existingUser.id,
                username: existingUser.username,
            },
        }, { status: 200 });

    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}