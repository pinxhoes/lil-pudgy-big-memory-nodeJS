'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';

type ScoreEntry = {
    username: string;
    time: number;
};

export default function Scoreboard({
    onClose,
    currentUsername,
    scoreboardData,
}: {
    onClose: () => void;
    currentUsername: string;
    scoreboardData: ScoreEntry[];
}) {
    const router = useRouter();

    const formatTime = (seconds: number): string => {
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        return `${h} : ${m} : ${s}`;
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute top-[4rem] left-0 right-0 bottom-0 backdrop-blur-sm pointer-events-auto" />

            <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-[5vh] sm:pb-0 pointer-events-none">
                <div className="relative w-[90%] max-w-md sm:max-w-5xl h-[80vh] mt-[4.5rem] sm:mt-0 sm:h-[70vh] bg-[#4C6377]/90 rounded-[30px] shadow-xl px-6 py-8 
          animate-slide-up sm:animate-none flex flex-col items-center pointer-events-auto overflow-hidden">

                    <h2 className="text-3xl sm:text-5xl text-center mb-2 font-wedges">SCOREBOARD</h2>

                    <div className="flex flex-col w-full gap-2 overflow-y-auto scrollbar-hide max-h-[50vh] sm:max-h-[40vh]">
                        {scoreboardData.map((entry, index) => {
                            const isTop = index === 0;
                            const isCurrentUser = entry.username === currentUsername;
                            const bgColor = isTop
                                ? '#E8C77A'
                                : isCurrentUser
                                    ? '#EA9B9C'
                                    : 'rgba(255, 255, 255, 0.9)';

                            return (
                                <div
                                    key={entry.username}
                                    className="flex items-center justify-between px-4 py-2 rounded-full shadow"
                                    style={{ backgroundColor: bgColor }}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className={`font-wedges text-xl ${isTop || isCurrentUser ? 'text-white' : 'text-[#4C6377]'}`}>
                                            {isCurrentUser ? 'YOU' : index + 1}
                                        </span>
                                        <Image
                                            src="/img/userLogo.svg"
                                            alt="Avatar"
                                            width={32}
                                            height={32}
                                            className="rounded-full"
                                        />
                                        <span className={`${isTop || isCurrentUser ? 'text-white' : 'text-[#4C6377]'} font-bold uppercase`}>
                                            {entry.username}
                                        </span>
                                    </div>
                                    <span className={`${isTop || isCurrentUser ? 'text-white' : 'text-[#4C6377]'} font-bold`}>
                                        {formatTime(entry.time)}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <button
                        onClick={() => router.push('/play/timetrial')}
                        className="mt-6 bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
              shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform"
                    >
                        BEAT THE RECORD
                    </button>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-4 text-5xl drop-shadow-md font-bold text-white z-10 transition-transform duration-150 hover:scale-125 active:scale-90"
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}