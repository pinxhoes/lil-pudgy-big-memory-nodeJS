'use client'

import { useAbstractPrivyLogin } from '@abstract-foundation/agw-react/privy';
import { usePrivy } from '@privy-io/react-auth';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAccount } from 'wagmi';

export default function LandingPage() {
  const { login } = useAbstractPrivyLogin();
  const { authenticated } = usePrivy();
  const { status } = useAccount();
  const router = useRouter();

  useEffect(() => {
    if (authenticated && status === 'connected') {
      const timer = setTimeout(() => {
        router.push('/play')
      }, 300)

      return () => clearTimeout(timer)
    }
  }, [authenticated, status, router])


  return (
    <main className="bg-[#f5fdff] min-h-screen flex flex-col items-center text-center px-4 text-[#00142d]">
      <h1 className="w-full pt-6 pb-4 font-wedges text-3xl md:text-5xl font-bold">
        Stoopid Game
      </h1>

      <div className="flex flex-col items-center justify-center flex-grow">
        <h1 className="font-wedges text-[4rem] md:text-[5.5rem]">
          Lil Pudgy Big Memory
        </h1>

        <button
          onClick={login}
          className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
             px-[2.5rem] py-[1rem] rounded-full shadow-[0_6px_18px_rgba(0,0,0,0.25)]
             transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer"
        >
          Play Now
        </button>
      </div>
    </main>
  )
}
