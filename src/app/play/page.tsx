'use client'

import Spinner from '@/components/Spinner';
import StartGameButton from '@/components/StartGameButton';
import { usePrivy } from '@privy-io/react-auth';
import { useEffect, useState } from 'react';

export default function Home() {
    const { authenticated, user } = usePrivy();
    const [userIdFromDB, setUserIdFromDB] = useState<string | null>(null);
    const [mode, setMode] = useState<'solo' | 'multiplayer' | null>(null);


    useEffect(() => {
        if (
            authenticated &&
            user?.id &&
            user?.wallet?.address
        ) {
            const wallet = user.wallet.address
            const privyId = user.id
            const username = user.email?.address?.split('@')[0] ?? 'anon'

            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ wallet, privyId, username }),
            })
                .then((res) => res.json())
                .then((data) => {
                    setUserIdFromDB(data.user.id)
                })
                .catch((err) => console.error('[Login] Error:', err))
        }
    }, [authenticated, user]);

    if (!userIdFromDB) {
        return (
            <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff]">
                <Spinner />
            </main>
        )
    }

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff] space-y-4">
            {!mode ? (
                <>
                    <button
                        className="mt-6 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] px-10 py-3 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
                        onClick={() => setMode('solo')}
                    >
                        VS Stoopid
                    </button>
                    <button
                        className="mt-6 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] px-10 py-3 rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)] transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
                        onClick={() => setMode('multiplayer')}
                    >
                        VS Friend
                    </button>
                </>
            ) : mode === 'solo' ? (
                <StartGameButton userId={userIdFromDB} />
            ) : (
                <div className="text-[#00142d]">Multiplayer coming soon!</div>
            )}
        </main>
    )
}