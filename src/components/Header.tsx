'use client'

import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function Header() {
    const pathname = usePathname()
    const router = useRouter()

    // ⛔️ Hide only on landing page
    if (pathname === '/') return null

    const handleLogout = () => {
        router.push('/')
    }

    return (
        <header className="w-full h-20 bg-white text-[#00142d] flex justify-between items-center px-6 shadow-md">
            <Link
                href="/"
                className="text-2xl font-bold text-[#00142d] no-underline"
                style={{ fontFamily: 'Wedges, sans-serif' }}
            >
                Lil Pudgy Big Memory
            </Link>

            <div className="flex items-center space-x-4">
                <span className="hidden sm:block text-[#00142d] font-mono truncate max-w-[140px]">
                    guest
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
        </header>
    )
}