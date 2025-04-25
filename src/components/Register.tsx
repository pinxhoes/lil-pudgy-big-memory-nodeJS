'use client';

import { useState } from 'react';

export default function Register({ onClose, onSwitchToLogin }: {
    onClose: () => void; onSwitchToLogin: () => void
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        console.log({ username, password });
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {/* Blur below header */}
            <div className="absolute top-[4rem] left-0 right-0 bottom-0 backdrop-blur-sm  pointer-events-auto" />

            {/* Modal centered both on desktop and mobile */}
            <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-[5vh] sm:pb-0 pointer-events-none">
                <div className="relative w-[90%] max-w-md h-[70vh] mt-[4.5rem] sm:mt-0 sm:h-[50vh] bg-[#4C6377]/90 rounded-[30px] shadow-xl px-6 py-8 animate-slide-up sm:animate-none flex flex-col justify-center items-center pointer-events-auto">

                    <div>
                        <h2 className="text-5xl text-center mb-20">WELCOME!</h2>
                        <div className="w-full">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full rounded-full px-4 py-2 text-blue-950 bg-amber-50 placeholder:text-sm placeholder:font-bold"
                                    required
                                />
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Enter password"
                                    className="w-full rounded-full px-4 py-2 text-blue-950 bg-amber-50 placeholder:text-sm placeholder:font-bold"
                                    required
                                />
                                <button
                                    type="submit"
                                    className="w-full mt-4 bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
              shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform"
                                >
                                    REGISTER
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-sm mt-6">
                        ALREADY HAVE AN ACCOUNT?{' '}
                        <button
                            onClick={onSwitchToLogin}
                            className="text-[#C3934F] font-wedges transition-transform duration-150 hover:scale-110 active:scale-95"
                        >
                            SIGN IN
                        </button>
                    </p>

                    {/* Close Button */}
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
