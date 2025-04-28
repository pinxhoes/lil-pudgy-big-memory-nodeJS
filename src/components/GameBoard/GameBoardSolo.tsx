'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Loading from '../Loading';
import './Card.css';

type GameBoardProps = {
    cards?: number[];
    columns: number;
    rows: number;
    userId: string;
    gridSize: number;
};

export default function GameBoardSolo({
    cards: initialCards,
    columns,
    rows,
    userId,
    gridSize,
}: GameBoardProps) {
    const [cards, setCards] = useState<number[]>(initialCards ?? []);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
    const [disabled, setDisabled] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'human' | 'computer'>('human');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [cardSize, setCardSize] = useState(100);
    const [loading, setLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);

    useEffect(() => {
        if (!initialCards || initialCards.length === 0) {
            const createNewGame = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/game/solo', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gridSize }),
                    });

                    const data = await res.json();
                    if (res.ok && data.deck) {
                        setCards(data.deck);
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
        const updateLayout = () => {
            const screenWidth = window.innerWidth;
            const maxWidth = screenWidth * 0.9;
            const maxHeight = window.innerHeight * 0.75;
            const cardWidth = maxWidth / columns;
            const cardHeight = maxHeight / rows;
            const size = Math.min(cardWidth, cardHeight, 200);
            setCardSize(size);
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [columns, rows]);

    const handleFlip = useCallback((index: number) => {
        if (disabled || currentPlayer !== 'human') return;
        if (flippedCards.includes(index) || matchedCards.has(index)) return;

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
        }
    }, [disabled, currentPlayer, flippedCards, matchedCards]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [i1, i2] = flippedCards;
            const isMatch = cards[i1] === cards[i2];

            setTimeout(() => {
                if (isMatch) {
                    setMatchedCards(prev => new Set(prev).add(i1).add(i2));
                    if (currentPlayer === 'human') {
                        setPlayerScore(prev => prev + 1);
                    } else {
                        setComputerScore(prev => prev + 1);
                    }
                } else {
                    setCurrentPlayer(prev => (prev === 'human' ? 'computer' : 'human'));
                }

                setFlippedCards([]);
                setDisabled(false);
            }, 800);
        }
    }, [flippedCards, cards, currentPlayer]);

    useEffect(() => {
        if (currentPlayer === 'computer' && flippedCards.length === 0 && !disabled) {
            const available = cards
                .map((_, index) => index)
                .filter(i => !matchedCards.has(i));

            if (available.length < 2) return;

            const [first, second] = available.sort(() => 0.5 - Math.random()).slice(0, 2);

            setDisabled(true);
            setTimeout(() => setFlippedCards([first]), 400);
            setTimeout(() => setFlippedCards([first, second]), 800);
        }
    }, [currentPlayer, flippedCards, disabled, matchedCards, cards]);

    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0) {
            setGameOver(true);
        }
    }, [matchedCards, cards]);

    const getStatusText = () => {
        if (gameOver) {
            if (playerScore > computerScore) {
                return 'YOU WIN 🎉';
            } else if (playerScore < computerScore) {
                return 'STOOPID WINS';
            } else {
                return "IT'S A TIE";
            }
        } else {
            return currentPlayer === 'human' ? 'Your turn' : 'Stoopid turn';
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-6">
            {loading && <Loading />}

            {/* Restart Button */}
            <button
                onClick={() => window.location.reload()}
                className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
            >
                Restart Game
            </button>

            {/* Turn or Winner Text */}
            <div className="text-white font-wedges text-3xl">{getStatusText()}</div>

            {/* Score Text */}
            <div className="text-white font-wedges text-lg sm:text-2xl px-4 sm:px-0 text-center">
                Your score: {playerScore} | Stoopid score: {computerScore}
            </div>

            {/* Cards */}
            <div
                className="grid gap-2 mt-4 pb-8 px-2 sm:px-0"
                style={{
                    gridTemplateColumns: `repeat(${columns}, ${cardSize}px)`
                }}
            >
                {cards.map((value, i) => {
                    const isFlipped = flippedCards.includes(i) || matchedCards.has(i);
                    return (
                        <div
                            key={i}
                            onClick={() => handleFlip(i)}
                            className="bg-green-600 border border-white flex items-center justify-center rounded-full cursor-pointer aspect-square overflow-hidden"
                            style={{
                                width: `${cardSize}px`,
                                height: `${cardSize}px`
                            }}
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