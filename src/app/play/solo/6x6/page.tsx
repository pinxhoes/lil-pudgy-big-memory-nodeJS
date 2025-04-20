'use client'

import StartGameButton from '@/components/StartGameButton';

export default function Game6x6() {
    return <StartGameButton userId="guest" gridSize={36} columns={6} rows={6} />;
}