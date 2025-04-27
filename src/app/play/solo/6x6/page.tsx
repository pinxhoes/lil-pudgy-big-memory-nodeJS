'use client'

import GameBoardSolo from '@/components/GameBoard/GameBoardSolo';

export default function Game6x6() {
    return <GameBoardSolo userId="guest" gridSize={36} columns={6} rows={6} />;
}