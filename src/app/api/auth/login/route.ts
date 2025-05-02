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

        const user = await prisma.user.findUnique({
            where: { username },
        });

        if (!user) {
            return NextResponse.json({ message: 'User not found' }, { status: 404 });
        }

        if (!user.password) {
            return NextResponse.json({ message: 'Password not set for this user' }, { status: 404 });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if (!isPasswordCorrect) {
            return NextResponse.json({ message: 'Wrong password' }, { status: 401 });
        }

        return NextResponse.json(
            {
                user: {
                    id: user.id,
                    username: user.username,
                },
            },
            { status: 200 }
        );
    } catch (error) {
        console.error('[LOGIN ERROR]', error);
        return NextResponse.json({ message: 'Server error' }, { status: 500 });
    }
}