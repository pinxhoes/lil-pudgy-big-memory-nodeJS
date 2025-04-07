'use client'

import { usePrivy } from '@privy-io/react-auth'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
    const { user, logout, ready } = usePrivy()
    const pathname = usePathname()
    const router = useRouter()

    if (pathname === '/' || !ready) return null

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

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
                    <div className="w-8 h-8 text-white flex items-center justify-center font-bold">
                        👤
                    </div>
                    <span className="hidden sm:block text-[#00142d] font-mono truncate max-w-[140px]">
                        {user.wallet.address}
                    </span>
                    <button
                        onClick={handleLogout}
                        style={{
                            fontFamily: 'Wedges, sans-serif',
                            backgroundColor: '#00142d',
                            color: '#fff',
                            padding: '0.5rem 1rem',
                            borderRadius: '0.375rem',
                            fontSize: '0.875rem',
                            fontWeight: 'bold'
                        }}
                    >
                        Logout
                    </button>
                </div>
            )}
        </header>
    )
}