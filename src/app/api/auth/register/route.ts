import { prisma } from '@/app/lib/db';
import bcrypt from 'bcrypt';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { username } = body;
        const { password } = body;

        if (!username || !password) {
            return NextResponse.json({ error: 'Missing username or password' }, { status: 400 });
        }

        username = username.toLowerCase();

        if (!/^[a-z0-9_]{3,20}$/.test(username)) {
            return NextResponse.json({ error: 'Invalid username format' }, { status: 400 });
        }

        const existingUser = await prisma.user.findUnique({
            where: { username },
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Username already exists' }, { status: 409 });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                username,
                password: hashedPassword,
            },
        });

        return NextResponse.json({
            user: {
                id: newUser.id,
                username: newUser.username,
            },
        }, { status: 201 });
    } catch (error) {
        console.error('[REGISTER ERROR]', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}