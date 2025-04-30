import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateShuffledDeck(size = 48): number[] {
  const totalPairs = Math.floor(size / 2);
  const pairs = Array.from({ length: totalPairs }, (_, i) => i + 1);
  const fullDeck = [...pairs, ...pairs];

  for (let i = fullDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [fullDeck[i], fullDeck[j]] = [fullDeck[j], fullDeck[i]];
  }

  return fullDeck;
}