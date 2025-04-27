'use client';

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
    mode?: 'solo' | 'timetrial';
};

export default function GameBoardSolo({
    cards: initialCards,
    columns = 8,
    userId,
    gridSize,
    mode = 'solo',
}: GameBoardProps) {
    const [cards, setCards] = useState<number[]>(initialCards ?? []);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
    const [disabled, setDisabled] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'human' | 'computer'>('human');
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [playerScore, setPlayerScore] = useState(0);

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [computerScore, setComputerScore] = useState(0);
    const [cardSize, setCardSize] = useState(100);
    const [loading, setLoading] = useState(false);
    const [columnsState, setColumnsState] = useState(columns);

    // Timer for Time Trial
    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameResult, setGameResult] = useState<'' | 'win' | 'lose'>('');
    const [bestTime, setBestTime] = useState<number | null>(null);

    // Fetch deck
    useEffect(() => {
        if (!initialCards || initialCards.length === 0) {
            if (!userId) return;

            const createNewGame = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/game/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ mode: 'solo', player1Id: userId, gridSize }),
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

    // Handle layout and columns
    useEffect(() => {
        const updateLayout = () => {
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;
            const dynamicColumns = isMobile ? 6 : 8;

            setColumnsState(dynamicColumns);

            const maxWidth = screenWidth * 0.9;
            const maxHeight = (window.innerHeight * (isMobile ? 0.6 : 0.75));
            const totalRows = Math.ceil(cards.length / dynamicColumns);

            const cardWidth = maxWidth / dynamicColumns;
            const cardHeight = maxHeight / totalRows;

            const size = Math.min(cardWidth, cardHeight, 200);
            setCardSize(size);
        };

        updateLayout();
        window.addEventListener('resize', updateLayout);
        return () => window.removeEventListener('resize', updateLayout);
    }, [cards.length]);

    // Fetch best time
    type ScoreEntry = {
        username: string;
        time: number;
    };

    // Start timer after first flip
    const handleFlip = useCallback((index: number) => {
        if (disabled || (mode === 'solo' && currentPlayer !== 'human')) return;
        if (flippedCards.includes(index) || matchedCards.has(index)) return;

        const isFirstClick = flippedCards.length === 0 && matchedCards.size === 0;

        if (mode === 'timetrial' && isFirstClick) {
            const now = Date.now();
            setStartTime(now);
            setElapsedTime(0);

            const timer = setInterval(() => {
                setElapsedTime(Date.now() - now);
            }, 100);

            window.addEventListener('beforeunload', () => clearInterval(timer));
        }

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
        }
    }, [disabled, currentPlayer, flippedCards, matchedCards, mode]);

    // Check for match
    useEffect(() => {
        if (flippedCards.length === 2) {
            const [i1, i2] = flippedCards;
            const isMatch = cards[i1] === cards[i2];

            setTimeout(() => {
                if (isMatch) {
                    setMatchedCards((prev) => new Set(prev).add(i1).add(i2));
                    if (mode === 'solo') {
                        if (currentPlayer === 'human') {
                            setPlayerScore((prev) => prev + 1);
                        } else {
                            setComputerScore((prev) => prev + 1);
                        }
                    }
                } else if (mode === 'solo') {
                    setCurrentPlayer((prev) => (prev === 'human' ? 'computer' : 'human'));
                }

                setFlippedCards([]);
                setDisabled(false);
            }, 800);
        }
    }, [flippedCards, cards, mode, currentPlayer]);

    // Timer ticking
    useEffect(() => {
        if (mode === 'timetrial') {
            const fetchBestTime = async () => {
                try {
                    const res = await fetch('/api/scoreboard');
                    const data: ScoreEntry[] = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        const best = Math.min(...data.map((entry) => entry.time));
                        setBestTime(best);
                    }
                } catch (err) {
                    console.error('[BestTimeFetch] Error:', err);
                }
            };

            fetchBestTime();
        }
    }, [mode]);

    // End game
    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0 && mode === 'timetrial') {
            if (startTime) {
                const finalTime = Date.now() - startTime;
                if (bestTime === null || finalTime < bestTime) {
                    setGameResult('win');
                } else {
                    setGameResult('lose');
                }
            }
        }
    }, [matchedCards, cards, startTime, mode, bestTime]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        const msFormatted = String(milliseconds).padStart(2, '0');
        return `${h}:${m}:${s}.${msFormatted}`;
    };

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-6">
            {loading && <Loading />}

            <div className="flex flex-col items-center gap-4">
                {/* Restart Button */}
                <button
                    onClick={() => window.location.reload()}
                    className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
    px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    Restart Game
                </button>

                {/* Stop Button only for timetrial mode */}
                {mode === 'timetrial' && (
                    <button
                        onClick={() => window.location.reload()}
                        className="font-wedges text-xl text-white bg-gradient-to-b from-[#f87171] to-[#ef4444]
      px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                    >
                        Stop Game
                    </button>
                )}
            </div>

            {mode === 'timetrial' && (
                <div className="flex flex-col items-center text-white font-wedges text-2xl gap-1">
                    <div>Best time: {bestTime !== null ? formatTime(bestTime) : '--:--:--'}</div>
                    <div>Your time: {formatTime(elapsedTime)}</div>
                </div>
            )}

            {gameResult && (
                <div className="text-white font-wedges text-4xl mt-2">
                    {gameResult === 'win' ? 'YOU WIN! 🎉' : 'GAME OVER 🥲'}
                </div>
            )}

            {/* Cards */}
            <div
                className="grid gap-2 mt-4"
                style={{
                    gridTemplateColumns: `repeat(${columnsState}, ${cardSize}px)`,
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
                                height: `${cardSize}px`,
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