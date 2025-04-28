'use client';

import { useUser } from '@/app/providers/UserProvider';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { forwardRef, useState } from 'react';
import DropdownMenu from './DropdownMenu';

const Header = forwardRef<HTMLElement>((_, ref) => {
    const { loggedInUser, setLoggedInUser } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const router = useRouter();

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    const handleLogout = () => {
        setLoggedInUser('');
        localStorage.removeItem('loggedInUser');
        router.push('/');
    };

    return (
        <header
            ref={ref}
            className="w-full bg-white rounded-b-[40px] shadow-md py-4 px-6 flex items-center justify-between z-50 relative"
        >
            <h1 className="flex items-center font-wedges text-xl text-[#00142d] tracking-wide">
                STOOPID GAME
            </h1>

            {loggedInUser && (
                <div className="relative flex items-center gap-3">
                    <span className="text-[#00142d] font-wedges text-lg">
                        {loggedInUser.toUpperCase()}
                    </span>
                    <button onClick={toggleDropdown} className="focus:outline-none">
                        <Image
                            src="/img/userLogo.svg"
                            alt="User Avatar"
                            width={40}
                            height={40}
                            className="rounded-full"
                        />
                    </button>

                    {dropdownOpen && (
                        <DropdownMenu>
                            <>
                                {/* Blur background */}
                                <div className="fixed inset-0 bg-transparent backdrop-blur-sm z-40 pointer-events-none" />

                                {/* Dropdown menu */}
                                <div className="fixed top-[5rem] right-6 w-[250px] rounded-tl-[50px] rounded-bl-[50px] rounded-br-[50px] bg-white shadow-lg flex flex-col py-6 px-4 animate-slide-down z-50">
                                    {/* Buttons inside here */}
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
                                            if (typeof window !== 'undefined' && window.openScoreboardFromDropdown) {
                                                window.openScoreboardFromDropdown(); // ✅ fetch & open
                                            }
                                            setDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-6 py-4 text-[#00142d] font-wedges text-lg hover:bg-gray-100 transition"
                                    >
                                        Scoreboard
                                    </button>

                                    <button
                                        onClick={() => {
                                            handleLogout();
                                            setDropdownOpen(false);
                                        }}
                                        className="block w-full text-left px-6 py-4 text-[#00142d] font-wedges text-lg hover:bg-gray-100 transition"
                                    >
                                        Logout
                                    </button>
                                </div>
                            </>
                        </DropdownMenu>
                    )}
                </div>
            )}
        </header>
    );
});

Header.displayName = 'Header';

export default Header;