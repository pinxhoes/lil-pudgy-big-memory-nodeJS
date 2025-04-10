'use client';

import GameStatus from '@/components/GameStatus';
import { useCallback, useEffect, useState } from 'react';
import './Card.css';

type GameBoardProps = {
    cards: number[];
};

export default function GameBoardSolo({ cards }: GameBoardProps) {
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
    const [disabled, setDisabled] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'human' | 'computer'>('human');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);

    const handleFlip = useCallback(
        (index: number) => {
            if (disabled || currentPlayer !== 'human') return;
            if (flippedCards.includes(index) || matchedCards.has(index)) return;

            const newFlipped = [...flippedCards, index];
            setFlippedCards(newFlipped);

            if (newFlipped.length === 2) {
                setDisabled(true);
            }
        },
        [disabled, currentPlayer, flippedCards, matchedCards]
    );

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [i1, i2] = flippedCards;
            const isMatch = cards[i1] === cards[i2];

            setTimeout(() => {
                if (isMatch) {
                    setMatchedCards((prev) => new Set(prev).add(i1).add(i2));
                    if (currentPlayer === 'human') {
                        setPlayerScore((prev) => prev + 1);
                        setFlippedCards([]);
                        setDisabled(false);
                        // Stay on human turn
                    } else {
                        setComputerScore((prev) => prev + 1);
                        setFlippedCards([]);
                        setDisabled(false);
                        // Repeat computer turn
                    }
                } else {
                    setFlippedCards([]);
                    setDisabled(false);
                    setCurrentPlayer((prev) => (prev === 'human' ? 'computer' : 'human'));
                }
            }, 1000);
        }
    }, [flippedCards, cards, currentPlayer]);

    useEffect(() => {
        if (matchedCards.size === cards.length) {
            setGameOver(true);
        }
    }, [matchedCards, cards]);

    // Computer turn logic
    useEffect(() => {
        if (currentPlayer === 'computer' && flippedCards.length === 0 && !disabled) {
            const available = cards
                .map((_, i) => i)
                .filter((i) => !matchedCards.has(i));

            if (available.length < 2) return;

            const [first, second] = available.sort(() => 0.5 - Math.random()).slice(0, 2);

            setDisabled(true);
            setTimeout(() => setFlippedCards([first]), 500);
            setTimeout(() => setFlippedCards([first, second]), 1200);
        }
    }, [currentPlayer, flippedCards.length, disabled, matchedCards, cards]);

    return (
        <>
            {!gameOver ? (
                <>
                    <div className="text-center text-white mt-4 text-lg">
                        {currentPlayer === 'human' ? 'Your turn 🧠' : 'Stoopid turn 🐧'}
                    </div>
                    <GameStatus playerScore={playerScore} computerScore={computerScore} />
                </>
            ) : (
                <div className="text-center text-white text-2xl mt-4">
                    {playerScore > computerScore
                        ? 'You win! 🧠🎉'
                        : playerScore < computerScore
                            ? 'Stoopid wins! 🐧💀'
                            : "It's a tie!"}
                </div>
            )}

            <div className="grid grid-cols-8 gap-3 w-[90vw] max-w-[1000px] mx-auto mt-4">
                {cards.map((value, i) => {
                    const isFlipped = flippedCards.includes(i) || matchedCards.has(i);

                    return (
                        <div
                            key={i}
                            onClick={() => handleFlip(i)}
                            className="rounded-full bg-green-600 border border-white flex items-center justify-center text-white font-bold text-xl cursor-pointer aspect-square"
                            style={{
                                backgroundColor: isFlipped ? '#111' : '#10b981',
                                color: isFlipped ? '#fff' : 'transparent',
                            }}
                        >
                            {value}
                        </div>
                    );
                })}
            </div>
        </>
    );
}
