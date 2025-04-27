'use client';

import GameBoardSolo from '@/components/GameBoard/GameBoardSolo';
import { useEffect, useState } from 'react';

export default function GameTimeTrial() {
    const [userId, setUserId] = useState<string>('');

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setUserId(storedUser);
        }
    }, []);

    return (
        <main className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start pt-8 px-4">
            <h2 className="text-4xl text-white font-wedges mb-6">Time Trial Mode</h2>
            <GameBoardSolo
                userId={userId}
                gridSize={48}
                mode="timetrial"
            />
        </main>
    );
}