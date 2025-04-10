'use client'

import styles from '@/app/page.module.css'
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
                className={styles.landingButton}
            >
                {loading ? 'Starting...' : 'Start Game'}
            </button>

            {cards && <GameBoard cards={cards} />}
        </div>
    );
}