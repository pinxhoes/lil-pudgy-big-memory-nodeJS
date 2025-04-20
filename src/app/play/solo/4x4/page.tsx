'use client'

import StartGameButton from '@/components/StartGameButton';

export default function Game4x4() {
    return <StartGameButton userId="guest" gridSize={16} columns={4} rows={4} />;
}