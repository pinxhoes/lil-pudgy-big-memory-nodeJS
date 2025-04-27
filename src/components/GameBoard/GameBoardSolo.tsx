'use client';

import GameStatus from '@/components/GameStatus';
import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Loading from '../Loading';
import './Card.css';

type GameBoardProps = {
    cards?: number[];
    columns?: number;
    userId: string;
    gridSize: number;
    rows?: number;
};

export default function GameBoardSolo({ cards: initialCards, columns = 8, userId, gridSize }: GameBoardProps) {
    const [cards, setCards] = useState<number[]>(initialCards ?? []);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
    const [disabled, setDisabled] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'human' | 'computer'>('human');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [gameOver, setGameOver] = useState(false);
    const [cardSize, setCardSize] = useState(100);
    const [loading, setLoading] = useState(false);

    // 🧠 NEW: Generate deck if initial cards are empty
    useEffect(() => {
        if (!initialCards || initialCards.length === 0) {
            const createNewGame = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/game/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            mode: 'solo',
                            player1Id: userId,
                            gridSize,
                        }),
                    });

                    const data = await res.json();
                    if (res.ok && data.game?.deck) {
                        setCards(data.game.deck);
                    } else {
                        console.error('[Initial Game] Invalid response:', data);
                    }
                } catch (error) {
                    console.error('[Initial Game] Error:', error);
                } finally {
                    setLoading(false);
                }
            };

            createNewGame();
        }
    }, [initialCards, userId, gridSize]);

    useEffect(() => {
        const updateCardSize = () => {
            const screenWidth = window.innerWidth;
            const screenHeight = window.innerHeight;

            const isMobile = screenWidth < 768; // 🧠 Tailwind's md breakpoint
            const maxBoardWidth = screenWidth * 0.9;
            const maxBoardHeight = isMobile ? screenHeight * 0.5 : screenHeight * 0.75; // 50% on mobile, 75% on desktop

            const totalRows = Math.ceil(cards.length / columns);

            const cardWidth = maxBoardWidth / columns;
            const cardHeight = maxBoardHeight / totalRows;

            const size = Math.min(cardWidth, cardHeight, 200); // 🧠 200px max
            setCardSize(size);
        };

        updateCardSize();
        window.addEventListener('resize', updateCardSize);
        return () => window.removeEventListener('resize', updateCardSize);
    }, [columns, cards.length]);

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
                    } else {
                        setComputerScore((prev) => prev + 1);
                    }
                    setFlippedCards([]);
                    setDisabled(false);
                } else {
                    setFlippedCards([]);
                    setDisabled(false);
                    setCurrentPlayer((prev) => (prev === 'human' ? 'computer' : 'human'));
                }
            }, 1000);
        }
    }, [flippedCards, cards, currentPlayer]);

    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0) {
            setGameOver(true);
        }
    }, [matchedCards, cards]);

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

    const restartGame = async () => {
        setLoading(true);

        try {
            const res = await fetch('/api/game/create', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    mode: 'solo',
                    player1Id: userId,
                    gridSize,
                }),
            });

            const data = await res.json();
            if (res.ok && data.game?.deck) {
                setCards(data.game.deck);
                setFlippedCards([]);
                setMatchedCards(new Set());
                setDisabled(false);
                setCurrentPlayer('human');
                setPlayerScore(0);
                setComputerScore(0);
                setGameOver(false);
            } else {
                console.error('[RestartGame] Invalid response:', data);
            }
        } catch (error) {
            console.error('[RestartGame] Error:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-8">
            {loading && <Loading />}

            {/* Restart Button */}
            <button
                onClick={restartGame}
                disabled={loading}
                className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
        px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
        transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
            >
                {loading ? 'Restarting...' : 'Restart Game'}
            </button>

            {/* Other UI */}
            {!gameOver ? (
                <div className="flex flex-col items-center gap-2">
                    <div className="text-center text-white text-3xl">
                        {currentPlayer === 'human' ? 'Your turn 🧠' : 'Stoopid turn 🐧'}
                    </div>
                    <GameStatus playerScore={playerScore} computerScore={computerScore} />
                </div>
            ) : (
                <div className="text-center text-white text-2xl mt-6">
                    {playerScore > computerScore
                        ? 'You win! 🧠🎉'
                        : playerScore < computerScore
                            ? 'Stoopid wins! 🐧💀'
                            : "It's a tie!"}
                </div>
            )}

            {/* Cards Grid */}
            <div
                className="grid gap-3 justify-center mt-6"
                style={{
                    gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`,
                }}
            >
                {cards.map((value, i) => {
                    const isFlipped = flippedCards.includes(i) || matchedCards.has(i);

                    return (
                        <div
                            key={i}
                            onClick={() => handleFlip(i)}
                            style={{
                                width: `${cardSize}px`,
                                height: `${cardSize}px`,
                                borderRadius: '9999px',
                            }}
                            className="bg-green-600 border border-white flex items-center justify-center cursor-pointer aspect-square overflow-hidden"
                        >
                            <Image
                                src={isFlipped ? `/cards/${value}.svg` : '/img/gameLogo.svg'}
                                alt={isFlipped ? `penguin ${value}` : 'card back'}
                                width={cardSize}
                                height={cardSize}
                                className="w-[90%] h-[90%] object-contain"
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
}