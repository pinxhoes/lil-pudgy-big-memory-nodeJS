'use client'
import { useRouter } from 'next/navigation';

export default function LandingPage() {
  const router = useRouter()

  return (
    <main className="bg-[#80abff] min-h-screen flex items-center justify-center text-center px-4 text-[#00142d]">
      <div className="flex flex-col items-center">
        <h1 className="font-wedges text-[3rem] md:text-[5.5rem]">
          Lil Pudgy Big Memory
        </h1>

        {/* <p className="mt-10 font-wedges text-lg md:text-2xl">
          🚧 Under Construction — We will be back soon!🚧
        </p> */}

        <button
          onClick={() => router.push('/play')}
          className="mt-10 font-wedges text-xl text-white bg-gradient-to-b from-[#fcd34d] to-[#f59e0b]
            px-[2.5rem] py-[1rem] rounded-full shadow-[4px_38px_62px_0px_rgba(0,0,0,0.50)]
            transition-transform duration-150 active:scale-95 hover:brightness-110 cursor-pointer "
        >
          Play Now
        </button>

      </div>
    </main>
  )
}
