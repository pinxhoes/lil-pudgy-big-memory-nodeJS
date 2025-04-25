import { prisma } from '@lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { username, password } = body

    console.log('[POST] /api/auth/login', { username, password })

    if (!username) {
        return NextResponse.json({ message: 'Username is required' }, { status: 400 })
    }

    try {
        const user = await prisma.user.upsert({
            where: { username: username as string },
            update: {},
            create: { username, password },
        })

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}