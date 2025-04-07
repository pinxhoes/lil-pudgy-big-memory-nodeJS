'use client'

import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Header() {
    const { user, logout, ready } = usePrivy()
    const pathname = usePathname()

    if (pathname === '/' || !ready) return null

    return (
        <header className="w-full h-20 bg-white text-[#00142d] flex justify-between items-center px-6 shadow-md">
            <Link
                href="/"
                className="text-2xl font-bold"
                style={{ fontFamily: 'Wedges, sans-serif' }}
            >
                Lil Pudgy Big Memory
            </Link>

            {user?.wallet?.address && (
                <div className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-[#00142d] text-white flex items-center justify-center font-bold rounded-full">
                        👤
                    </div>
                    <span className="hidden sm:block text-[#00142d] font-mono truncate max-w-[140px]">
                        {user.wallet.address}
                    </span>
                    <button
                        onClick={logout}
                        className="bg-[#00142d] text-white px-6 py-2 rounded-md font-bold text-sm"
                        style={{ fontFamily: 'Wedges, sans-serif' }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    )
}
