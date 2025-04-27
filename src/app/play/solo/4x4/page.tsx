'use client'

import GameBoardSolo from '@/components/GameBoard/GameBoardSolo';

export default function Game4x4() {
    return <GameBoardSolo userId="guest" gridSize={16} columns={4} rows={4} />;
}