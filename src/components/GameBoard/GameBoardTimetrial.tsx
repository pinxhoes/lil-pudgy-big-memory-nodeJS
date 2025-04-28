'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Loading from '../Loading';
import './Card.css';

type GameBoardTimetrialProps = {
    cards?: number[];
    username: string;
    gridSize: number;
};

type ScoreEntry = {
    username: string;
    time: number;
};

export default function GameBoardTimetrial({
    cards: initialCards,
    username,
    gridSize,
}: GameBoardTimetrialProps) {
    const [cards, setCards] = useState<number[]>(initialCards ?? []);
    const [flippedCards, setFlippedCards] = useState<number[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set());
    const [disabled, setDisabled] = useState(false);
    const [cardSize, setCardSize] = useState(100);
    const [columns, setColumns] = useState(8);
    const [loading, setLoading] = useState(false);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameResult, setGameResult] = useState<'' | 'win' | 'lose'>('');
    const [bestTime, setBestTime] = useState<number | null>(null);
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!initialCards || initialCards.length === 0) {
            if (!username) return;

            const createNewGame = async () => {
                setLoading(true);
                try {
                    const res = await fetch('/api/game/create', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ gridSize, username, mode: 'timetrial' }),
                    });

                    const data = await res.json();

                    if (res.ok) {
                        if (data.deck) {
                            setCards(data.deck);
                        } else if (data.game?.deck) {
                            setCards(data.game.deck);
                        } else {
                            console.error('[Initial Game] Invalid deck structure:', data);
                        }
                    }
                } catch (error) {
                    console.error('[Initial Game Error]:', error);
                } finally {
                    setLoading(false);
                }
            };

            createNewGame();
        }
    }, [initialCards, username, gridSize]);

    useEffect(() => {
        const updateLayout = () => {
            const screenWidth = window.innerWidth;
            const isMobile = screenWidth < 768;
            const dynamicColumns = isMobile ? 6 : 8;
            setColumns(dynamicColumns);

            const maxWidth = screenWidth * 0.9;
            const maxHeight = isMobile ? window.innerHeight * 0.6 : window.innerHeight * 0.75;
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

    const handleFlip = useCallback((index: number) => {
        if (disabled) return;
        if (flippedCards.includes(index) || matchedCards.has(index)) return;

        const isFirstClick = flippedCards.length === 0 && matchedCards.size === 0;
        if (isFirstClick && startTime === null) {
            const now = Date.now();
            setStartTime(now);
            setElapsedTime(0);

            const timer = setInterval(() => {
                setElapsedTime(Date.now() - now);
            }, 100);

            timerIdRef.current = timer;

            window.addEventListener('beforeunload', () => {
                if (timerIdRef.current) clearInterval(timerIdRef.current);
            });
        }

        const newFlipped = [...flippedCards, index];
        setFlippedCards(newFlipped);

        if (newFlipped.length === 2) {
            setDisabled(true);
        }
    }, [disabled, flippedCards, matchedCards, startTime]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [i1, i2] = flippedCards;
            const isMatch = cards[i1] === cards[i2];

            setTimeout(() => {
                if (isMatch) {
                    setMatchedCards(prev => new Set(prev).add(i1).add(i2));
                }
                setFlippedCards([]);
                setDisabled(false);
            }, 800);
        }
    }, [flippedCards, cards]);

    useEffect(() => {
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
    }, []);

    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0) {
            if (startTime) {
                if (timerIdRef.current) {
                    clearInterval(timerIdRef.current);
                    timerIdRef.current = null;
                }

                const finalTime = Date.now() - startTime;

                // Always submit the score first
                if (username) {
                    submitScore(username, finalTime);
                }

                // Then decide if it's a win or lose
                if (bestTime === null || finalTime < bestTime) {
                    setGameResult('win');
                } else {
                    setGameResult('lose');
                }
            }
        }
    }, [matchedCards, cards, startTime, bestTime, username]);

    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        //const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        const msFormatted = String(milliseconds).padStart(2, '0');
        return `${m}:${s}:${msFormatted}`;
    };

    const submitScore = async (username: string, finaltime: number) => {
        try {
            console.log('[Submitting score]', { username, finaltime });
            const res = await fetch('/api/score/submit', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, time: finaltime }),
            });

            const data = await res.json();
            console.log('[Submit response]', data);

            if (!res.ok) {
                console.error('Failed to submit score:', data.message);
            } else {
                console.log('Score submitted successfully:', data);
            }
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    };

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-6">
            {loading && <Loading />}

            <div className="flex flex-col items-center gap-4">
                {/* Restart and Stop */}
                <button
                    onClick={() => window.location.reload()}
                    className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                    px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    Restart Game
                </button>

                <button
                    onClick={() => {
                        if (timerIdRef.current) {
                            clearInterval(timerIdRef.current);
                            timerIdRef.current = null;
                        }
                    }}
                    className="font-wedges text-xl text-white bg-gradient-to-b from-[#f87171] to-[#ef4444]
  px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    Stop Game
                </button>
            </div>

            {/* Timers */}
            <div className="flex flex-col items-center text-white font-wedges text-2xl gap-1">
                <div>Best time: {bestTime !== null ? formatTime(bestTime) : '--:--:--'}</div>
                <div>Your time: {formatTime(elapsedTime)}</div>
            </div>

            {/* Result */}
            {gameResult && (
                <div className="text-white font-wedges text-4xl mt-2">
                    {gameResult === 'win' ? 'YOU WIN! 🎉' : 'GAME OVER 🥲'}
                </div>
            )}

            {/* Cards Grid */}
            <div
                className="grid gap-2 mt-4 pb-8"
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