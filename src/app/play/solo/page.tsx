'use client'

import { useRouter } from 'next/navigation'

export default function GameModeSelection() {
    const router = useRouter()

    return (
        <main className="flex flex-col items-center justify-center p-4 min-h-screen bg-[#80abff] space-y-6 text-white font-wedges">
            <h2 className="text-3xl mb-4">Choose a Board Size</h2>

            <button
                onClick={() => router.push('/play/solo/3x4')}
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                    px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                    transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">3 x 4
            </button>
            <button
                onClick={() => router.push('/play/solo/4x4')}
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                    px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                    transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">4 x 4
            </button>
            <button
                onClick={() => router.push('/play/solo/6x6')}
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                    px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                    transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">6 x 6
            </button>
            <button
                disabled
                className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
                    px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
                    transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed">
                Time Trial (Coming Soon)
            </button>
        </main>
    )
}