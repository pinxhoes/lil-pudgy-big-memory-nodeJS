'use client';

import { useUser } from '@/app/providers/UserProvider';
import Image from 'next/image';
import { forwardRef, useState } from 'react';
import DropdownMenu from './DropdownMenu';

const Header = forwardRef<HTMLElement>((_, ref) => {
    const { loggedInUser, logout } = useUser();
    const [dropdownOpen, setDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setDropdownOpen((prev) => !prev);
    };

    return (
        <header
            ref={ref}
            className="w-full bg-white rounded-b-[40px] shadow-md py-4 px-6 flex items-center justify-between z-30"
        >
            <h1 className="font-wedges text-2xl text-[#00142d]">
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
                            <div className="absolute right-6 top-[80px] w-32 bg-white rounded-lg shadow-lg overflow-hidden z-50">
                                <button
                                    onClick={() => {
                                        console.log('Profile clicked');
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Profile
                                </button>
                                <button
                                    onClick={() => {
                                        logout();
                                        setDropdownOpen(false);
                                    }}
                                    className="block w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                                >
                                    Logout
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