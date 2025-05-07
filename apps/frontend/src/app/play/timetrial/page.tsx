'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import GameBoardTimetrial from '../../../components/GameBoard/GameBoardTimetrial';

export default function GameTimeTrial() {
    const [username, setUsername] = useState<string>('');
    const router = useRouter();

    useEffect(() => {
        const storedUser = localStorage.getItem('loggedInUser');
        if (storedUser) {
            setUsername(storedUser);
        } else {
            router.replace('/')
        }
    }, [router]);

    return (
        <main className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-start pt-8 px-4">
            <h2 className="text-4xl text-white font-wedges mb-6">Time Trial Mode</h2>
            {username && (
                <GameBoardTimetrial
                    username={username}
                    gridSize={48}
                />
            )}
        </main>
    );
}