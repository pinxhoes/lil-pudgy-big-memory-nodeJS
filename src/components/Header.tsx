'use client'

import { usePrivy } from '@privy-io/react-auth'
import { User2 } from 'lucide-react'
import LoginButton from './LoginButton'

export default function Header() {
    const { user } = usePrivy()

    return (
        <header className="flex items-center justify-between px-6 py-4 border-b border-white/20">
            <h1 className="text-xl font-bold">Lil Pudgy Big Memory</h1>

            <div className="flex items-center gap-4">
                {user?.wallet?.address && (
                    <div className="flex items-center gap-2 text-sm">
                        <div className="size-8 rounded-full bg-white text-black flex items-center justify-center">
                            <User2 className="size-5" />
                        </div>
                        <p className="truncate max-w-[10rem]">{user.wallet.address}</p>
                    </div>
                )}

                <LoginButton />
            </div>
        </header>
    )
}
