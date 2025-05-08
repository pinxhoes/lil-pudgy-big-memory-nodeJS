'use client';

import Image from 'next/image';
import Link from 'next/link';
import { forwardRef, useEffect, useState } from 'react';
import { useAuth } from '../app/providers/AuthProvider';
import DropdownMenu from './DropdownMenu';

const Header = forwardRef<HTMLElement>((_, ref) => {
    const { loggedInUser, logout, openScoreboard } = useAuth();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => setDropdownOpen(prev => !prev);

    useEffect(() => {
        if (!loggedInUser) setDropdownOpen(false);
    }, [loggedInUser]);

    return (
        <header
            ref={ref}
            className="w-full bg-white rounded-b-[40px] shadow-md py-4 px-6 flex items-center justify-between z-50 relative"
        >
            <Link href="/" className="flex items-center font-wedges text-xl text-[#00142d] tracking-wide">
                STOOPID GAME
            </Link>

            {loggedInUser ? (
                <div className="relative flex items-center gap-3">
                    <span className="text-[#00142d] font-wedges text-lg">{loggedInUser.toUpperCase()}</span>
                    <button onClick={toggleDropdown} className="focus:outline-none">
                        <Image src="/img/userLogo.svg" alt="User Avatar" width={40} height={40} className="rounded-full" />
                    </button>

                    {dropdownOpen && (
                        <DropdownMenu>
                            <div className="absolute top-[5rem] right-6 w-[250px] rounded-tl-[50px] rounded-bl-[50px] rounded-br-[50px] bg-white shadow-lg flex flex-col py-6 px-4 animate-slide-down z-50">
                                <button
                                    onClick={() => {
                                        console.log('Profile clicked');
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-[#00142d] font-wedges text-lg hover:bg-gray-100 transition"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => {
                                        openScoreboard();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-[#00142d] font-wedges text-lg hover:bg-gray-100 transition"
                                >
                                    Leaderboard
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-[#00142d] font-wedges text-lg hover:bg-gray-100 transition"
                                >
                                    Logout
                                </button>
                            </div>
                        </DropdownMenu>
                    )}
                </div>
            ) : null}
        </header>
    );
});

Header.displayName = 'Header';
export default Header;