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
            className="w-full bg-white rounded-b-[40px] shadow-md py-4 px-6 flex items-center justify-between z-30"
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
                            <div
                                className="fixed right-6 top-[6rem] w-40 sm:w-48 bg-white rounded-b-[30px] rounded-tl-[30px] shadow-[0_6px_18px_rgba(0,0,0,0.25)] overflow-hidden z-50 font-wedges
      animate-slide-down"
                                style={{ minWidth: '10rem' }}
                            >
                                <button
                                    onClick={() => {
                                        console.log('Profile clicked');
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-[#00142d] hover:bg-gray-100 text-lg tracking-wide"
                                >
                                    PROFILE
                                </button>
                                <button
                                    onClick={() => {
                                        handleLogout();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-6 py-4 text-[#00142d] hover:bg-gray-100 text-lg tracking-wide"
                                >
                                    LOGOUT
                                </button>
                            </div>
                        </DropdownMenu>
                    )}
                </div>
            )}
        </header>
    );
});

Header.displayName = 'Header';

export default Header;