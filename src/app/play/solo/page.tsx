'use client'

import Login from '@/components/Login';
import Register from '@/components/Register';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function GameModeSelection() {
    const router = useRouter();
    const [showRegister, setShowRegister] = useState(false);
    const [showLogin, setShowLogin] = useState(false);

    return (
        <main className="min-h-[100dvh] bg-[#80abff] flex flex-col items-center justify-center px-4 text-white font-wedges">
            <div className="flex flex-col items-center justify-center space-y-10 text-center">
                <h2 className="text-5xl">Choose a Board Size</h2>

                <button
                    onClick={() => router.push('/play/solo/3x4')}
                    className="font-wedges text-3xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
          px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
          transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    3 x 4
                </button>

                <button
                    onClick={() => router.push('/play/solo/4x4')}
                    className="font-wedges text-3xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
          px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
          transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    4 x 4
                </button>

                <button
                    onClick={() => router.push('/play/solo/6x6')}
                    className="font-wedges text-3xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
          px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
          transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    6 x 6
                </button>

                <button
                    onClick={() => setShowRegister(true)}
                    className="font-wedges text-3xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
          px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
          transition-transform duration-150 active:scale-95 hover:brightness-110"
                >
                    Time Trial (Coming Soon)
                </button>
            </div>

            {showRegister && (
                <Register
                    onClose={() => setShowRegister(false)}
                    onSwitchToLogin={() => {
                        setShowRegister(false);
                        setShowLogin(true);
                    }}
                />
            )}

            {showLogin && (
                <Login
                    onClose={() => setShowLogin(false)}
                    onSwitchToRegister={() => {
                        setShowLogin(false);
                        setShowRegister(true);
                    }}
                />
            )}
        </main>
    );
}