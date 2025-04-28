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

    const formatTime = (ms: number): string => {
        const totalSeconds = Math.floor(ms / 1000);
        const milliseconds = Math.floor((ms % 1000) / 10);
        const h = String(Math.floor(totalSeconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((totalSeconds % 3600) / 60)).padStart(2, '0');
        const s = String(totalSeconds % 60).padStart(2, '0');
        const msFormatted = String(milliseconds).padStart(2, '0');
        return `${h} : ${m} : ${s} : ${msFormatted}`;
    };

    return (
        <div className="fixed inset-0 z-20 pointer-events-none">
            {/* Blur background below header */}
            <div className="absolute top-[4.7rem] left-0 right-0 bottom-0 backdrop-blur-sm pointer-events-auto" />

            {/* Modal layout */}
            <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-[5vh] sm:pb-0 pointer-events-none">
                <div className="relative w-[90%] max-w-md h-[70vh] mt-[4.5rem] sm:mt-0 sm:h-[50vh] bg-[#4C6377]/60 rounded-[30px] shadow-xl px-6 py-8 
          animate-slide-up sm:animate-none flex flex-col items-center pointer-events-auto overflow-hidden">

                    {/* Title */}
                    <h2 className="text-5xl text-center mb-6 font-wedges text-white">
                        SCOREBOARD
                    </h2>

                    {/* Scrollable list */}
                    <div className="flex flex-col w-full gap-2 overflow-y-auto px-1 scrollbar-thin scrollbar-thumb-[#fcd34d] scrollbar-track-transparent rounded-lg max-h-[40vh]">
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
                                    key={`${entry.username}-${index}`}
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

                    {/* Beat the Record button */}
                    <button

                        onClick={() => {
                            onClose();
                            router.push('/play/solo/timetrial')
                        }}
                        className="mt-6 bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
              shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform"
                    >
                        BEAT THE RECORD
                    </button>

                    {/* Close button */}
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