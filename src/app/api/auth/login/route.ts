import { prisma } from '@lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { wallet, privyId, username } = body

    console.log('[POST] /api/auth/login', { wallet, privyId, username })

    if (!wallet) {
        return NextResponse.json({ message: 'Wallet address is required' }, { status: 400 })
    }

    try {
        const user = await prisma.user.upsert({
            where: { wallet },
            update: { privyId, username },
            create: { wallet, privyId, username },
        })

        return NextResponse.json({ user }, { status: 200 })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json({ message: 'Internal server error' }, { status: 500 })
    }
}