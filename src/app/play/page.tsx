'use client'

import Spinner from '@/components/Spinner'
import StartGameButton from '@/components/StartGameButton'
import { usePrivy } from '@privy-io/react-auth'
import { useEffect, useState } from 'react'

export default function Home() {
    const { authenticated, user } = usePrivy()
    const [userIdFromDB, setUserIdFromDB] = useState<string | null>(null)

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
    }, [authenticated, user])

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff]">
            {userIdFromDB ? (
                <StartGameButton userId={userIdFromDB} />
            ) : (
                <div className="flex flex-col items-center mt-8 text-[#00142d]">
                    <Spinner />
                </div>
            )}
        </main>
    )
}