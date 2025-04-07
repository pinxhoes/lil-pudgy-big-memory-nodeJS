import { prisma } from '@lib/db'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    const body = await req.json()
    const { mode, player1Id, player2Id } = body

    if (!mode || !player1Id) {
        return NextResponse.json({ message: 'Invalid game data' }, { status: 400 })
    }

    try {
        const game = await prisma.game.create({
            data: {
                mode,
                player1Id,
                player2Id: mode === 'multiplayer' ? player2Id : null,
            },
        })

        return NextResponse.json({ game }, { status: 201 })
    } catch (error) {
        console.error('[Game] Failed to create game:', error)
        return NextResponse.json({ message: 'Server error' }, { status: 500 })
    }
}