'use client'

import { generateShuffledBoard } from '@/lib/gameLogic'
import { useState } from 'react'
import GameBoard from './GameBoard/GameBoard'
import GameStatus from './GameStatus'

type StartGameButtonProps = {
    userId: string
}

export default function StartGameButton({ userId }: StartGameButtonProps) {
    //const [gameId, setGameId] = useState<string | null>(null)
    const [cards, setCards] = useState<number[] | null>(null)
    const [loading, setLoading] = useState(false)
    const [turn, setTurn] = useState(1)
    const [score, setScore] = useState(0)

    const startGame = async () => {
        setLoading(true)

        const res = await fetch('/api/game/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'solo', player1Id: userId }),
        })
        await res.json()
        //setGameId(data.game.id)

        const shuffled = generateShuffledBoard()
        setCards(shuffled)
        setTurn(1)
        setScore(0)
        setLoading(false)
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <button
                onClick={startGame}
                disabled={loading}
                className="rounded-lg bg-blue-600 text-white px-4 py-2 font-semibold hover:bg-blue-700 disabled:opacity-50"
            >
                {loading ? 'Starting...' : 'Start Game'}
            </button>

            {cards && (
                <>
                    <GameStatus currentPlayer={1} score={score} turn={turn} />
                    <GameBoard cards={cards} />
                </>
            )}
        </div>
    )
}