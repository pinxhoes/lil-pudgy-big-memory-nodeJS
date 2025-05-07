import { prisma } from './db';

export async function generateShuffledDeck(pairCount: number) {
    const allTemplates = await prisma.cardTemplate.findMany();

    if (allTemplates.length < pairCount) {
        throw new Error(
            `Not enough card templates! Requested ${pairCount} pairs, but only found ${allTemplates.length}.`
        );
    }

    // Step 1: Pick N random templates
    const selectedTemplates = shuffleArray(allTemplates).slice(0, pairCount);

    // Step 2: Duplicate each template to form pairs
    const fullDeck = [...selectedTemplates, ...selectedTemplates];

    // Step 3: Shuffle the full deck again
    return shuffleArray(fullDeck);
}

function shuffleArray<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
}