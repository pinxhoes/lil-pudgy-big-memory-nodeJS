'use client';

import Image from 'next/image';
import { useCallback, useEffect, useState } from 'react';
import Loading from '../Loading';
import './Card.css';

interface CardInfo {
    id: string;
    position: number;
}

export default function GameBoardSolo({
    columns,
    rows,
    gridSize,
}: {
    columns: number;
    rows: number;
    gridSize: number;
}) {
    const [cards, setCards] = useState<CardInfo[]>([]);
    const [gameId, setGameId] = useState('');
    const [flippedCards, setFlippedCards] = useState<string[]>([]);
    const [matchedCards, setMatchedCards] = useState<Set<string>>(new Set());
    const [cardImages, setCardImages] = useState<Record<string, string>>({});
    const [disabled, setDisabled] = useState(false);
    const [currentPlayer, setCurrentPlayer] = useState<'human' | 'computer'>('human');
    const [playerScore, setPlayerScore] = useState(0);
    const [computerScore, setComputerScore] = useState(0);
    const [cardSize, setCardSize] = useState(100);
    const [loading, setLoading] = useState(false);
    const [gameOver, setGameOver] = useState(false);
    const [turnTrigger, setTurnTrigger] = useState(0);

    useEffect(() => {
        const fetchSoloDeck = async () => {
            setLoading(true);
            try {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/game/createSolo`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ gridSize }),
                });
                const data = await res.json();
                if (res.ok && data.cards && data.gameId) {
                    setCards(data.cards);
                    setGameId(data.gameId);
                } else {
                    console.error('[SOLO Deck Error]', data);
                }
            } catch (err) {
                console.error('[SOLO Fetch Error]', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSoloDeck();
    }, [gridSize]);

    useEffect(() => {
        const updateSize = () => {
            const screenWidth = window.innerWidth;
            const maxWidth = screenWidth * 0.9;
            const maxHeight = window.innerHeight * 0.75;
            const size = Math.min(maxWidth / columns, maxHeight / rows, 200);
            setCardSize(size);
        };
        updateSize();
        window.addEventListener('resize', updateSize);
        return () => window.removeEventListener('resize', updateSize);
    }, [columns, rows]);

    const handleFlip = useCallback(
        async (cardId: string) => {
            if (
                disabled ||
                flippedCards.includes(cardId) ||
                matchedCards.has(cardId) ||
                flippedCards.length === 2
            )
                return;

            const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/card/reveal`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ gameId, cardId }),
            });

            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setCardImages((prev) => ({ ...prev, [cardId]: url }));
                setFlippedCards((prev) => [...prev, cardId]);
            }
        },
        [disabled, flippedCards, matchedCards, gameId]
    );

    useEffect(() => {
        if (flippedCards.length === 2) {
            setDisabled(true);
            const [id1, id2] = flippedCards;

            const evaluate = async () => {
                const res = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/card/checkMatch`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ cardIds: [id1, id2] }),
                });

                const result = await res.json();
                const isMatch = res.status === 200 && result.matched === true;

                if (isMatch) {
                    setMatchedCards((prev) => new Set(prev).add(id1).add(id2));
                    if (currentPlayer === 'human') {
                        setPlayerScore((p) => p + 1);
                    } else {
                        setComputerScore((p) => p + 1);
                        // ⏱ slight delay before computer plays again
                        setTimeout(() => {
                            setTurnTrigger((t) => t + 1);
                        }, 300);
                    }

                    setFlippedCards([]);
                    setDisabled(false);
                } else {
                    // delay to show unmatched cards
                    setTimeout(() => {
                        setCardImages((prev) => {
                            const rest = { ...prev };
                            delete rest[id1];
                            delete rest[id2];
                            return rest;
                        });

                        setFlippedCards([]);
                        setDisabled(false);

                        const nextPlayer = currentPlayer === 'human' ? 'computer' : 'human';
                        setCurrentPlayer(nextPlayer);
                        if (nextPlayer === 'computer') {
                            setTurnTrigger((t) => t + 1);
                        }
                    }, 800);
                }
            };

            setTimeout(evaluate, 300);
        }
    }, [flippedCards, currentPlayer]);

    useEffect(() => {
        if (currentPlayer !== 'computer') return;
        if (flippedCards.length !== 0 || disabled) return;

        const available = cards.filter(
            (c) => !matchedCards.has(c.id) && !flippedCards.includes(c.id)
        );
        if (available.length < 2) return;

        const [c1, c2] = available.sort(() => 0.5 - Math.random()).slice(0, 2);
        setDisabled(true);

        setTimeout(() => {
            handleFlip(c1.id);
            setTimeout(() => {
                handleFlip(c2.id);
            }, 600); // delay between card 1 and 2
        }, 400);
    }, [turnTrigger, currentPlayer, flippedCards, disabled, matchedCards, cards, handleFlip]);

    useEffect(() => {
        if (matchedCards.size === cards.length && cards.length > 0) setGameOver(true);
    }, [matchedCards, cards]);

    const getStatus = () => {
        if (gameOver)
            return playerScore > computerScore
                ? 'YOU WIN 🎉'
                : playerScore < computerScore
                    ? 'STOOPID WINS 🐧'
                    : "IT'S A TIE 🤝";
        return currentPlayer === 'human' ? 'Your turn' : 'Stoopid turn';
    };

    return (
        <div className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start px-4 pt-8 gap-6">
            {loading && <Loading />}

            <button
                onClick={() => window.location.reload()}
                className="font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] px-[2.5rem] py-[1rem] rounded-full shadow transition-transform duration-150 active:scale-95 hover:brightness-110"
            >
                Restart Game
            </button>

            <div className="text-white font-wedges text-3xl">{getStatus()}</div>

            <div className="text-white font-wedges text-lg sm:text-2xl px-4 sm:px-0 text-center">
                Your score: {playerScore} | Stoopid score: {computerScore}
            </div>

            <div
                className="grid gap-2 mt-4 pb-8 px-2 sm:px-0"
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