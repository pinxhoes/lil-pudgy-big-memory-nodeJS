'use client'

import GameBoardSolo from '../../../../components/GameBoard/GameBoardSolo';

export default function Game3x4() {
    return <GameBoardSolo gridSize={12} columns={4} rows={3} />;
}