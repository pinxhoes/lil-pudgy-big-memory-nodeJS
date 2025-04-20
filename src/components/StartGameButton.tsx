'use client'

import { generateShuffledBoard } from '@/lib/gameLogic'
import { useState } from 'react'
import GameBoard from './GameBoard/GameBoardSolo'


type StartGameButtonProps = {
    userId: string
}

export default function StartGameButton({ userId }: StartGameButtonProps) {
    //const [gameId, setGameId] = useState<string | null>(null)
    const [cards, setCards] = useState<number[] | null>(null)
    const [loading, setLoading] = useState(false)

    const startGame = async () => {
        setLoading(true)

        const res = await fetch('/api/game/create', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mode: 'solo', player1Id: userId }),
        })
        await res.json()

        const shuffled = generateShuffledBoard()
        setCards(shuffled)
        setLoading(false)
    }

    return (
        <div className="p-4 flex flex-col items-center">
            <button
                onClick={startGame}
                disabled={loading}
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
            px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
            transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"

            >
                {loading ? 'Starting...' : 'Start Game'}
            </button>

            {cards && <GameBoard cards={cards} />}
        </div>
    );
}