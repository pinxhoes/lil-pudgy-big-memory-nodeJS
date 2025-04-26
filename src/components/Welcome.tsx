'use client';

import Image from 'next/image';

export default function Welcome({ username, onPlayNow, onViewRecord, onClose }: {
    username: string;
    onPlayNow: () => void;
    onViewRecord: () => void;
    onClose: () => void;
}) {

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            <div className="absolute top-[4rem] left-0 right-0 bottom-0 backdrop-blur-sm pointer-events-auto" />

            <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-[5vh] sm:pb-0 pointer-events-none">
                <div className="relative w-[90%] max-w-md h-[70vh] mt-[4.5rem] sm:mt-0 sm:h-[50vh] bg-[#4C6377]/90 rounded-[30px] shadow-xl px-6 py-8 
        animate-slide-up sm:animate-none flex flex-col justify-center items-center pointer-events-auto">

                    <h2 className="text-3xl sm:text-5xl text-center mb-2 font-wedges">WELCOME {username.toUpperCase()}!</h2>

                    <div className="mb-2">
                        <Image src="/img/userLogo.svg" alt="User Icon" width={190} height={190} className="rounded-full" />
                    </div>

                    <div className="w-full flex flex-col gap-4">
                        <button
                            onClick={onPlayNow}
                            className="w-full bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
              shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform"
                        >
                            PLAY NOW
                        </button>
                        <button
                            onClick={onViewRecord}
                            className="w-full bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
              shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform"
                        >
                            TIME RECORD
                        </button>
                    </div>

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
