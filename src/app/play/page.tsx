'use client';

import StartGameButton from '@/components/StartGameButton';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function Play() {
    const [mode, setMode] = useState<'solo' | 'multiplayer' | null>(null);
    const router = useRouter();

    const userIdFromDB = 'guest';

    return (
        <main className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-center text-center px-4">
            <div className="flex flex-col items-center justify-center space-y-10 font-wedges">
                {!mode ? (
                    <>
                        <button
                            onClick={() => router.push('/play/solo')}
                            className="font-wedges text-2xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                transition-transform duration-150 active:scale-95 hover:brightness-110"
                        >
                            VS Stoopid
                        </button>
                        <button
                            onClick={() => setMode('multiplayer')}
                            className="text-2xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                transition-transform duration-150 active:scale-95 hover:brightness-110"
                        >
                            VS Friend
                        </button>
                    </>
                ) : mode === 'solo' ? (
                    <StartGameButton userId={userIdFromDB} gridSize={0} />
                ) : (
                    <div className="flex flex-col items-center gap-6">
                        <div className="text-[#00142d] text-xl">Multiplayer coming soon!</div>
                        <button
                            onClick={() => setMode(null)}
                            className="text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                transition-transform duration-150 active:scale-95 hover:brightness-110"
                        >
                            Back
                        </button>
                    </div>
                )}
            </div>
        </main>
    );
}