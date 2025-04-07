'use client'

import { useEffect, useState } from 'react'
import './Card.css'

type GameBoardProps = {
    //shuffled array with 24pairs
    cards: number[]
}

export default function GameBoard({ cards }: GameBoardProps) {
    const [flippedCards, setFlippedCards] = useState<number[]>([])
    const [matchedCards, setMatchedCards] = useState<Set<number>>(new Set())
    const [disabled, setDisabled] = useState(false)

    const handleFlip = (index: number) => {
        if (disabled) return
        if (flippedCards.includes(index) || matchedCards.has(index)) return

        const newFlipped = [...flippedCards, index]
        setFlippedCards(newFlipped)

        if (newFlipped.length === 2) {
            setDisabled(true)
        }
    }

    useEffect(() => {
        if (flippedCards.length === 2) {
            const [i1, i2] = flippedCards
            const isMatch = cards[i1] === cards[i2]

            setTimeout(() => {
                if (isMatch) {
                    setMatchedCards((prev) => new Set(prev).add(i1).add(i2))
                }
                setFlippedCards([])
                setDisabled(false)

                // Delay so player can see the second card
            }, 1000)
        }
    }, [flippedCards, cards])

    return (
        <div className="grid grid-cols-8 gap-2 p-4 mx-auto" style={{ width: '80vw', maxWidth: '960px' }}>
            {cards.map((value, i) => {
                const isFlipped = flippedCards.includes(i) || matchedCards.has(i)

                return (
                    <div
                        key={i}
                        onClick={() => handleFlip(i)}
                        className="aspect-square w-full rounded-full border border-white flex items-center justify-center font-bold text-xl cursor-pointer transition-transform transform hover:scale-105"
                        style={{
                            backgroundColor: isFlipped ? '#111827' : '#10b981',
                            color: isFlipped ? '#fff' : 'transparent',
                        }}
                    >
                        {value}
                    </div>
                )
            })}
        </div>
    )
}