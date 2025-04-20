'use client'

import { useEffect, useState } from 'react';
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
    rows = 6,
}: StartGameButtonProps) {
    const [cards, setCards] = useState<number[] | null>(null);
    const [gameKey, setGameKey] = useState(0);
    const [loading, setLoading] = useState(false);
    const [cardSize, setCardSize] = useState(80); // default fallback

    // 🔄 Calculate card size based on screen width AND height
    useEffect(() => {
        const updateCardSize = () => {
            const gutter = 12; // gap between cards (12px)
            const padding = 32; // total padding from p-4 (left + right or top + bottom)

            const usableWidth = window.innerWidth - padding;
            const usableHeight = window.innerHeight - 250; // minus buttons + status area

            const cardWidth = Math.floor((usableWidth - gutter * (columns - 1)) / columns);
            const cardHeight = Math.floor((usableHeight - gutter * (rows - 1)) / rows);

            setCardSize(Math.min(cardWidth, cardHeight));
        };

        updateCardSize();
        window.addEventListener('resize', updateCardSize);
        return () => window.removeEventListener('resize', updateCardSize);
    }, [columns, rows]);

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
            setGameKey((prev) => prev + 1);
        } catch (error) {
            console.error('[StartGame] Error:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff] space-y-4">
            <button
                onClick={startGame}
                disabled={loading}
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
        px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? 'Starting...' : 'Start Game'}
            </button>

            {cards && (
                <GameBoardSolo
                    key={gameKey}
                    cards={cards}
                    columns={columns}
                    cardSize={cardSize}
                />
            )}
        </div>
    );
}