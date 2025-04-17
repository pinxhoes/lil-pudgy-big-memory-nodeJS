'use client'

import Spinner from '@/components/Spinner'
import StartGameButton from '@/components/StartGameButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

export default function PlayPage() {
    const { address, status } = useAccount()
    const [userIdFromDB, setUserIdFromDB] = useState<string | null>(null)
    const [mode, setMode] = useState<'solo' | 'multiplayer' | null>(null)
    const router = useRouter()

    // 🚨 Redirect if not connected
    useEffect(() => {
        if (status === 'disconnected') {
            console.log('[Redirect] User is disconnected, redirecting...')
            router.push('/')
        }
    }, [status, router])

    // 👤 Pull user info from localStorage and send to backend
    useEffect(() => {
        if (status === 'connected' && address) {
            fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    wallet: address,
                    privyId: address, // use address as fallback identifier
                    username: `user-${address.slice(2, 8)}`,
                }),
            })
                .then((res) => res.json())
                .then((data) => {
                    console.log('[Login] Success:', data)
                    setUserIdFromDB(data.user.id)
                })
                .catch((err) => console.error('[Login] Error:', err))
        }
    }, [status, address])

    // 🔄 Still loading user from DB
    if (status !== 'connected' || !userIdFromDB) {
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