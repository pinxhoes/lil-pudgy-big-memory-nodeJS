export function generateShuffledBoard(): number[] {
    const pairs = Array.from({ length: 24 }, (_, i) => i + 1)
    const deck = [...pairs, ...pairs]

    // Shuffle the deck
    for (let i = deck.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1))
            ;[deck[i], deck[j]] = [deck[j], deck[i]]
    }

    return deck;
}