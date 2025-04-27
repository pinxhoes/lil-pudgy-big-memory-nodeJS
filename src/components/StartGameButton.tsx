'use client'

import { useState } from 'react';
import GameBoardSolo from './GameBoard/GameBoardSolo';

type StartGameButtonProps = {
    userId: string;
    gridSize?: number;
    columns?: number;
    rows?: number;
};

export default function StartGameButton({
    userId,
    gridSize = 48,
    columns = 8,

}: StartGameButtonProps) {
    const [cards, setCards] = useState<number[] | null>(null);
    const [loading, setLoading] = useState(false);



    const startGame = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/game/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ mode: 'solo', player1Id: userId, gridSize }),
            });

            const data = await res.json();
            if (!res.ok || !data.game?.deck) {
                console.error('[StartGame] Invalid response:', data);
                alert('Failed to start game. Please try again.');
                setLoading(false);
                return;
            }

            setCards(data.game.deck);
        } catch (error) {
            console.error('[StartGame] Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className={`flex flex-col items-center p-4 bg-[#80abff] ${cards ? '' : 'min-h-screen justify-center'
                }`}
        >
            <button
                onClick={startGame}
                disabled={loading}
                className="mb-2 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
        px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? 'Starting...' : 'Start Game'}
            </button>

            {cards && (
                <GameBoardSolo
                    userId={userId}
                    gridSize={gridSize}
                    cards={cards}
                    columns={columns}
                />
            )}
        </div>
    );
}