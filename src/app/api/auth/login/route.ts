// src/app/api/auth/login/route.ts
import { prisma } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const { username, password } = await req.json();

        if (!username || !password) {
            return NextResponse.json({ message: 'Missing credentials' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({ where: { username } });

        if (!existingUser) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, existingUser.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Wrong password' }, { status: 401 });
        }

        return NextResponse.json({ user: { username: existingUser.username } }, { status: 200 });
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}