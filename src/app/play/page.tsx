'use client';

import StartGameButton from '@/components/StartGameButton';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Play() {
    const [mode, setMode] = useState<'solo' | 'multiplayer' | null>(null);
    const router = useRouter()

    const userIdFromDB = 'guest'; // Static guest ID for now

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff] space-y-4">
            {!mode ? (
                <>
                    <button
                        className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
            px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
            transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
                        onClick={() => router.push('/play/solo')}
                    >
                        VS Stoopid
                    </button>
                    <button
                        className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
            px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
            transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
                        onClick={() => setMode('multiplayer')}
                    >
                        VS Friend
                    </button>
                </>
            ) : mode === 'solo' ? (
                <StartGameButton userId={userIdFromDB} gridSize={0} />
            ) : (
                <div className="flex flex-col items-center space-y-4">
                    <div className="text-[#00142d] text-xl font-wedges">Multiplayer coming soon!</div>
                    <button
                        onClick={() => setMode(null)}
                        className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
            px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
            transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
                    >
                        Back
                    </button>
                </div>
            )}
        </main>
    );
}
