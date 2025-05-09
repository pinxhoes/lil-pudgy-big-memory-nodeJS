
'use client';

import { useAuth } from '@/app/providers/AuthProvider';
import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import Loading from '../Loading';
import './Card.css';

type GameBoardTimetrialProps = {
    username: string;
    gridSize: number;
};

type CardInfo = {
    id: string;
    position: number;
};

type ScoreEntry = {
    username: string;
    time: number;
};

export default function GameBoardTimetrial({ username, gridSize }: GameBoardTimetrialProps) {
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [gameId, setGameId] = useState('');
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<string>>(new Set());
    const [cardImages, setCardImages] = useState<Record<string, string>>({});
    const [disabled, setDisabled] = useState(false);
    const [cardSize, setCardSize] = useState(100);
    const [columns, setColumns] = useState(8);
    const [loading, setLoading] = useState(false);

    const [startTime, setStartTime] = useState<number | null>(null);
    const [elapsedTime, setElapsedTime] = useState(0);
    const [gameResult, setGameResult] = useState<'' | 'win' | 'lose'>('');
    const [bestTime, setBestTime] = useState<number | null>(null);
    const timerIdRef = useRef<NodeJS.Timeout | null>(null);

    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const { openScoreboard } = useAuth();


    const createNewGame = useCallback(async () => {
        setLoading(true);
        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/createTimetrial`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gridSize, username }),
            });

            const data = await res.json();
            if (res.ok && data.cards && data.gameId) {
                setCards(data.cards);
                setGameId(data.gameId);
            }
            const scoreRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/scoreboard`);
            const scoreData: ScoreEntry[] = await scoreRes.json();

            const myScore = scoreData.find(entry => entry.username === username);
            if (myScore) {
                setBestTime(myScore.time);
            }
        } catch (error) {
            console.error('[Initial Game Error]:', error);
        } finally {
            setLoading(false);
        }
    }, [gridSize, username]);

    useEffect(() => {
        if (username) createNewGame();
    }, [createNewGame, username]);

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

    const handleFlip = useCallback(async (cardId: string) => {
        if (disabled || flippedCards.includes(cardId) || matchedCards.has(cardId)) return;

        const isFirstClick = flippedCards.length === 0 && matchedCards.size === 0;
        if (isFirstClick && startTime === null) {
            const now = Date.now();
            setStartTime(now);
            setElapsedTime(0);
            setIsTimerRunning(true);

            const timer = setInterval(() => {
                setElapsedTime(Date.now() - now);
            }, 100);
            timerIdRef.current = timer;
        }

        const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/card/reveal`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ gameId, cardId }),
        });

        if (res.ok) {
            const blob = await res.blob();
            const url = URL.createObjectURL(blob);
            setCardImages(prev => ({ ...prev, [cardId]: url }));
            setFlippedCards(prev => [...prev, cardId]);
        }

        if (flippedCards.length === 1) setDisabled(true);
    }, [disabled, flippedCards, matchedCards, startTime, gameId]);

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [id1, id2] = flippedCards;

            setTimeout(async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/card/checkMatch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cardIds: [id1, id2] }),
                });

                const result = await res.json();
                const isMatch = res.status === 200 && result.matched === true;

                if (isMatch) {
                    setMatchedCards(prev => new Set(prev).add(id1).add(id2));
                } else {
                    setTimeout(() => {
                        setCardImages(prev => {
                            const updated = { ...prev };
                            delete updated[id1];
                            delete updated[id2];
                            return updated;
                        });
                    }, 300);
                }

                setFlippedCards([]);
                setDisabled(false);
            }, 800);
        }
    }, [flippedCards]);


    const formatTime = (ms: number) => {
        const totalSeconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        const msFormatted = String(milliseconds).padStart(2, '0');
        return `${m}:${s}:${msFormatted}`;
    };

    const submitScore = useCallback(async (username: string, finaltime: number) => {
        try {
            await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/scoreboard/submit`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, gameId, time: finaltime }),
            });
        } catch (error) {
            console.error('Error submitting score:', error);
        }
    }, [gameId]);

    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0 && startTime) {
            if (timerIdRef.current) {
                clearInterval(timerIdRef.current);
                timerIdRef.current = null;
                setIsTimerRunning(false);
            }

            const finalTime = Date.now() - startTime;
            if (username) submitScore(username, finalTime);

            if (bestTime === null || finalTime < bestTime) {
                setBestTime(finalTime);
                setGameResult('win');
            } else {
                setGameResult('lose');
            }
        }
    }, [matchedCards, cards, startTime, bestTime, username, submitScore]);

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-6">
            {loading && <Loading />}

            <div className="flex flex-col items-center gap-4">
                <button
                    onClick={() => window.location.reload()}
                    className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    Restart Game
                </button>

                {isTimerRunning ? (
                    <button
                        onClick={() => {
                            if (timerIdRef.current) {
                                clearInterval(timerIdRef.current);
                                timerIdRef.current = null;
                            }
                            setIsTimerRunning(false);
                            setStartTime(null);
                            setElapsedTime(0);
                            setMatchedCards(new Set());
                            setFlippedCards([]);
                            setCardImages({});
                            setGameResult('');
                            createNewGame();
                        }}
                        className="font-wedges text-xl text-white bg-gradient-to-b from-[#f87171] to-[#ef4444]
        px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                    >
                        Stop Game
                    </button>
                ) : (
                    <button
                        onClick={openScoreboard}
                        className="font-wedges text-xl text-white bg-gradient-to-b from-[#597ab0] to-[#00142D]
        px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
                    >
                        Leaderboard
                    </button>
                )}
            </div>

            {/* Timers */}
            <div className="flex flex-col items-center text-white font-wedges text-2xl gap-1">
                <div>Best time: {bestTime && bestTime > 0 ? formatTime(bestTime) : '--:--:--'}</div>
                <div>Your time: {formatTime(elapsedTime)}</div>
            </div>

            {gameResult && (
                <div className="text-white font-wedges text-4xl mt-2">
                    {gameResult === 'win' ? 'NEW RECORD! 🎉' : 'FINISHED 🐧'}
                </div>
            )}

            <div
                className="grid gap-2 mt-4 pb-8"
                style={{ gridTemplateColumns: `repeat(${columns}, ${cardSize}px)` }}
            >
                {cards.map(({ id }) => {
                    const isFlipped = flippedCards.includes(id) || matchedCards.has(id);
                    const imageUrl = cardImages[id];
                    return (
                        <div
                            key={id}
                            onClick={() => handleFlip(id)}
                            className="bg-green-600 border border-white flex items-center justify-center rounded-full cursor-pointer aspect-square overflow-hidden"
                            style={{ width: `${cardSize}px`, height: `${cardSize}px` }}
                        >
                            <Image
                                src={isFlipped && imageUrl ? imageUrl : '/img/gameLogo.svg'}
                                alt="card"
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
