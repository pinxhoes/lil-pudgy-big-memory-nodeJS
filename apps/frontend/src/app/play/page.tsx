'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '../providers/AuthProvider';

export default function Play() {
    const router = useRouter();
    const { loggedInUser, openLogin } = useAuth();
    const [mode, setMode] = useState<'multiplayer' | null>(null);
    const handleTimetrialClick = () => {
        if (!loggedInUser) {
            openLogin();
        } else {
            router.push('/play/timetrial');
        }
    };

    return (
        <main className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-center px-4 text-center">
            <div className="flex flex-col items-center justify-center space-y-10 font-wedges">
                {!mode ? (
                    <>
                        <button
                            onClick={() => router.push('/play/solo')}
                            className="text-2xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
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
                            VS Friends
                        </button>

                        <button
                            onClick={handleTimetrialClick}
                            className="text-2xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                transition-transform duration-150 active:scale-95 hover:brightness-110"
                        >
                            Time Trial
                        </button>
                    </>
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
