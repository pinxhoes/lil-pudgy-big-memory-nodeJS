'use client'

type GameStatusProps = {
    currentPlayer: number
    score: number
    turn: number
}

export default function GameStatus({ currentPlayer, score, turn }: GameStatusProps) {
    return (
        <div className="text-center mt-4 space-y-2 text-white">
            <div className="text-lg font-semibold">🎯 Turn {turn}</div>
            <div className="text-md font-medium">🧠 Score Player {currentPlayer}: {score}</div>
        </div>
    )
}