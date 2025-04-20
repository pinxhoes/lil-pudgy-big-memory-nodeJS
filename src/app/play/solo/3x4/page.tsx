'use client'

import StartGameButton from '@/components/StartGameButton';

export default function Game3x4() {
    return <StartGameButton userId="guest" gridSize={12} columns={4} rows={3} />;
}