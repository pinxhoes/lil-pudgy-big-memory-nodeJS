'use client';

import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { useAuth } from '../app/providers/AuthProvider';
import Loading from './Loading';

export default function Login({
    onClose,
    onSwitchToRegister,
    onLoginSuccess,
}: {
    onClose: () => void;
    onSwitchToRegister: () => void;
    onLoginSuccess: (username: string) => void;
}) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const { setLoggedInUser } = useAuth();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await res.json();

            switch (res.status) {
                case 200:
                    setLoggedInUser(data.user.username);
                    onLoginSuccess(data.user.username);
                    break;
                case 404:
                    toast.error('User doesn’t exist or password not set');
                    break;
                case 401:
                    toast.error('Wrong password, please try again');
                    break;
                default:
                    toast.error(data.message || 'Something went wrong. Please try again.');
            }
        } catch (err) {
            console.error('Login error:', err);
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="fixed inset-0 z-50 pointer-events-none">
            {loading && <Loading />}

            <div className="absolute top-[4rem] left-0 right-0 bottom-0 backdrop-blur-sm pointer-events-auto" />

            <div className="absolute inset-0 flex items-end sm:items-center justify-center pb-[5vh] sm:pb-0 pointer-events-none">
                <div className="relative w-[90%] max-w-md h-[70vh] mt-[4.5rem] sm:mt-0 sm:h-[50vh] bg-[#4C6377]/90 rounded-[30px] shadow-xl px-6 py-8 
        animate-slide-up sm:animate-none flex flex-col justify-center items-center pointer-events-auto">

                    <div>
                        <h2 className="text-5xl text-white text-center mb-20">WELCOME BACK!</h2>
                        <div className="w-full">
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder="Enter your username"
                                    className="w-full rounded-full px-4 py-2 text-blue-950 bg-amber-50 placeholder:text-sm placeholder:font-bold"
                                    required
                                    disabled={loading}
                                />
                                <div className="relative">
                                    <input
                                        type={showPassword ? 'text' : 'password'}
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="Enter password"
                                        className="w-full rounded-full px-4 py-2 text-blue-950 bg-amber-50 placeholder:text-sm placeholder:font-bold pr-12"
                                        required
                                        disabled={loading}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword((prev) => !prev)}
                                        className="absolute right-4 top-1/2 transform -translate-y-1/2 text-blue-950"
                                        aria-label="Toggle password visibility"
                                        disabled={loading}
                                    >
                                        {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                    </button>
                                </div>
                                <button
                                    type="submit"
                                    disabled={loading}
                                    className="w-full mt-4 bg-gradient-to-b from-[#fcd34d] to-[#f59e0b] text-white font-wedges text-lg rounded-full 
                  shadow-[0_6px_18px_rgba(0,0,0,0.25)] px-6 py-3 active:scale-95 hover:brightness-110 transition-transform disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    LOG IN
                                </button>
                            </form>
                        </div>
                    </div>

                    <p className="text-center text-white text-sm mt-6">
                        DONT HAVE AN ACCOUNT?{' '}
                        <button
                            onClick={onSwitchToRegister}
                            className="text-[#C3934F] font-wedges transition-transform duration-150 hover:scale-110 active:scale-95"
                            disabled={loading}
                        >
                            SIGN UP
                        </button>
                    </p>

                    <button
                        onClick={onClose}
                        className="absolute top-2 right-4 text-5xl drop-shadow-md font-bold text-white z-10 transition-transform duration-150 hover:scale-125 active:scale-90"
                        disabled={loading}
                    >
                        ×
                    </button>
                </div>
            </div>
        </div>
    );
}